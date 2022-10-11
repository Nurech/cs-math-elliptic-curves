import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MathService } from '../math.service';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../utils.service';
import { FunctionPlotOptions } from 'function-plot/dist/types';
import functionPlot from 'function-plot';

@Component({
  selector: 'app-addition',
  templateUrl: './addition.component.html',
  styleUrls: ['./addition.component.css']
})
export class AdditionComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('container') container!: ElementRef;

  show = true;
  private destroyed$ = new Subject<void>();

  constructor(private math: MathService,
              public utilsService: UtilsService) {
  }

  add: any = {a: -7, b: 10, N: 34, x1: 1, y1: 2, x2: 3, y2: 4, x3: -3, y3: 2}; // defaults
  xMin = this.math.fnX0(this.add.a, this.add.b);
  content = `$y^{2}=x^{3}+${this.add.a}x+${this.add.b}$`;

  ngOnInit() {
    // Get params from url (if any)
    const url = new URL(window.location.href); //TODO refactor to use router.params
    if (url) {
      for (let k of Object.keys(this.add)) {
        if(url.searchParams.get(k) !== null) {
          this.add[k] = Number(url.searchParams.get(k));
          console.log(`Loaded from url ${k} : ${Number(url.searchParams.get(k))}`);
        }
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.refresh();
    })
  }

  // Builds plotter with options
  build() {
    let option: FunctionPlotOptions = {
      target: '#graph',
      width: 450,
      xDomain: [-10, 10],
      yDomain: [-10, 10],
      disableZoom: false,
      yAxis: {domain: [-10, 10]},
      xAxis: {domain: [-10, 10]},
      grid: true,
      data: [
        {fn: '-' + this.math.fnCurve(this.add.a, this.add.b), color: '#e7a649'}, // curve negative x
        {fn: this.math.fnCurve(this.add.a, this.add.b), color: '#e7a649'}, // curve pos x
        {fn: this.math.fnPQ(this.add.x1, this.add.y1, this.add.x2, this.add.y2, this.add.a), fnType: 'linear', color: '#4682b4'}, // line
        {points: [[this.add.x1, this.add.y1]], color: '#4682b3', fnType: 'points', graphType: 'scatter'}, // P
        {points: [[this.add.x2, this.add.y2]], color: '#e5555e', fnType: 'points', graphType: 'scatter'}, // Q
        {
          points: [this.math.fnR(this.add.x1, this.add.y1, this.add.x2, this.add.y2, this.add.a)],
          color: '#22c55e',
          fnType: 'points',
          graphType: 'scatter'
        }, // R
        {
          vector: this.math.fnRv(this.add.x1, this.add.y1, this.add.x2, this.add.y2, this.add.a),
          offset: this.math.fnPQi(this.add.x1, this.add.y1, this.add.x2, this.add.y2, this.add.a),
          graphType: 'polyline',
          fnType: 'vector',
          color: '#22c55e'
        } // P->Q = R
      ]
    };

    this.add.x3 = this.math.fnR(this.add.x1, this.add.y1, this.add.x2, this.add.y2, this.add.a)[0];
    this.add.y3 = this.math.fnR(this.add.x1, this.add.y1, this.add.x2, this.add.y2, this.add.a)[1];

    functionPlot(option);
    this.utilsService.addParams(this.add);
  }

  // Set the options again for re-build
  refresh() {
    this.reCalcPy();
    this.reCalcPx();
    this.reCalcQy();
    this.reCalcQx();
    this.build();
  }

  reCalcPy() {
    this.add.y1 = this.math.reCalcPQy(this.add.a, this.add.b, this.add.x1);
    this.reCalcPx(); // check x bounds basically
    this.build();
  }

  reCalcPx() {
    this.add.x1 = this.math.reCalcPQx(this.add.a, this.add.b, this.add.x1, null, this.add.y1, null);
    this.build();
  }

  reCalcQy() {
    this.add.y2 = this.math.reCalcPQy(this.add.a, this.add.b, this.add.x2);
    this.reCalcPx(); // check x bounds basically
    this.build();
  }

  reCalcQx() {
    this.add.x2 = this.math.reCalcPQx(this.add.a, this.add.b, null, this.add.x2, null, this.add.y2);
    this.build();
  }

// Reset to defaults
  reset() {
    this.add = {a: -7, b: 10, N: 34, x1: 1, y1: 2, x2: 3, y2: 4, x3: -3, y3: 2};
    this.refresh();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
