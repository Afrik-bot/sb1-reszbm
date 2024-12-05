import { Card, Title, BarChart, Metric, Text, ProgressBar } from '@tremor/react';
import { format } from 'date-fns';
import { Case } from '@/types/case';

interface FinancialMetricsProps {
  cases: Case[];
  hourlyRate: number;
}

export default function FinancialMetrics({ cases, hourlyRate }: FinancialMetricsProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRevenue = cases.reduce((acc, c) => {
    if (c.completionDate?.getMonth() === currentMonth && 
        c.completionDate?.getFullYear() === currentYear) {
      return acc + (c.billableHours * hourlyRate);
    }
    return acc;
  }, 0);

  const ytdRevenue = cases.reduce((acc, c) => {
    if (c.completionDate?.getFullYear() === currentYear) {
      return acc + (c.billableHours * hourlyRate);
    }
    return acc;
  }, 0);

  const totalBillableHours = cases.reduce((acc, c) => acc + c.billableHours, 0);

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthRevenue = cases.reduce((acc, c) => {
      if (c.completionDate?.getMonth() === month.getMonth() &&
          c.completionDate?.getFullYear() === month.getFullYear()) {
        return acc + (c.billableHours * hourlyRate);
      }
      return acc;
    }, 0);

    return {
      month: format(month, 'MMM'),
      Revenue: monthRevenue
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card decoration="top" decorationColor="emerald">
          <Text>Monthly Revenue</Text>
          <Metric>${monthlyRevenue.toLocaleString()}</Metric>
        </Card>

        <Card decoration="top" decorationColor="blue">
          <Text>YTD Revenue</Text>
          <Metric>${ytdRevenue.toLocaleString()}</Metric>
        </Card>

        <Card decoration="top" decorationColor="purple">
          <Text>Total Billable Hours</Text>
          <Metric>{totalBillableHours}</Metric>
        </Card>
      </div>

      <Card>
        <Title>Revenue Trend</Title>
        <BarChart
          className="mt-6"
          data={monthlyData}
          index="month"
          categories={["Revenue"]}
          colors={["emerald"]}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Title>Collection Rate</Title>
          <div className="mt-4">
            <Metric>87%</Metric>
            <ProgressBar value={87} color="emerald" className="mt-2" />
          </div>
        </Card>

        <Card>
          <Title>Outstanding Invoices</Title>
          <div className="mt-4">
            <Metric>$12,450</Metric>
            <Text>Across 8 cases</Text>
          </div>
        </Card>
      </div>
    </div>
  );
}