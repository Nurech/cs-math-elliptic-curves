import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MathService, PlotDims } from '../math.service';
import { UtilsService } from '../utils.service';
import { FunctionPlotDatum, FunctionPlotOptions } from 'function-plot/dist/types';
import functionPlot from 'function-plot';
import { isNaN, isPrime } from 'mathjs';

@Component({
  selector: 'app-field-addition',
  templateUrl: './field-addition.component.html',
  styleUrls: ['./field-addition.component.css']
})
export class FieldAdditionComponent implements OnDestroy, AfterViewInit, OnInit {

  @ViewChild('container') container!: ElementRef;

  private destroyed$ = new Subject<void>();
  private plotDims: PlotDims = {xMin: 0, xMax: 100, yMin: 0, yMax: 100};
  private disableZoom = true;

  a: number   = 5;
  b: number   = 10;
  p: number[] = [11, 16]; // P[x,y]
  q: number[] = [18, 2];  // Q[x,y]
  r: number[] = [];       // R[x,y]
  k: number   = 19;

  linePoints: number[][] = [];
  points: number[][] = [];
  prime: boolean = false;
  curvePoints: number[][] = [];
  private prevP: any;
  private prevQ: any;

  constructor(private math: MathService, public utilsService: UtilsService) {}

  /**
   * Get params from url if any
   */
  ngOnInit() {
    const url = new URL(window.location.href);
    if (url && url.pathname.includes('addition')) {
      this.a = url.searchParams.get('a') !== null ? Number(url.searchParams.get('a')) : this.a;
      this.b = url.searchParams.get('b') !== null ? Number(url.searchParams.get('b')) : this.b;
      this.p[0] = url.searchParams.get('p0') !== null ? Number(url.searchParams.get('p0')) : this.p[0];
      this.p[1] = url.searchParams.get('p1') !== null ? Number(url.searchParams.get('p1')) : this.p[1];
      this.q[0] = url.searchParams.get('q0') !== null ? Number(url.searchParams.get('q0')) : this.q[0];
      this.q[1] = url.searchParams.get('q1') !== null ? Number(url.searchParams.get('q1')) : this.q[1];
      this.r[0] = url.searchParams.get('r0') !== null ? Number(url.searchParams.get('r0')) : this.r[0];
      this.r[1] = url.searchParams.get('r1') !== null ? Number(url.searchParams.get('r1')) : this.r[1];
      this.k = url.searchParams.get('k') !== null ? Number(url.searchParams.get('k')) : this.k;
    }
  }


  // Render plotter, then build data onto it
  ngAfterViewInit() {
    setTimeout(() => this.build());
  }


  // Builds plotter with options
  build() {
    this.getValues();
    this.points = this.math.fnGetAllPQPoints(this.p, this.k, this.a);
    this.linePoints = this.math.fnLinePoints(this.p, this.q, this.a, this.plotDims, this.k);
    this.r = this.math.fnAddPoint(this.p, this.q, this.k, this.a);


    // Sometimes Function Plotter has trouble removing some when resetting options
    document.querySelectorAll('g[class=\'graph\']').forEach(e => e.remove());

    let option: FunctionPlotOptions = {
      target: '#graph2',
      width: 450,
      disableZoom: this.disableZoom,
      yAxis: {domain: [0, this.k]},
      xAxis: {domain: [0, this.k]},
      grid: true,
      data: this.getPlotData()
    };

    functionPlot(option);
    let params = {
      'a': this.a,
      'b': this.b,
      'p0': this.p[0],
      'q0': this.q[0],
      'r0': this.r[0],
      'p1': this.p[1],
      'q1': this.q[1],
      'r1': this.r[1],
      'k': this.k
    };
    this.utilsService.addParams(params);
  }


// Reset to defaults
  reset() {
    this.a = 5;
    this.b = 10;
    this.p = [11, 16]; // P[x,y]
    this.q = [18, 2];  // Q[x,y]
    this.r = [];       // R[x,y]
    this.k = 19;
    this.linePoints = [];
    this.build();
    this.utilsService.showSuccess('Reset');
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  // Input received here to determine validity before setting to this
  input(key: string, event: any) {
    this.prevP = JSON.parse(JSON.stringify(this.p));
    this.prevQ = JSON.parse(JSON.stringify(this.q));
    if (event === null) {
      return;
    }
    if (key === 'a') {
      this.a = event;
    } else if (key === 'b') {
      this.b = event;
    } else if (key === 'p') {
      this.p = event;
    } else if (key === 'q') {
      this.q = event;
    } else if (key === 'k') {
      this.k = event;
    }
    this.build();
  }


  /**
   * Build points (p) for plotter from data
   */
  getPointCords(): any[] {
    let points = [];
    for (const element of this.curvePoints) {
      let point: FunctionPlotDatum = {
        points: [[element[0], element[1]]],
        color: '#6f6f6f',
        fnType: 'points',
        graphType: 'scatter'
      };
      points.push(point);
    }
    return points;
  }

  /**
   * Build vector lines on plotter, fixed with cords from edge to edge
   * (because it's finite field implicit functions can't be used)
   */
  getLineCords(): any[] {
    let lines = [];
    for (let i = 0; i < this.linePoints.length; i++) {
      let x1 = this.linePoints[i][0];
      let y1 = this.linePoints[i][1];
      let x2 = this.linePoints[i + 1][0];
      let y2 = this.linePoints[i + 1][1];
      let vector: FunctionPlotDatum = {points: [[x1, y1], [x2, y2]], color: '#e7a649', fnType: 'points', graphType: 'polyline'};
      lines.push(vector);
      i++;
    }
    return lines;
  }


  /**
   * Builds array containing data to make lines, points.
   * Data is consumed by Function Plot js
   */
  getPlotData() {
    let data = [
      ...this.getLineCords(),  // Lines
      ...this.getPointCords(), // Points
      {points: [[this.q[0], this.q[1]]], color: '#e5555e', fnType: 'points', graphType: 'scatter'}, // Q
      {points: [[this.p[0], this.p[1]]], color: '#4682b3', fnType: 'points', graphType: 'scatter'}, // P
      {points: [[this.r[0], this.r[1]]], color: '#22c55e', fnType: 'points', graphType: 'scatter'}  // R
    ];

    if (!isNaN(this.r[0]) && !isNaN(this.r[1])) {
      let PQi: number[] = [this.r[0], this.k - this.r[1]]; // intersection of P and Q on curve
      let vectorR: FunctionPlotDatum = {
        points: [[PQi[0], PQi[1]], [this.r[0], this.r[1]]], // Line from PQi to R (basically it's R-)
        color: '#22c55e', fnType: 'points', graphType: 'polyline'
      };
      data.push(vectorR);
    }

    return data;
  }

  getValues() {
    this.prime = isPrime(this.k);
    if (!this.prime) {this.utilsService.showWarn(this.k + ' is not a prime number!');}
    this.curvePoints = this.math.gnCurvePoints(this.a, this.b, this.k);
    this.p = this.math.fnRecalculatePQ(this.p, this.prevP, this.curvePoints);
    this.q = this.math.fnRecalculatePQ(this.q, this.prevQ, this.curvePoints);
  }

}
