import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import functionPlot from 'function-plot';
import { FunctionPlotOptions } from 'function-plot/dist/types';
import { MathService } from './math.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit {

  @ViewChild('container') container!: ElementRef;

  show = true;

  constructor(private math: MathService, private route: ActivatedRoute) {
  }

  // Latex content
  a = -7;
  b = 10;
  N = 34;
  x1 = 1; // P
  y1 = 2; // P
  x2 = 3; // Q
  y2 = 4; // Q
  x3 = -3; // R
  y3 = 2; // R
  labels = [];
  xMin = this.math.xMin(this.a, this.b);
  content = `$y^{2}=x^{3}+${this.a}x+${this.b}$`;

  ngOnInit() {
    this.route.queryParams
        // .filter(params => params.order)
        .subscribe(params => {
            console.log(params);
            //
            // this.order = params.order;
            //
            // console.log(this.order); // popular
          }
        );
  }

  ngAfterViewInit() {
    this.build();
  }

  build() {
    // console.clear()

    let option: FunctionPlotOptions = {
      target: '#graph',
      width: 450,
      disableZoom: false,
      yAxis: {domain: [-10, 10]},
      xAxis: {domain: [-10, 10]},
      grid: true,
      data: [
        {fn: '-' + this.math.fnCurve(this.a, this.b), color: '#e7a649'}, // curve negative x
        {fn: this.math.fnCurve(this.a, this.b), color: '#e7a649'}, // curve pos x
        {fn: this.math.fnPQ(this.x1, this.y1, this.x2, this.y2, this.a), fnType: 'linear', color: '#4682b4'}, // line
        {points: [[this.x1, this.y1]], color: '#4682b3', fnType: 'points', graphType: 'scatter'}, // P
        {points: [[this.x2, this.y2]], color: '#e5555e', fnType: 'points', graphType: 'scatter'}, // Q
        {points: [this.math.fnR(this.x1, this.y1, this.x2, this.y2, this.a)], color: '#22c55e', fnType: 'points', graphType: 'scatter'}, // R
        {
          vector: this.math.fnRv(this.x1, this.y1, this.x2, this.y2, this.a),
          offset: this.math.fnPQi(this.x1, this.y1, this.x2, this.y2, this.a),
          graphType: 'polyline',
          fnType: 'vector',
          color: '#22c55e'
        } // P->Q = R
      ]
    };

    this.x3 = this.math.fnR(this.x1, this.y1, this.x2, this.y2, this.a)[0];
    this.y3 = this.math.fnR(this.x1, this.y1, this.x2, this.y2, this.a)[1];

    functionPlot(option);
    // this.logOptions(option);
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
    this.y1 = this.math.reCalcPQy(this.a, this.b, this.x1);
    this.reCalcPx();
    this.build();
  }

  reCalcPx() {
    this.x1 = this.math.reCalcPQx(this.a, this.b, this.x1, null);
    this.build();
  }

  reCalcQy() {
    this.y2 = this.math.reCalcPQy(this.a, this.b, this.x2);
    this.build();
  }

  reCalcQx() {
    this.x2 = this.math.reCalcPQx(this.a, this.b, null, this.x2);
    this.build();
  }

  // Just logging to console for debug
  logOptions(option: FunctionPlotOptions) {
    console.log('Chart option', {option});
    option?.data?.forEach((d, index) => {
      console.log('Function [' + index + '] on current graph!: ' + JSON.stringify(d?.fn || d?.points));
    });
  }

// Reset to defaults

  reset() {
    this.a = -7;
    this.b = 10;
    this.N = 34;
    this.x1 = 1; // P
    this.y1 = 2; // P
    this.x2 = 3; // Q
    this.y2 = 4; // Q
    this.build();
  }

}
