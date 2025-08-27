import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ScoreChartProps } from '../../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3500c0',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => `امتیاز: ${Math.round(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: 'Vazirmatn',
            size: 12,
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#f3f4f6',
          borderDash: [5, 5],
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: 'Vazirmatn',
            size: 11,
          },
          callback: function(value: any) {
            return value
          }
        }
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    }
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          'rgba(53, 0, 192, 0.8)',
          'rgba(76, 29, 149, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(53, 0, 192, 1)',
          'rgba(76, 29, 149, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default ScoreChart