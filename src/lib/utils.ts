import { Src, SrcObj, UpVector } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Box3, Euler, Object3D, Sphere, Vector3 } from 'three';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function areObjectsIdentical(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getBoundingSphereRadius(object: Object3D) {
  const box = new Box3().setFromObject(object);
  const sphere = box.getBoundingSphere(new Sphere());
  return sphere.radius;
}

export function normalizeSrc(src: Src): SrcObj[] {
  const srcs: SrcObj[] = [];

  if (typeof src === 'string') {
    srcs.push({
      url: src as string,
    });
  } else if (Array.isArray(src)) {
    // if it's an array, then it's already a ModelSrc object
    srcs.push(...(src as SrcObj[]));
  } else {
    // if it's not a string or an array, then it's a single ModelSrc object
    srcs.push(src as SrcObj);
  }

  return srcs;
}

export const copyText = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

export const downloadJsonFile = (json: string) => {
  const fileName = "aleph_annotations.json";
  const data = new Blob([json], { type: "text/json" });
  const jsonURL = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = jsonURL;
  link.setAttribute("download", fileName);
  link.click();
  document.body.removeChild(link);
}

export const parseAnnotations = (value: any) => {
  const parsed = JSON.parse(value);

  parsed.forEach((anno: any) => {
    anno.cameraPosition = new Vector3().fromArray(Object.values(anno.cameraPosition));
    anno.cameraTarget = new Vector3().fromArray(Object.values(anno.cameraTarget));
    anno.normal = new Vector3().fromArray(Object.values(anno.normal));
    anno.position = new Vector3().fromArray(Object.values(anno.position));
  });

  return parsed;
};

export function getElementTranslate(el: HTMLElement): number[] | null {
  let x: number;
  let y: number;

  const transformValue = el.getAttribute('transform');
  let translateValues: string[] | null = null;

  if (transformValue) {
    const match = transformValue.match(/translate\(([^)]+)\)/);
    if (match) {
      translateValues = match[1].split(', ');
    }
  }

  if (translateValues) {
    x = Number(translateValues[0]);
    y = Number(translateValues[1]);

    return [x, y];
  }

  return null;
}

export function setElementTranslate(el: HTMLElement, x: number, y: number) {
  el?.setAttribute('transform', `translate(${x}, ${y})`);
}

export function getEulerAnglesFromOrientation(orientation: UpVector): [number, number, number] {
  const orientationToEulerAngles = {
    'y-positive': [0, 0, 0], // default rotation, points "up"
    'y-negative': [0, 0, Math.PI], // rotate 180 degrees around Z ccw, points "down"
    'z-positive': [-Math.PI/2, 0, 0], // rotate 90 degrees around X ccw, points "back"
    'z-negative': [Math.PI/2, 0, 0] // rotate 270 degrees around X ccw, points "forward"
  };
  return orientationToEulerAngles[orientation] as [number, number, number];
}

export function getEulerFromOrientation(orientation: UpVector): Euler {
  return new Euler().fromArray(getEulerAnglesFromOrientation(orientation || 'y-positive'));
}
