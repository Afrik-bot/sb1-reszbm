import { Card, Title, BarChart, DonutChart, Metric, Text } from '@tremor/react';
import { CaseStatus, PracticeArea } from '@/types/case';

interface CaseOverviewProps {
  cases: {
    status: CaseStatus;
    practiceArea: PracticeArea;
    startDate: Date;
    completionDate?: Date;
  }[];
}

export default function CaseOverview({ cases }: CaseOverviewProps) {
  const statusCount = cases.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<CaseStatus, number>);

  const practiceAreaDistribution = cases.reduce((acc, c) => {
    acc[c.practiceArea] = (acc[c.practiceArea] || 0) + 1;
    return acc;
  }, {} as Record<PracticeArea, number>);

  const monthlyCompletionData = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const completedCases = cases.filter(c => 
      c.completionDate?.getMonth() === month.getMonth() &&
      c.completionDate?.getFullYear() === month.getFullYear()
    ).length;

    return {
      month: month.toLocaleString('default', { month: 'short' }),
      'Completed Cases': completedCases
    };
  }).reverse();

  const averageDuration = cases.reduce((acc, c) => {
    if (c.completionDate) {
      return acc + (c.completionDate.getTime() - c.startDate.getTime());
    }
    return acc;
  }, 0) / cases.filter(c => c.completionDate).length;

  const daysAverage = Math.round(averageDuration / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusCount).map(([status, count]) => (
          <Card key={status} decoration="top" decorationColor={
            status === 'New' ? 'blue' :
            status === 'InProgress' ? 'yellow' :
            status === 'Pending' ? 'orange' :
            'green'
          }>
            <Text>{status}</Text>
            <Metric>{count}</Metric>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Title>Practice Area Distribution</Title>
          <DonutChart
            className="mt-6"
            data={Object.entries(practiceAreaDistribution).map(([area, count]) => ({
              name: area,
              value: count
            }))}
            category="value"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          />
        </Card>

        <Card>
          <Title>Monthly Case Completion</Title>
          <BarChart
            className="mt-6"
            data={monthlyCompletionData}
            index="month"
            categories={["Completed Cases"]}
            colors={["blue"]}
          />
        </Card>
      </div>

      <Card>
        <Title>Average Case Duration</Title>
        <Metric>{daysAverage} days</Metric>
        <Text>Average time to case completion</Text>
      </Card>
    </div>
  );
}