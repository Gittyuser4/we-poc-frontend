import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

const PieChart = ({ data, colors = ['#4d86dc', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de'] }: PieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: '0',
        left: 'center'
      },
      color: colors,
      series: [
        {
          name: 'Distribution',
          type: 'pie',
          radius: '70%',
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outer',
            formatter: '{b}: {c}'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: data
        }
      ]
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [data, colors]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default PieChart;
