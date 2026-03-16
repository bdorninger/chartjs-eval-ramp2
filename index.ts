///

import './style.css';

import colorLib, { Color } from '@kurkle/color';

import {
  Chart,
  ChartEvent,
  Point,
  ChartConfiguration,
  ChartDataset,
} from 'chart.js/auto';

import { rampedToChartStepped, toRamp } from './ramp';

import { ChartJSdragDataPlugin } from './drag';

// DRAG SEGMENT: API incompatible!
// import ChartJSdragSegment  from 'chartjs-plugin-dragsegment'; // API incompatible (chart.js 2.x?)

const DATA_COUNT = 7;
let col: Color;
const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');

const tempRange = document.getElementById('tempRange');
tempRange?.addEventListener('change', onTempValueChange);

const selPos = document.getElementById('posSel');
selPos?.addEventListener('change', onSelectionPositionChange);

const stepB = document.getElementById('stepb') as HTMLButtonElement;
stepB.addEventListener('click', onChangeStep);

const rampB = document.getElementById('rampb') as HTMLButtonElement;
rampB.addEventListener('click', onRampB);

const dragData = ChartJSdragDataPlugin;
Chart.register(dragData /*crosshair*/);

const selectionBarData = [
  { x: 2.5, y: -0.5 },
  { x: 2.5, y: 20 },
];

const config: ChartConfiguration = {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Temperature',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 13 },
          { x: 3, y: 13.2 },
          { x: 4, y: 15 },
          { x: 5, y: 17 },
          { x: 6, y: 18 },
        ],
        borderWidth: 2,
        borderColor: '#ff0016',
        backgroundColor: '#00ffee',
        hidden: true,
        fill: false,
        segment: {
          borderWidth: (ctx, opt) => (ctx.p0.y === ctx.p1.y ? 5 : undefined),
          borderColor: (ctx, opt) => {
            const d = ctx.p0.y - ctx.p1.y;
            return d === 0
              ? colorLib('#ffaa00').alpha(0.8).rgbString()
              : d < 0
              ? '#00ff00'
              : undefined;
          },
          borderCapStyle: () => undefined,
          borderDash: () => undefined,
          borderDashOffset: () => undefined,
          borderJoinStyle: () => undefined,
        },
      },
      {
        label: 'hi', //Temperature HiLite',
        data: [
          { x: 2, y: 13 },
          { x: 3, y: 13.2 },
        ],
        borderWidth: 10,
        borderColor: colorLib('#ffaa00').alpha(0.4).rgbString(),
        backgroundColor: '#00ffee',
        hidden: true,
        fill: false,
      },
      {
        label: 'sb',
        hidden: true,
        data: selectionBarData,
        borderWidth: 35,
        borderColor: colorLib('#ff00aa').alpha(0.2).rgbString(),
        radius: 0,
        fill: false,
      },
      {
        label: 'Pressure hi',
        data: [
          { x: 0, y: 8 },
          { x: 2, y: 7.5 },
          { x: 3.5, y: 7.7 },
          { x: 4, y: 8.7 },
          { x: 10, y: 9 },
        ],

        fill: '+1',
        tension: 0.0,
        borderWidth: 3,
        borderDash: [4, 5],
        borderColor: colorLib('#0d0cff').alpha(0.4).rgbString(),
        backgroundColor: colorLib('#035000').alpha(0.4).rgbString(),
        pointHitRadius: 25,
        borderCapStyle: 'square',
        borderJoinStyle: 'bevel', // round, miter
        pointStyle: 'rect', // "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle" | HTMLImageElement | HTMLCanvasElemen
        radius: 6,
        rotation: 45,
        stepped: false,
      },
      {
        label: 'Pressure ed',
        data: [
          { x: 0, y: 4 },
          { x: 2, y: 5 },
          { x: 3.5, y: 4 },
          { x: 4, y: 3 },
          { x: 5, y: 7 },
          { x: 6, y: 9 },
          { x: 8, y: 9 },
          { x: 10, y: 6 },
        ],

        fill: false,
        tension: 0.0,
        borderWidth: 3,
        borderColor: '#4dc9f6',
        backgroundColor: '#035000',
        pointHitRadius: 25,
        borderCapStyle: 'square',
        borderJoinStyle: 'bevel', // round, miter
        pointStyle: 'rect', // "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle" | HTMLImageElement | HTMLCanvasElemen
        radius: 6,
        rotation: 45,
        stepped: false, // true/false, 'before', ' middle' 'after'
      },
      {
        label: 'Pressure lo',
        data: [
          { x: 0, y: 2 },
          { x: 2, y: 3.5 },
          { x: 3.5, y: 2 },
          { x: 4, y: 1.9 },
          { x: 5, y: 3 },
          { x: 6, y: 3 },
          { x: 10, y: 2.5 },
        ],

        fill: '-1',
        tension: 0.0,
        borderWidth: 3,
        borderDash: [4, 5],
        borderColor: colorLib('#ff0c00').alpha(0.4).rgbString(),
        backgroundColor: colorLib('#f35a0f').alpha(0.4).rgbString(),
        pointHitRadius: 25,
        borderCapStyle: 'square',
        borderJoinStyle: 'bevel', // round, miter
        pointStyle: 'rect',
        radius: 6,
        rotation: 45,
      },

      {
        label: 'ramp',
        data: [
          { x: 0, y: 15 },
          { x: 10, y: 15 },
        ],
        borderWidth: 3,

        borderColor: colorLib('#230c00').alpha(0.4).rgbString(),
        pointHitRadius: 25,
        borderCapStyle: 'square',
        borderJoinStyle: 'bevel', // round, miter
        pointStyle: 'cross',
        radius: 6,
      },
      {
        label: 'rampKORR',
        data: [
          { x: 0, y: 25 },
          { x: 10, y: 25 },
        ],
        borderWidth: 3,

        borderColor: colorLib('#235366').rgbString(),
        pointHitRadius: 25,
        borderCapStyle: 'square',
        borderJoinStyle: 'bevel', // round, miter
        pointStyle: 'star', // "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle" | HTMLImageElement | HTMLCanvasElemen
        radius: 6,
        stepped: 'before',
      },
    ],
  },
  options: {
    scales: {
      y: {
        //offset: true,
        min: 0,
        max: 30,
        bounds: 'data',
        //suggestedMin: 0,
        //suggestedMax: 20,
        ticks: {
          stepSize: 2,
        },
      },
      x: {
        /*position: {
          y: 4,
        },*/
        //offset: true,
        type: 'linear',
        title: {
          display: true,
          text: 'Foo',
        },
        ticks: {
          callback: (val, index, ticks) => {
            if (typeof val === 'string') {
              return val;
            }
            // \u2771\u2771
            //  0x276e +f
            // Hide every 2nd tick label
            if (index === 0) {
              return `${String(val)} \u276e\u276e`;
              // return `${String(val)} >>`;
            }
            if (index === ticks.length - 1) {
              return `\u276f\u276f ${String(val)}`;
            }
            return val % 2 === 0 ? String(val) : '';
          },
          color: 'green',
        },
        min: 0,
        max: 10,
        // bounds: 'data'
      },
    },
    // drag segment is not working with 3.6.1
    //
    /* dragSegment: {
      // allow to drag segments verticaly (default: true)
      vertical: true,

      // allow to drag segments horizontaly (default: false)
      horizontal: false,

      // onDrag will be executed before coordinates updating
      // @chart - ChartJS instance
      // @points - Object , of points {x, y} for each dataset, witch will update their coordinates
      //   points = {
      //     datasetIndex: {
      //       elementIndex: {
      //         x // optional, not present if not modified
      //         y // optional, not present if not modified
      //       }
      //     }
      //   }
      //   You can set new values (add, remove, ...) for points
      onDragStart: (chart, points) => {
        console.log('drag seg start');
        return true;
      },
      onDrag(chart, points) {
        console.log('drag seg');
        if (Math.random() < 0.5) {
          return false;
        }
        return true;
      },
    },*/
    onHover: function (e: ChartEvent) {
      const point = chart.getElementsAtEventForMode(
        e.native!,
        'nearest',
        { intersect: true },
        false
      );
      if (point.length) {
        (e.native!.target as HTMLElement).style.cursor = 'grab';
      } else {
        (e.native!.target as HTMLElement).style.cursor = 'default';
      }
    },
    onClick: function (e: ChartEvent) {
      console.log(
        `chart ev ${e.type}@${e.x},${e.y}`,

        chart.getElementsAtEventForMode(
          e.native!,
          'dataset', // index, dataset, point, nearest, x,y
          { intersect: false },
          false
        ),
        e
      );
      return true;
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            //style: 'italic',
          },
          filter: function (item, chart) {
            if (item?.text?.startsWith('Pressure')) {
              item.text = `${item.text} [bar]`;
              item.lineDash = [2, 4];
            }
            // Logic to remove a particular legend item goes here
            return item.text != null && item.text !== '';
          },
          boxHeight: 0,
        },
      },
      tooltip: {
        enabled: false,
      },

      /*tooltip: {
        mode: 'point',
        intersect: false,
        bodyColor: '#000000',
        backgroundColor: colorLib('#ffffff').alpha(0.6).rgbString(),
        borderWidth: 1,
        borderColor: '#000000',
        titleColor: '#000000',
        footerColor: '#ffffff',
        cornerRadius: 0,
        callbacks: {
          title: (ttips: TooltipItem<'line'>[]) => {
            //console.log(ttips[0].dataset);
            return 'My-Title';
          },
          label: (ttips) => 'mylabel',
        },
      },*/

      // crosshair: {
      //   line: {
      //     color: '#0f6', // crosshair line color
      //     width: 1, // crosshair line width
      //   },
      //   sync: {
      //     enabled: false, // enable trace line syncing with other charts
      //     group: 1, // chart group
      //     suppressTooltips: false, // suppress tooltips when showing a synced tracer
      //   },
      //   zoom: {
      //     enabled: false,
      //   },
      //   /*zoom: {
      //     enabled: true, // enable zooming
      //     zoomboxBackgroundColor: 'rgba(66,133,244,0.2)', // background color of zoom box
      //     zoomboxBorderColor: '#48F', // border color of zoom box
      //     zoomButtonText: 'Reset Zoom', // reset zoom button text
      //     zoomButtonClass: 'reset-zoom', // reset zoom button class
      //   },*/
      //   /*callbacks: {
      //     beforeZoom: () =>
      //       function (start, end) {
      //         // called before zoom, return false to prevent zoom
      //         return true;
      //       },
      //     afterZoom: () =>
      //       function (start, end) {
      //         // called after zoom
      //       },
      //   },*/
      // },
      //
      dragData: {
        round: 1,
        showTooltip: false,
        dragX: true,
        dragY: true,
        magnet: {
          to: (data) => {
            console.log(`magnet`, data);
            return data;
          },
        },
        onDragStart: function (e, datasetIndex, index, value) {
          // console.log(e)
        },
        onDrag: function (e, datasetIndex, index, value: number | Point) {
          // e.target.style.cursor = 'grabbing';
          // console.log('Dragging', e, datasetIndex, index, value);
          if (typeof value === 'number') {
            return value >= 2 && value <= 19;
          }
          const ret = { ...value };
          /*if (value?.y ?? 0 < 2) {
            ret.y = 2;
          }
          if (value?.y ?? 30 > 29) {
            ret.y = 29;
          }*/
          // console.log('returning: ', ret);
          return ret;

          // return value.y >= 2 && value.y <= 19;
        },
        onDragEnd: function (e, datasetIndex, index, value: number | Point) {
          // e.target.style?.cursor = 'default';
          console.log(`final value ${value}`, datasetIndex, index, value);
        },
      },
    },
  },
};

const chart = new Chart(ctx!, config);

console.warn('CHART', chart);

tempRange?.setAttribute('value', String(chart.data.datasets[0].borderWidth));

export function onTempValueChange(ev: any) {
  ev.preventDefault();
  console.log(`changed ${this}: ${ev.target.value}`);
  chart.data.datasets[0].borderWidth = ev.target.value;
  setTimeout(() => chart.update('none'), 100);
}

export function onSelectionPositionChange(ev: any) {
  ev.preventDefault;
  const val = ev.target.value;
  selectionBarData[0].x = val;
  selectionBarData[1].x = val;
  setTimeout(() => chart.update('none'), 100);
}

const allSteps = ['before', 'after', 'middle', false];

export function onChangeStep(ev: MouseEvent) {
  const ds = chart.data.datasets[4] as ChartDataset<'line'>;
  const currentStep = ds.stepped;
  const ind = allSteps.indexOf(currentStep as any);
  if (ind < 0) {
    console.warn(currentStep);
    return;
  }
  const nextind = (ind + 1) % allSteps.length;
  const newStep = allSteps[nextind];
  ds.stepped = newStep as any;
  stepB.textContent = `Step: ${newStep}`;
  chart.update();
}

export function onRampB(ev: MouseEvent) {
  const pt = chart.data.datasets[4] as ChartDataset<'line'>;
  const ds = chart.data.datasets[6] as ChartDataset<'line'>;
  const ko = chart.data.datasets[7] as ChartDataset<'line'>;

  if (ds != null && pt != null) {
    const rmp = toRamp(pt.data as any);
    ds.data = rmp.map((p) => ({ x: p.x, y: p.y + 10 }));
    if (ko != null) {
      ko.data = rampedToChartStepped(rmp);
    }
    chart.update();
  } else {
    console.log(`no ds`, ds?.label, pt?.label);
  }
}
