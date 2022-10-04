import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts/types/dist/echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('chart') chart!: ElementRef;
  chartOption = option;
  a = -7;
  b = 10;

  ngAfterViewInit() {
    this.setOptions();
  }

  setOptions() {
    this.chartOption = option;
  }
}

export const option: EChartsOption = {
  animation: false,
  grid: {
    top: 40,
    left: 50,
    right: 40,
    bottom: 50
  },
  xAxis: {
    name: 'x',
    minorTick: {
      show: true
    },
    minorSplitLine: {
      show: true
    }
  },
  yAxis: {
    name: 'y',
    min: -100,
    max: 100,
    minorTick: {
      show: true
    },
    minorSplitLine: {
      show: true
    }
  },
  dataZoom: [
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      xAxisIndex: [0],
      startValue: -10,
      endValue: 10
    },
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      yAxisIndex: [0],
      startValue: -10,
      endValue: 10
    }
  ],
  series: [
    {
      type: 'line',
      smooth: true,
      showSymbol: false,
      clip: true,
      data: [[-1,-1],[1,1], [1,3]]
    }
  ]
};
