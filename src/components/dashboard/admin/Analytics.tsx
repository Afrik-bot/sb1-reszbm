import { useState } from 'react';
import { Card, Title, AreaChart, DonutChart, BarChart, Metric, Text } from '@tremor/react';
import { getSystemMetrics } from '@/services/admin.service';
import { useQuery } from '@tanstack/react-query';

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
] as const;

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['systemMetrics', timeRange],
    queryFn: getSystemMetrics
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (!metrics) {
    return <div>Failed to load analytics</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Platform Analytics</Title>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card decoration="top" decorationColor="blue">
          <Text>Active Users</Text>
          <Metric>{metrics.activeUsers}</Metric>
          <Text className="text-sm text-green-600">+12% from last month</Text>
        </Card>

        <Card decoration="top" decorationColor="green">
          <Text>Active Consultations</Text>
          <Metric>{metrics.activeConsultations}</Metric>
          <Text className="text-sm text-green-600">+8% from last month</Text>
        </Card>

        <Card decoration="top" decorationColor="purple">
          <Text>Total Revenue</Text>
          <Metric>${metrics.totalRevenue.toLocaleString()}</Metric>
          <Text className="text-sm text-green-600">+15% from last month</Text>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Title>User Growth</Title>
          <AreaChart
            className="mt-4 h-72"
            data={[
              { month: 'Jan', Users: 100 },
              { month: 'Feb', Users: 120 },
              { month: 'Mar', Users: 150 },
              { month: 'Apr', Users: 180 },
              { month: 'May', Users: 220 },
              { month: 'Jun', Users: 250 }
            ]}
            index="month"
            categories={['Users']}
            colors={['blue']}
          />
        </Card>

        <Card>
          <Title>Revenue Growth</Title>
          <BarChart
            className="mt-4 h-72"
            data={[
              { month: 'Jan', Revenue: 5000 },
              { month: 'Feb', Revenue: 7500 },
              { month: 'Mar', Revenue: 9000 },
              { month: 'Apr', Revenue: 12000 },
              { month: 'May', Revenue: 15000 },
              { month: 'Jun', Revenue: 18000 }
            ]}
            index="month"
            categories={['Revenue']}
            colors={['purple']}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
          />
        </Card>
      </div>

      <Card>
        <Title>User Distribution</Title>
        <DonutChart
          className="mt-4 h-72"
          data={[
            { name: 'Clients', value: 65 },
            { name: 'Consultants', value: 25 },
            { name: 'Admins', value: 10 }
          ]}
          category="value"
          index="name"
          colors={['blue', 'cyan', 'indigo']}
          valueFormatter={(value) => `${value}%`}
        />
      </Card>
    </div>
  );
}