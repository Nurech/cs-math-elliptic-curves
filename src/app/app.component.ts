import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import functionPlot from 'function-plot';
import { FunctionPlotOptions } from 'function-plot/dist/types';
import { MathService } from './math.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('container') container!: ElementRef;
  private instance: any;

  constructor(private math: MathService) {
  }

  content = '$y^{2}=x^{3}+ax+b \\mod{N}$';
  a = 0;
  b = 7;
  N = 34;
  x1 = -1.39389; // P
  y1 = 2.07166; // P
  x2 = 2.08008; // Q
  y2 = 4; // Q


  ngAfterViewInit() {
    this.build();
  }

  build() {
    let option: FunctionPlotOptions = {
      target: '#graph',
      width: 450,
      disableZoom: false,
      yAxis: {domain: [-10, 10]},
      xAxis: {domain: [-10, 10]},
      grid: true,
      data: [
        {fn: this.math.fnPQ(this.x1, this.y1, this.x2, this.y2), fnType: 'linear'},
        {fn: '-' + this.math.fnCurve(this.a, this.b), color: '#e7a649'},
        {fn: this.math.fnCurve(this.a, this.b), color: '#e7a649'},
        {points: [[1, 1], [2, 1]], color: '#5a528d', fnType: 'points', graphType: 'scatter'}
      ]
    };
    this.instance = functionPlot(option);
    console.log(this.instance);
    this.log(option);
  }


  // Just logging to console for debug
  log(option: FunctionPlotOptions) {
    console.group('Logging...point addition');
    console.log('Chart option', {option});
    option?.data?.forEach((d, index) => {
      console.log('Function [' + index + '] on current graph!: ' + JSON.stringify(d?.fn || d?.points));
    });
    console.groupEnd();
  }

  refresh() {
    this.build();
  }

  // Reset to defaults
  reset() {
    this.a = 0;
    this.b = 7;
    this.N = 34;
    this.x1 = 2; // P
    this.y1 = 2; // P
    this.x2 = 4; // Q
    this.y2 = 4; // Q
    this.build();
  }

}
