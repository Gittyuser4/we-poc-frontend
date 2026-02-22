import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PolarBarRangeChartProps {
  data: number[][];
  categories: string[];
  title?: string;
  subtitle?: string;
  barHeight?: number;
}

const PolarBarRangeChart = ({ 
  data, 
  categories, 
  title,
  subtitle,
  barHeight = 50
}: PolarBarRangeChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title || 'Polar Bar Range Chart',
        subtext: subtitle || '',
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: '#6c757d'
        }
      },
      legend: {
        show: true,
        top: 'bottom',
        data: ['Range', 'Average'],
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        top: 100
      },
      angleAxis: {
        type: 'category',
        data: categories
      },
      tooltip: {
        show: true,
        formatter: function (params: any) {
          const id = params.dataIndex;
          return (
            categories[id] +
            '<br>Lowest: ' +
            data[id][0] +
            '<br>Highest: ' +
            data[id][1] +
            '<br>Average: ' +
            data[id][2]
          );
        }
      },
      radiusAxis: {},
      polar: {},
      series: [
        {
          type: 'bar',
          itemStyle: {
            color: 'transparent'
          },
          data: data.map(function (d) {
            return d[0];
          }),
          coordinateSystem: 'polar',
          stack: 'Min Max',
          silent: true
        },
        {
          type: 'bar',
          data: data.map(function (d) {
            return d[1] - d[0];
          }),
          coordinateSystem: 'polar',
          name: 'Range',
          stack: 'Min Max',
          itemStyle: {
            color: '#4d86dc'
          },
          label: {
            show: true,
            position: 'middle'
          }
        },
        {
          type: 'bar',
          itemStyle: {
            color: 'transparent'
          },
          data: data.map(function (d) {
            return d[2] - barHeight;
          }),
          coordinateSystem: 'polar',
          stack: 'Average',
          silent: true,
          z: 10
        },
        {
          type: 'bar',
          data: data.map(function () {
            return barHeight * 2;
          }),
          coordinateSystem: 'polar',
          name: 'Average',
          stack: 'Average',
          barGap: '-100%',
          z: 10,
          itemStyle: {
            color: '#5cb85c'
          },
          label: {
            show: true,
            position: 'middle'
          }
        }
      ]
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
  }, [data, categories, title, subtitle, barHeight]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default PolarBarRangeChart;
