import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import functionPlot from 'function-plot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('container') container!: ElementRef;

  constructor() {
  }

  content = '$y^{2}=x^{3}+ax+b \\mod{N}$';
  a = 0;
  b = 7;
  N = 34;
  x1 = 2; // P
  y1 = 2; // P
  x2 = 4; // Q
  y2 = 4; // Q


  ngAfterViewInit() {
    this.build();
  }

  build() {
    let option = {
      target: '#graph',
      width: 450,
      disableZoom: false,
      yAxis: {domain: [-10, 10]},
      xAxis: {domain: [-10, 10]},
      grid: true,
      data: [
        {
          fn: 'y^2-((x^3)+(' + this.a + 'x)+' + this.b + ')',
          color: '#e7a649',
          fnType: 'implicit',
        },
        {fn: 'x', color: 'pink'}
      ]
    };
    // @ts-ignore
    functionPlot(option);
    console.group("Point addition");
    console.log('curve: ', JSON.stringify(option.data[0].fn));
    console.log('line Q-P: ', JSON.stringify(option.data[1].fn));
    console.groupEnd();

  }

  refresh() {
    this.build();
  }

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
