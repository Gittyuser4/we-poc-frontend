import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface LineChartProps {
  data: { name: string; value: number }[];
  color?: string;
}

const LineChart = ({ data, color = '#f0ad4e' }: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: data.map(item => item.value),
          smooth: true,
          lineStyle: {
            color: color,
            width: 3
          },
          itemStyle: {
            color: color
          },
          label: {
            show: true,
            position: 'top'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: color + '80'
              },
              {
                offset: 1,
                color: color + '20'
              }
            ])
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

export default LineChart;
