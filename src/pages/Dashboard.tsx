import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { Package, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your workshop performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Products"
            value="0"
            icon={Package}
            description="Products in inventory"
          />
          <StatsCard
            title="Total Sales"
            value="$0"
            icon={DollarSign}
            description="Revenue this month"
          />
          <StatsCard
            title="Total Profit"
            value="$0"
            icon={TrendingUp}
            description="Profit this month"
          />
          <StatsCard
            title="Orders"
            value="0"
            icon={ShoppingCart}
            description="Orders this month"
          />
        </div>

        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Get Started</h3>
          <p className="text-muted-foreground">
            Connect your Neon database to start managing your workshop inventory and sales
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
