import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SeriesData {
  name: string;
  data: number[];
}

interface StackedAreaChartProps {
  data: SeriesData[];
  categories: string[];
  colors?: string[];
  title?: string;
}

const StackedAreaChart = ({ data, categories, colors, title }: StackedAreaChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title || 'Stacked Area Chart',
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: '#6c757d'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: data.map(series => series.name),
        top: 35,
        textStyle: {
          fontSize: 12
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        right: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: categories,
          axisLabel: {
            fontSize: 11
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            fontSize: 11
          }
        }
      ],
      color: colors || ['#4d86dc', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de'],
      series: data.map((series) => ({
        name: series.name,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: series.data,
        smooth: true,
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

export default StackedAreaChart;
