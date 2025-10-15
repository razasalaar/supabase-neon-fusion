import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Product } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  total_products: number;
  total_sales: number;
  total_revenue: number;
  total_profit: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    total_sales: 0,
    total_revenue: 0,
    total_profit: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const [statsData, productsData] = await Promise.all([
          api.getDashboardStats(user.id),
          api.getAllProducts(user.id),
        ]);
        setStats(statsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const getLowStockItems = () => {
    return products.filter(
      (product) => product.product_quantity <= 5 && product.product_quantity > 0
    );
  };

  const getOutOfStockItems = () => {
    return products.filter((product) => product.product_quantity === 0);
  };

  if (loading) {
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
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-6 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            value={stats.total_products.toString()}
            icon={Package}
            description="Products in inventory"
          />
          <StatsCard
            title="Total Sales"
            value={`$${Number(stats.total_revenue).toFixed(2)}`}
            icon={DollarSign}
            description="Revenue this month"
          />
          <StatsCard
            title="Total Profit"
            value={`$${Number(stats.total_profit).toFixed(2)}`}
            icon={TrendingUp}
            description="Profit this month"
          />
          <StatsCard
            title="Orders"
            value={stats.total_sales.toString()}
            icon={ShoppingCart}
            description="Orders this month"
          />
        </div>

        {/* Stock Alerts */}
        {(() => {
          const lowStockItems = getLowStockItems();
          const outOfStockItems = getOutOfStockItems();

          if (lowStockItems.length > 0 || outOfStockItems.length > 0) {
            return (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Stock Alerts
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    Some items need attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {outOfStockItems.length > 0 && (
                      <div className="flex items-center space-x-2 text-red-700">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {outOfStockItems.length} items are out of stock
                        </span>
                      </div>
                    )}
                    {lowStockItems.length > 0 && (
                      <div className="flex items-center space-x-2 text-orange-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {lowStockItems.length} items have low stock (≤5 units)
                        </span>
                      </div>
                    )}
                    <div className="pt-2">
                      <a
                        href="/storage"
                        className="text-sm text-orange-800 hover:text-orange-900 underline"
                      >
                        View detailed inventory →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null;
        })()}

        {stats.total_products === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Get Started</h3>
            <p className="text-muted-foreground">
              Create your first workshop and add products to start managing your
              inventory and sales
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
