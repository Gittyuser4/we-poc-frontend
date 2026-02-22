import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface WaterfallChartProps {
  data: { name: string; value: number }[];
  title?: string;
  subtitle?: string;
  color?: string;
}

const WaterfallChart = ({ data, title = 'Waterfall Chart', subtitle = '', color = '#4d86dc' }: WaterfallChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const myChart = echarts.init(chartRef.current);

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Function to extract acronym or shorten label
    const formatLabel = (label: string): string => {
      // Replace "Not a member" with "Non-Members"
      if (label.toLowerCase().includes('not a member')) {
        return 'Non-Members';
      }
      
      // Extract acronym (text before parentheses) if it exists
      const acronymMatch = label.match(/^([A-Z]+)\s*\(/);
      if (acronymMatch) {
        return acronymMatch[1];
      }
      
      // If no acronym found, return the original label
      return label;
    };

    // Prepend Total to data
    const chartData = [{ name: 'Total', value: total }, ...data];
    
    // Calculate placeholder values for waterfall effect
    const placeholderData: number[] = [];
    const actualData: number[] = [];
    const formattedLabels: string[] = [];
    let runningTotal = 0;

    chartData.forEach((item, index) => {
      formattedLabels.push(formatLabel(item.name));
      
      if (index === 0) {
        // First item (Total): no placeholder
        placeholderData.push(0);
        actualData.push(item.value);
        runningTotal = item.value;
      } else {
        // Subsequent items: placeholder is previous running total minus current value
        placeholderData.push(runningTotal - item.value);
        actualData.push(item.value);
        runningTotal = runningTotal; // Keep same for waterfall
      }
    });

    const option = {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          const tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
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
        splitLine: { show: false },
        data: formattedLabels,
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: placeholderData
        },
        {
          name: 'Value',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside'
          },
          itemStyle: {
            color: color
          },
          data: actualData
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
  }, [data, title, subtitle, color]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default WaterfallChart;
