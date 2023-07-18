export const chartColors = {
  default: {
    primary: '#3AB98D',
    info: '#2482FF',
    danger: '#FF3860',
  },
}

export const baseChartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  responsive: true,
}

export const chartOptionsMain = {
  ...baseChartOptions,
  tooltips: {
    backgroundColor: '#fafafa',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: 'nearest',
    intersect: 0,
    position: 'nearest',
    callbacks: {
      label: ((tooltipItems) => {
        return "Rs." + " " + tooltipItems.yLabel.toLocaleString("en-IN")
      })
    }
  },
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: 'transparent',
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a',
        },
      },
    ],

    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(225,78,202,0.1)',
          zeroLineColor: 'transparent',
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a',
        },
      },
    ],
  },
}
