import '../style.css';
import React, { RefObject, Suspense, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { GLTF } from '../components/GLTF';
import {
  CameraControls,
  Environment,
  Html,
  OrthographicCamera,
  PerspectiveCamera,
  useHelper,
  useProgress,
} from '@react-three/drei';
import { BoxHelper, Group, Intersection, Object3D, Vector3 } from 'three';
import useStore from '../Store';
import { AlephProps, Annotation, ModelSrc } from '@/types';
import { formatVector3AsString } from '../lib/utils';

function Scene({
  annotation,
  ambientLightIntensity = 0,
  arrowHelpers,
  axes,
  boundingBox,
  environment,
  grid,
  minDistance = 0,
  onLoad,
  orthographic,
  src,
  upVector = [0, 1, 0],
}: AlephProps) {
  const boundsRef = useRef<Group | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const { scene, camera, pointer, raycaster } = useThree();

  const DOT_PRODUCT_THRESHOLD = -0.3; // if the dot product is less than this, then the normal is facing away from the camera

  // set the camera up vector
  camera.up.copy(new Vector3(upVector[0], upVector[1], upVector[2]));
  cameraControlsRef.current?.updateCameraUp();

  const { setAnnotations, setModelSrcs, modelSrcs, annotations } = useStore();

  const handleHomeEvent = () => {
    home();
  };

  // register/unregister event handlers
  useEffect(() => {
    // @ts-ignore
    window.addEventListener('alhome', handleHomeEvent);

    return () => {
      // @ts-ignore
      window.removeEventListener('alhome', handleHomeEvent);
    };
  }, []);

  // src changed
  useEffect(() => {
    const modelSrcs: ModelSrc[] = [];

    // is the src a string or an array of ModelSrc objects?
    // if it's a string, create a ModelSrc object from it
    if (typeof src === 'string') {
      const modelSrc: ModelSrc = {
        url: src as string,
      };

      modelSrcs.push(modelSrc);
    } else if (Array.isArray(src)) {
      // if it's an array, then it's already a ModelSrc object
      modelSrcs.push(...(src as ModelSrc[]));
    } else {
      // if it's not a string or an array, then it's a single ModelSrc object
      modelSrcs.push(src as ModelSrc);
    }

    setModelSrcs(modelSrcs);
  }, [src]);

  function zoomToObject(object: Object3D, instant?: boolean, padding: number = 0.1) {
    cameraControlsRef.current!.fitToBox(object, !instant, {
      cover: false,
      paddingLeft: padding,
      paddingRight: padding,
      paddingBottom: padding,
      paddingTop: padding,
    });
  }

  function home(instant?: boolean, padding?: number) {
    if (boundsRef.current) {
      zoomToObject(boundsRef.current, instant, padding);
    }
  }

  function Bounds({ lineVisible, children }: { lineVisible?: boolean; children: React.ReactNode }) {
    const boundsLineRef = useRef<Group | null>(null);

    // @ts-ignore
    useHelper(boundsLineRef, BoxHelper, 'white');

    // disabling as inteferes with double click
    // const handleOnClick = (e: any) => {
    //   e.stopPropagation();
    //   if (e.delta <= 2) {
    //     zoomToObject(e.object);
    //   }
    // };

    // const handleOnPointerMissed = (_e: any) => {
    //   home();
    // };

    // return (
    //   <group ref={boundsRef} onClick={handleOnClick} onPointerMissed={handleOnPointerMissed}>
    //     {lineVisible ? <group ref={boundsLineRef}>{children}</group> : children}
    //   </group>
    // );

    return <group ref={boundsRef}>{lineVisible ? <group ref={boundsLineRef}>{children}</group> : children}</group>;
  }

  function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    if (progress === 100) {
      setTimeout(() => {
        home(true);
        if (onLoad) {
          onLoad();
        }
      }, 1);
    }

    return <Html wrapperClass="loading">{Math.ceil(progress)} %</Html>;
  }

  function Annotation() {
    const lastAnnoLength = useRef<number>(0);

    let annoNormalFacingCameraCheckMS: number = 100;

    useEffect(() => {
      // @ts-ignore
      window.addEventListener('aldblclick', handleDoubleClickEvent);

      return () => {
        // @ts-ignore
        window.removeEventListener('aldblclick', handleDoubleClickEvent);
      };
    }, []);

    const handleDoubleClickEvent = () => {
      raycaster.setFromCamera(pointer, camera);

      const intersects: Intersection<Object3D<Event>>[] = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        setAnnotations([
          ...annotations,
          {
            label: `${annotations.length + 1}`,
            position: intersects[0].point,
            normal: intersects[0].face?.normal!,
          },
        ]);
      }
    };

    function isFacingCamera(position: Vector3, normal: Vector3): boolean {
      // const cameraPosition: Vector3 = new Vector3();
      // cameraPosition.copy(camera.position);

      // const copiedPosition: Vector3 = new Vector3();
      // copiedPosition.copy(position);

      const cameraDirection: Vector3 = camera.position.clone().normalize().sub(position.clone().normalize());
      const dotProduct: number = cameraDirection.dot(normal);

      if (dotProduct < DOT_PRODUCT_THRESHOLD) {
        return false;
      }

      return true;
    }

    function checkNormalsFacingDirection() {
      // loop through all annotations and check if their normals
      // are facing towards or away from the camera

      const annosChanged = lastAnnoLength.current !== annotations.length;

      // if the number of annotations has changed, then we need to
      // check the normals immediately
      if (annosChanged) {
        annoNormalFacingCameraCheckMS = 1;
      } else {
        annoNormalFacingCameraCheckMS = 10;
      }

      annotations.forEach((anno: Annotation, idx: number) => {
        const annoEl: HTMLElement = document.getElementById(`anno-${idx}`)!;

        if (annosChanged) {
          annoEl.classList.add('no-fade');
        } else {
          annoEl.classList.remove('no-fade');
        }

        if (isFacingCamera(anno.position, anno.normal)) {
          annoEl.classList.remove('disabled');
        } else {
          annoEl.classList.add('disabled');
        }
      });

      lastAnnoLength.current = annotations.length;
    }

    useEffect(() => {
      const interval = setInterval(() => {
        checkNormalsFacingDirection();
      }, annoNormalFacingCameraCheckMS);

      return () => clearInterval(interval);
    }, []);

    return (
      <>
        {annotations.map((anno, idx) => {
          return (
            <React.Fragment key={idx}>
              {arrowHelpers && <arrowHelper args={[anno.normal, anno.position, 0.05, 0xffffff]} />}
              <Html position={anno.position}>
                <div id={`anno-${idx}`} className="annotation">
                  <div
                    className="circle"
                    onClick={(e) => {
                      if (isFacingCamera(anno.position, anno.normal)) {
                        console.log(`clicked ${idx}`);
                      }
                    }}>
                    <span className="label">{anno.label}</span>
                  </div>
                </div>
              </Html>
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return (
    <>
      {orthographic ? (
        <OrthographicCamera makeDefault position={[0, 0, 2]} near={0} zoom={200} />
      ) : (
        <PerspectiveCamera position={[0, 0, 2]} fov={50} near={0.01} />
      )}
      <CameraControls ref={cameraControlsRef} minDistance={minDistance} />
      <ambientLight intensity={ambientLightIntensity} />
      <Bounds lineVisible={boundingBox}>
        <Suspense fallback={<Loader />}>
          {modelSrcs.map((modelSrc, index) => {
            return <GLTF key={index} {...modelSrc} />;
          })}
        </Suspense>
      </Bounds>
      <Environment preset={environment} />
      {annotation && <Annotation />}
      {grid && <gridHelper args={[100, 100]} />}
      {axes && <axesHelper args={[5]} />}
    </>
  );
}

function triggerHomeEvent() {
  const event = new CustomEvent('alhome');
  window.dispatchEvent(event);
}

function triggerDoubleClickEvent(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const event = new CustomEvent('aldblclick', { detail: e });
  window.dispatchEvent(event);
}

const Aleph = (props: AlephProps, ref: ((instance: unknown) => void) | RefObject<unknown> | null | undefined) => {
  useImperativeHandle(ref, () => ({
    home: () => {
      triggerHomeEvent();
    },
  }));

  return (
    <Canvas
      onDoubleClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        triggerDoubleClickEvent(e);
      }}>
      <Scene {...props} />
    </Canvas>
  );
};

export default forwardRef(Aleph);
