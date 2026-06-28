import DashboardStats from '@/components/DashboardStats';

export const metadata = {
  title: 'Dashboard — Easy French Lab',
  description:
    'Track your French learning progress: lessons completed, exercise accuracy, streak, vocabulary encountered, and recommended next steps.',
};

export default function DashboardPage() {
  return <DashboardStats />;
}
