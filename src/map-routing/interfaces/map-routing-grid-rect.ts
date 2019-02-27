import { Point } from './point';

export interface MapRoutingGridRect {
  points: Point[];
  isAllowedToWalk: boolean;
}
