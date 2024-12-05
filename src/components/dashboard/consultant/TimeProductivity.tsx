import { Card, Title, BarChart, DonutChart, Metric, Text } from '@tremor/react';
import { Case } from '@/types/case';

interface TimeProductivityProps {
  cases: Case[];
}

export default function TimeProductivity({ cases }: TimeProductivityProps) {
  const totalHours = cases.reduce((acc, c) => acc + c.billableHours, 0);
  const nonBillableHours = Math.round(totalHours * 0.3); // Example: 30% non-billable

  const caseTypeDistribution = cases.reduce((acc, c) => {
    acc[c.practiceArea] = (acc[c.practiceArea] || 0) + c.billableHours;
    return acc;
  }, {} as Record<string, number>);

  const monthlyHoursData = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const billable = cases.reduce((acc, c) => {
      if (c.completionDate?.getMonth() === month.getMonth()) {
        return acc + c.billableHours;
      }
      return acc;
    }, 0);
    const nonBillable = Math.round(billable * 0.3);

    return {
      month: month.toLocaleString('default', { month: 'short' }),
      'Billable Hours': billable,
      'Non-billable Hours': nonBillable
    };
  }).reverse();

  const taskCompletionRate = 85; // Example rate

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Billable Hours</Text>
          <Metric>{totalHours}</Metric>
        </Card>

        <Card decoration="top" decorationColor="amber">
          <Text>Non-billable Hours</Text>
          <Metric>{nonBillableHours}</Metric>
        </Card>

        <Card decoration="top" decorationColor="green">
          <Text>Task Completion Rate</Text>
          <Metric>{taskCompletionRate}%</Metric>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Title>Time Allocation by Case Type</Title>
          <DonutChart
            className="mt-6"
            data={Object.entries(caseTypeDistribution).map(([area, hours]) => ({
              name: area,
              hours: hours
            }))}
            category="hours"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          />
        </Card>

        <Card>
          <Title>Monthly Hours Distribution</Title>
          <BarChart
            className="mt-6"
            data={monthlyHoursData}
            index="month"
            categories={["Billable Hours", "Non-billable Hours"]}
            colors={["blue", "amber"]}
            stack
          />
        </Card>
      </div>
    </div>
  );
}