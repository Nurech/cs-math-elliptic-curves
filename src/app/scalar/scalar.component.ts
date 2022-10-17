import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MathService } from '../math.service';
import { UtilsService } from '../utils.service';
import { FunctionPlotDatum, FunctionPlotOptions } from 'function-plot/dist/types';
import functionPlot from 'function-plot';
import { isPrime } from 'mathjs';

@Component({
  selector: 'app-scalar',
  templateUrl: './scalar.component.html',
  styleUrls: ['./scalar.component.css']
})
export class ScalarComponent implements AfterViewInit, OnInit {

  @ViewChild('container') container!: ElementRef;

  private destroyed$ = new Subject<void>();
  private disableZoom = true;

  a: number = 10;
  b: number = 10;
  p: number[] = [29, 34];  // P[x,y]
  q: number[] = [91, 83];  // Q = P*k
  k: number = 101;
  n: number = 20;
  subGrpNumber = 0;

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
    if (url && url.pathname.includes('scalar')) {
      console.warn(url.searchParams.get('a'));
      this.a = url.searchParams.get('a') !== null ? Number(url.searchParams.get('a')) : this.a;
      this.b = url.searchParams.get('b') !== null ? Number(url.searchParams.get('b')) : this.b;
      this.p[0] = url.searchParams.get('p0') !== null ? Number(url.searchParams.get('p0')) : this.p[0];
      this.p[1] = url.searchParams.get('p1') !== null ? Number(url.searchParams.get('p1')) : this.p[1];
      this.q[0] = url.searchParams.get('q0') !== null ? Number(url.searchParams.get('q0')) : this.q[0];
      this.q[1] = url.searchParams.get('q1') !== null ? Number(url.searchParams.get('q1')) : this.q[1];
      this.k = url.searchParams.get('k') !== null ? Number(url.searchParams.get('k')) : this.k;
      this.n = url.searchParams.get('n') !== null ? Number(url.searchParams.get('n')) : this.n;
    }
    console.warn(url);
    console.warn(this.a);
  }


  // Render plotter, then build data onto it
  ngAfterViewInit() {
    setTimeout(() => this.build());
  }


  /**
   * Readjusted because relative dependency changes
   */
  recalculate() {
    this.q = this.math.scalarQ(this.n, this.p, this.k, this.a);
    this.subGrpNumber = this.math.fnGetSubgroupOrder(this.k, this.a, this.p);
  }


  // Builds plotter with options
  build() {
    this.getValues();
    this.points = this.math.getAllPoints(this.p, this.k, this.a);
    this.recalculate();

    // Sometimes Function Plotter has trouble removing some elements when resetting options
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
    let params = {'a': this.a, 'b': this.b, 'p0': this.p[0], 'q0': this.q[0], 'p1': this.p[1], 'q1': this.q[1], 'k': this.k, 'n': this.n};
    this.utilsService.addParams(params);
  }


// Reset to defaults
  reset() {
    this.a = 10;
    this.b = 10;
    this.p = [29, 34];  // P[x,y]
    this.q = [91, 83];  // Q = P*k
    this.k = 101;
    this.n = 20;
    this.subGrpNumber = 0;
    this.linePoints = [];
    this.build();
    this.utilsService.showSuccess('Reset');
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

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
    } else if (key === 'n') {
      this.n = event;
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
   * Builds array containing data to make lines, points.
   * Data is consumed by Function Plot js
   */
  getPlotData() {
    return [
      ...this.getPointCords(), // Points
      {points: [[this.p[0], this.p[1]]], color: '#4682b3', fnType: 'points', graphType: 'scatter'}, // P
      {points: [[this.q[0], this.q[1]]], color: '#e5555e', fnType: 'points', graphType: 'scatter'} // Q
    ];
  }

  getValues() {
    this.prime = isPrime(this.k);
    if (!this.prime) {
      this.utilsService.showWarn(this.k + ' is not a prime number!');
    }
    this.curvePoints = this.math.gnCurvePoints(this.a, this.b, this.k);
    this.p = this.math.fnRecalculatePQ(this.p, this.prevP, this.curvePoints);
  }

}
