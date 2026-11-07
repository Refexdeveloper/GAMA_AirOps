// import PropTypes from 'prop-types';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';

// import Chart, { useChart } from 'src/components/chart';

// // ----------------------------------------------------------------------

// export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
//   const { labels, colors, series, options } = chart;

//   const chartOptions = useChart({
//     colors,
//     plotOptions: {
//       bar: {
//         columnWidth: '16%',
//       },
//     },
//     fill: {
//       type: series.map((i) => i.fill),
//     },
//     labels,
//     xaxis: {
//       type: 'datetime',
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       y: {
//         formatter: (value) => {
//           if (typeof value !== 'undefined') {
//             return `${value.toFixed(0)} visits`;
//           }
//           return value;
//         },
//       },
//     },
//     ...options,
//   });

//   return (
//     <Card {...other}>
//       <CardHeader title={title} subheader={subheader} />

//       <Box sx={{ p: 3, pb: 1 }}>
//         <Chart
//           dir="ltr"
//           type="line"
//           series={series}
//           options={chartOptions}
//           width="100%"
//           height={364}
//         />
//       </Box>
//     </Card>
//   );

// }

// AppWebsiteVisits.propTypes = {
//   chart: PropTypes.object,
//   subheader: PropTypes.string,
//   title: PropTypes.string,
// };

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = {
    series: [
      {
        data: series,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click(ch, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors,
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '45%',
          distributed: true,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        title: { text: 'Users' },
        categories: labels,
        labels: {
          style: {
            colors,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: { text: 'No.of. Quotes Created' },
      },
      tooltip: {
        enabled: true,
        y: {
          title: {
            formatter: (seriesName) => 'Quotes:',
          },
        },
      },
    },
    ...options,
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={chartOptions.series}
          options={chartOptions.options}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
