import { Card, Title, AreaChart, Metric, Text, ProgressBar } from '@tremor/react';
import { Client } from '@/types/client';

interface ClientAnalyticsProps {
  clients: Client[];
  satisfactionScores: {
    clientId: string;
    score: number;
    date: Date;
  }[];
}

export default function ClientAnalytics({ clients, satisfactionScores }: ClientAnalyticsProps) {
  const activeClients = clients.filter(c => c.status === 'active');
  const newClientsThisMonth = clients.filter(c => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(c.createdAt) > oneMonthAgo;
  });

  const retentionRate = (activeClients.length / clients.length) * 100;

  const averageSatisfaction = satisfactionScores.reduce((acc, s) => acc + s.score, 0) / 
    satisfactionScores.length;

  const monthlyClientData = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const clientCount = clients.filter(c => 
      new Date(c.createdAt).getMonth() === month.getMonth() &&
      new Date(c.createdAt).getFullYear() === month.getFullYear()
    ).length;

    return {
      month: month.toLocaleString('default', { month: 'short' }),
      'New Clients': clientCount
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Active Clients</Text>
          <Metric>{activeClients.length}</Metric>
        </Card>

        <Card decoration="top" decorationColor="green">
          <Text>New Clients This Month</Text>
          <Metric>{newClientsThisMonth.length}</Metric>
        </Card>

        <Card decoration="top" decorationColor="purple">
          <Text>Client Satisfaction</Text>
          <Metric>{averageSatisfaction.toFixed(1)}/5.0</Metric>
        </Card>
      </div>

      <Card>
        <Title>Client Growth</Title>
        <AreaChart
          className="mt-6 h-72"
          data={monthlyClientData}
          index="month"
          categories={["New Clients"]}
          colors={["blue"]}
        />
      </Card>

      <Card>
        <Title>Client Retention Rate</Title>
        <Metric>{retentionRate.toFixed(1)}%</Metric>
        <ProgressBar value={retentionRate} color="blue" className="mt-3" />
      </Card>
    </div>
  );
}