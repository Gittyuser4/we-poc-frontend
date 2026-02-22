import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RadialPolarBarChartProps {
  data: number[];
  categories: string[];
  title?: string;
  subtitle?: string;
  maxValue?: number;
  startAngle?: number;
  color?: string;
}

const RadialPolarBarChart = ({ 
  data, 
  categories, 
  title = 'Radial Polar Bar Chart',
  subtitle = '',
  maxValue,
  startAngle = 75,
  color = '#4d86dc'
}: RadialPolarBarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const myChart = echarts.init(chartRef.current);

    // Calculate max value if not provided
    const calculatedMax = maxValue || Math.ceil(Math.max(...data) * 1.2);

    const option = {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center',
        top: '2%'
      },
      grid: {
        top: '15%',
        bottom: '15%',
        left: '5%',
        right: '5%',
        containLabel: true
      },
      polar: {
        radius: [30, '60%'],
        center: ['50%', '52%']
      },
      radiusAxis: {
        max: calculatedMax
      },
      angleAxis: {
        type: 'category',
        data: categories,
        startAngle: startAngle,
        axisLabel: {
          interval: 0,
          rotate: 0,
          overflow: 'break',
          width: 100,
          fontSize: 9,
          margin: 15
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      series: {
        type: 'bar',
        data: data,
        coordinateSystem: 'polar',
        label: {
          show: true,
          position: 'middle',
          formatter: '{c}',
          color: '#fff',
          fontWeight: 'bold'
        },
        itemStyle: {
          color: color
        }
      },
      animation: true
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
  }, [data, categories, title, subtitle, maxValue, startAngle, color]);

  return <div ref={chartRef} style={{ width: '100%', height: '450px' }} />;
};

export default RadialPolarBarChart;
