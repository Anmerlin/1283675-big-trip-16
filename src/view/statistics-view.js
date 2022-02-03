import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getCostByType, getColor, getLigthenColors, getPointTypes, getCountByType, getTravelTimeByType, sortLabelsByIndex } from '../helpers/statistics.js';
import { formatDuration } from '../helpers/common.js';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, data) => {
  const {pointTypes, labels, randomColors, randomLightenColors, costByType} = data;

  const sortedData = sortLabelsByIndex(labels, costByType);

  moneyCtx.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedData.keys()],
      datasets: [{
        data: [...sortedData.values()],
        backgroundColor: randomColors,
        hoverBackgroundColor: randomLightenColors,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, data) => {
  const {pointTypes, labels, randomColors, randomLightenColors, countByType} = data;

  const sortedData = sortLabelsByIndex(labels, countByType);

  typeCtx.height = BAR_HEIGHT * pointTypes.length;

  new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedData.keys()],
      datasets: [{
        data: [...sortedData.values()],
        backgroundColor: randomColors,
        hoverBackgroundColor: randomLightenColors,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeCtx, data) => {
  const {pointTypes, labels, randomColors, randomLightenColors, travelTimeByType} = data;

  const sortedData = sortLabelsByIndex(labels, travelTimeByType);

  timeCtx.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedData.keys()],
      datasets: [{
        data: [...sortedData.values()],
        backgroundColor: randomColors,
        hoverBackgroundColor: randomLightenColors,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 70,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${formatDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class StatisticsView extends SmartView {
  #points = null;

  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(points) {
    super();
    this.#points = points;

    const pointTypes = getPointTypes(this.#points);
    const labels = pointTypes.map((type) => type.toUpperCase());
    const randomColors = pointTypes.map(() => getColor());
    const randomLightenColors = getLigthenColors(randomColors);
    const costByType = getCostByType(pointTypes, this.#points);
    const countByType = getCountByType(pointTypes, this.#points);
    const travelTimeByType = getTravelTimeByType(pointTypes,this.#points);

    this._data = {
      pointTypes,
      labels,
      randomColors,
      randomLightenColors,
      costByType,
      countByType,
      travelTimeByType,
    };

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  removeElement = () => {
    super.removeElement();
  }

  #setCharts = () => {
    if (this.#moneyChart !== null || this.#typeChart !== null || this.#timeChart !== null) {
      this.#moneyChart = null;
      this.#typeChart = null;
      this.#timeChart = null;
    }

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time-spend');

    this.#moneyChart = renderMoneyChart(moneyCtx, this._data);
    this.#typeChart = renderTypeChart(typeCtx, this._data);
    this.#timeChart = renderTimeSpendChart(timeCtx, this._data);
  }
}
