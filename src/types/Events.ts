export const DBL_CLICK = 'aldblclick';
export const ANNO_CLICK = 'alannoclick';
export const RECENTER_CLICK = 'alrecenterclick';
export const CAMERA_UPDATE = 'alcameraupdate';
export const DRAGGING_MEASUREMENT = 'aldraggingmeasurement';
export const DROPPED_MEASUREMENT = 'aldraggedmeasurement';

export type Event =
  | typeof DBL_CLICK
  | typeof ANNO_CLICK
  | typeof RECENTER_CLICK
  | typeof CAMERA_UPDATE
  | typeof DRAGGING_MEASUREMENT
  | typeof DROPPED_MEASUREMENT;
