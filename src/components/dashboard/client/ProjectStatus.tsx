import { useState, useEffect } from 'react';
import { Card, Title, Text, Badge, ProgressBar } from '@tremor/react';

interface Project {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  consultant: string;
  startDate: Date;
  endDate?: Date;
  nextMilestone?: {
    title: string;
    dueDate: Date;
  };
}

interface ProjectStatusProps {
  userId: string;
}

export default function ProjectStatus({ userId }: ProjectStatusProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Contract Review',
        status: 'active',
        progress: 75,
        consultant: 'John Doe',
        startDate: new Date('2024-01-15'),
        nextMilestone: {
          title: 'Final Review',
          dueDate: new Date('2024-03-01')
        }
      },
      {
        id: '2',
        title: 'Legal Documentation',
        status: 'on_hold',
        progress: 30,
        consultant: 'Jane Smith',
        startDate: new Date('2024-02-01')
      }
    ];

    setProjects(mockProjects);
    setLoading(false);
  }, [userId]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'on_hold': return 'yellow';
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <div className="flex items-center justify-between">
            <div>
              <Title>{project.title}</Title>
              <Text className="text-gray-500">
                Consultant: {project.consultant}
              </Text>
            </div>
            <Badge color={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <Text>Progress</Text>
              <Text>{project.progress}%</Text>
            </div>
            <ProgressBar value={project.progress} color="blue" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Text className="text-gray-500">Start Date</Text>
              <Text>{project.startDate.toLocaleDateString()}</Text>
            </div>
            {project.endDate && (
              <div>
                <Text className="text-gray-500">End Date</Text>
                <Text>{project.endDate.toLocaleDateString()}</Text>
              </div>
            )}
          </div>

          {project.nextMilestone && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <Text className="font-medium">Next Milestone</Text>
              <div className="mt-1">
                <Text>{project.nextMilestone.title}</Text>
                <Text className="text-gray-500">
                  Due: {project.nextMilestone.dueDate.toLocaleDateString()}
                </Text>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}