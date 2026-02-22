import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface HorizontalBarChartProps {
  data: { name: string; value: number }[];
  color?: string;
}

const HorizontalBarChart = ({ data, color = '#5cb85c' }: HorizontalBarChartProps) => {
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
        left: '15%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: data.map(item => item.name)
      },
      series: [
        {
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: color
          },
          label: {
            show: true,
            position: 'right'
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

export default HorizontalBarChart;
