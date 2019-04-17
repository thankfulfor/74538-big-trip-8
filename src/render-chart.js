import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getPrices, getTransportWays, getTimeSpentChartData} from './main';

const BAR_HEIGHT = 55;
const MONEY_BAR_HEIGHT = 6;
const TRANSPORT_BAR_HEIGHT = 4;
const TIME_SPEND_BAR_HEIGHT = 14;

let moneyChart = {};
let transportChart = {};
let timeSpendChart = {};

export const renderChart = () => {
  const moneyCtx = document.querySelector(`.statistic__money`);
  const transportCtx = document.querySelector(`.statistic__transport`);
  const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

  const chartSettings = {
    money: {
      title: moneyCtx,
      data: {
        labels: [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`],
        datasets: [{
          data: getPrices(),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      format: (val) => `€ ${val}`,
      text: `MONEY`,
    },
    transport: {
      title: transportCtx,
      data: {
        labels: [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`],
        datasets: [{
          data: getTransportWays(),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      format: (val) => `${val}x`,
      text: `TRANSPORT`,
    },
    timeSpend: {
      title: timeSpendCtx,
      data: getTimeSpentChartData(),
      format: (val) => `${val}H`,
      text: `TIME SPENT`,
    },
  };

  moneyCtx.height = BAR_HEIGHT * MONEY_BAR_HEIGHT;
  transportCtx.height = BAR_HEIGHT * TRANSPORT_BAR_HEIGHT;
  timeSpendCtx.height = BAR_HEIGHT * TIME_SPEND_BAR_HEIGHT;

  const clearChart = () => {
    if (typeof moneyChart.destroy === `function`) {
      moneyChart.destroy();
    }
    if (typeof transportChart.destroy === `function`) {
      transportChart.destroy();
    }
    if (typeof timeSpendChart.destroy === `function`) {
      timeSpendChart.destroy();
    }
  };

  clearChart();

  const getChart = (settings) => {
    return new Chart(settings.title, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: settings.data,
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: settings.format
          }
        },
        title: {
          display: true,
          text: settings.text,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  };

  moneyChart = getChart(chartSettings.money);

  transportChart = getChart(chartSettings.transport);

  timeSpendChart = getChart(chartSettings.timeSpend);
};
