import { Injectable } from '@angular/core';
import { MapRoutingZone } from '../interfaces/map-routing-zone';
import { Point } from '../interfaces/point';
import { MapRoutingGrid } from '../interfaces/map-routing-grid';
import { MapRoutingGridRect } from '../interfaces/map-routing-grid-rect';
import PF from 'pathfinding';
import inside from 'point-in-polygon';

@Injectable({
  providedIn: 'root'
})
export class MapRoutingService {

  constructor() { }

  private static getMaxMinPointsForZone(zone): Point[] {
    return [
      zone.points
        .reduce((acc, cur) => ({
          x: acc.x > cur.x ? cur.x : acc.x,
          y: acc.y > cur.y ? cur.y : acc.y
        })),
      zone.points
        .reduce((acc, cur) => ({
          x: acc.x < cur.x ? cur.x : acc.x,
          y: acc.y < cur.y ? cur.y : acc.y
        }))
    ];
  }

  private static generateMatrix(zone: MapRoutingZone, stepWidth) {
    const maxMinPoints = MapRoutingService.getMaxMinPointsForZone(zone);

    const matrix = [];

    for (let i = 0; i < maxMinPoints[1].y / stepWidth; i++) {
      const row = [];
      for (let j = 0; j < maxMinPoints[1].x / stepWidth; j++) {

        const pointToCheck = [
          j * stepWidth + stepWidth / 2,
          i * stepWidth + stepWidth / 2
        ];

        const isPointAllowed = MapRoutingService.isPointInZone(pointToCheck, zone) ? 0 : 1;

        row.push(isPointAllowed);

      }
      matrix.push(row);
    }
    return matrix;
  }

  static getGrid(zone: MapRoutingZone, stepWidth = 25): MapRoutingGrid {
    const matrix = MapRoutingService.generateMatrix(zone, stepWidth);
    return {
      rects: [].concat.apply([], matrix.map((mr, i) => {
        return mr.map((mc, j) => {
          return ({
            points: [
              {x: j * stepWidth, y: i * stepWidth},
              {x: (j + 1) * stepWidth, y: i * stepWidth},
              {x: (j + 1) * stepWidth, y: (i + 1) * stepWidth},
              {x: j * stepWidth, y: (i + 1) * stepWidth}
            ],
            isAllowedToWalk: !mc
          }) as MapRoutingGridRect;
        });
      })),
    };
  }

  private static isPointInZone(point, zone): boolean {

    const zonePoints = zone.points.map(p => ([
      p.x,
      p.y
    ]));

    return inside(point, zonePoints);

  }

  private static randBetween(max, min) {
    return Math.round(Math.random() * (max - min) + min);
  }

  private static generateRandPointInZone(zone): Point {
    const maxMinPoints = MapRoutingService.getMaxMinPointsForZone(zone);
    do {
      const point = [
        this.randBetween(maxMinPoints[0].x, maxMinPoints[1].x),
        this.randBetween(maxMinPoints[0].y, maxMinPoints[1].y)
      ];

      if (MapRoutingService.isPointInZone(point, zone)) {
        return {
          x: point[0],
          y: point[1]
        };
      }

    }
    while (true);
  }

  static getRouteBetweenRandPoints(zone, stepWidth = 25): Point[] {
    return MapRoutingService.getRoutePoints(zone, stepWidth, [
      MapRoutingService.generateRandPointInZone(zone),
      MapRoutingService.generateRandPointInZone(zone)
    ]);
  }

  static getRoutePoints(zone: MapRoutingZone, stepWidth = 25, points: Point[] = []): Point[] {
    const matrix = MapRoutingService.generateMatrix(zone, stepWidth);

    const grid = new PF.Grid(matrix);

    const finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
    });

    const matrixPointsIndexes = [
      Math.floor(points[0].x / stepWidth),
      Math.floor(points[0].y / stepWidth),
      Math.floor(points[1].x / stepWidth),
      Math.floor(points[1].y / stepWidth)
    ];

    return finder.findPath(matrixPointsIndexes[0], matrixPointsIndexes[1], matrixPointsIndexes[2], matrixPointsIndexes[3], grid).map(p => ({
      x: p[0] * stepWidth + stepWidth / 2 ,
      y: p[1] * stepWidth + stepWidth / 2
    }));

  }
}
