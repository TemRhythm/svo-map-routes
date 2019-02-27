import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { MapRoutingService } from '../map-routing/services/map-routing.service';
import { MapRoutingZone } from '../map-routing/interfaces/map-routing-zone';
import { Point } from '../map-routing/interfaces/point';
import { MapRoutingGrid } from '../map-routing/interfaces/map-routing-grid';
import { toPoints } from 'svg-points';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private cdr: ChangeDetectorRef,
              private elRef: ElementRef) {}

  zone: MapRoutingZone = null;
  grid: MapRoutingGrid = null;
  stepWidth = 25;
  randomPoints: Point[];


  routePoints = [
    {x: 90, y: 250},
    {x: 300, y: 350}
  ];

  generatePoints() {
    this.randomPoints = MapRoutingService.getRouteBetweenRandPoints(this.zone, this.stepWidth);
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.zone = {
      points: toPoints({
        type: 'path',
        d: this.elRef.nativeElement.querySelector('.walk-zone').getAttribute('d')
      }).map(p => p as Point)
    };
    this.grid = MapRoutingService.getGrid(this.zone, this.stepWidth);
    // this.randomPoints = MapRoutingService.getRouteBetweenRandPoints(this.zone, this.stepWidth);
    this.randomPoints = MapRoutingService.getRoutePoints(this.zone, this.stepWidth, this.routePoints);
    this.cdr.detectChanges();
  }
}
