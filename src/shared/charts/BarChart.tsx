
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
}

const BarChart = ({ data, color = '#4d86dc' }: BarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: color
          },
          barWidth: '40%',
          label: {
            show: true,
            position: 'top'
          }
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
  }, [data, color]);

  return <div ref={chartRef} style={{ width: '100%', height: '200px' }} />;
};

export default BarChart;