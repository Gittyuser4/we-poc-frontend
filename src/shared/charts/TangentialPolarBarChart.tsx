import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TangentialPolarBarChartProps {
  data: number[];
  categories: string[];
  title?: string;
  maxValue?: number;
  startAngle?: number;
}

const TangentialPolarBarChart = ({ 
  data, 
  categories, 
  title, 
  maxValue,
  startAngle = 75 
}: TangentialPolarBarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // Dynamically calculate max value if not provided
    const calculatedMaxValue = maxValue || (data.length > 0 ? Math.ceil(Math.max(...data) * 1.2) : 5);

    const option = {
      title: {
        text: title || 'Tangential Polar Bar',
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: '#6c757d'
        }
      },
      polar: {
        radius: [30, '75%']
      },
      angleAxis: {
        max: calculatedMaxValue,
        startAngle: startAngle
      },
      radiusAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
        show: false
      },
      label: {
  show: true,
  position: 'outside',
  formatter: '{b}: {c}',   // 👈 SAME as donut
  fontSize: 11
},  
      },
      tooltip: {
        formatter: '{b}: {c}'
      },
      series: {
        type: 'bar',
        data: data,
        coordinateSystem: 'polar',
        label: {
          show: true,
          position: 'middle',
          formatter: '{b}: {c}'
        },
        itemStyle: {
          color: '#4d86dc'
        }
      }
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data, categories, title, maxValue, startAngle]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default TangentialPolarBarChart;
