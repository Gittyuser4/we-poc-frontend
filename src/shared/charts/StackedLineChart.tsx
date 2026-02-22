import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SeriesData {
  name: string;
  data: number[];
}

interface StackedLineChartProps {
  data: SeriesData[];
  categories: string[];
  colors?: string[];
  title?: string;
}

const StackedLineChart = ({ data, categories, colors, title }: StackedLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

  
const option = {
  title: {
    text: title || 'Stacked Line',
    left: 'center',
    top: 10,
    textStyle: {
      fontSize: 16,
      color: '#6c757d'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: data.map(series => series.name),
    top: 40,
    textStyle: {
      fontSize: 12
    }
  },
  grid: {
    top: 90,        
    left: '6%',     
    right: '4%',
    bottom: '10%',  
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: categories,
    axisLabel: {
      fontSize: 11,
      margin: 14      
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 11,
      margin: 14      
    }
  },
  color: colors || ['#4d86dc', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de'],
  series: data.map((series) => ({
    name: series.name,
    type: 'line',
    stack: 'Total',
    data: series.data,
    label: {
      show: true,
      position: 'top'
    }
  }))
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
  }, [data, categories, colors, title]);

  return <div ref={chartRef} style={{ width: '100%', height: '350px' }} />;
};

export default StackedLineChart;
