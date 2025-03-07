import { Card, Divider } from '@mui/material';
import { Chart as ChartJS, registerables } from 'chart.js';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { SalesRevenue } from 'src/models/types';
import { READABLE_DDMMYY } from 'src/utils/dateUtils';

ChartJS.register(...registerables);

const options = {
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    datalabels: {
      formatter: (value: number) => value.toLocaleString()
    }
  }
};

type RevenueChartProps = {
  revenue: SalesRevenue[];
};

const RevenueChart = ({ revenue }: RevenueChartProps) => {
  const data = {
    labels: revenue.map((rev) =>
      moment(rev.createddate).format(READABLE_DDMMYY)
    ),
    datasets: [
      {
        label: 'Revenue',
        data: revenue.map((rev) => rev.revenue),
        barPercentage: 0.5,
        borderRadius: 5,
        backgroundColor: '#DAD7FE'
      }
    ]
  };
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <h3>Revenue</h3>
      <Divider className='full-divider' />
      <Bar data={data} options={options} />
    </Card>
  );
};

export default RevenueChart;
