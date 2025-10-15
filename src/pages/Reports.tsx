import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, ProfitSummary, Sale } from "@/lib/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  const { user } = useAuth();
  const [profitSummary, setProfitSummary] = useState<ProfitSummary[]>([]);
  const [salesReport, setSalesReport] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  const fetchReports = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [profitData, salesData] = await Promise.all([
        api.getProfitSummary(user.id),
        api.getSalesReport(user.id),
      ]);
      setProfitSummary(profitData);
      setSalesReport(salesData);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const profitChartData = profitSummary.map((item) => ({
    name:
      item.product_name.length > 15
        ? item.product_name.substring(0, 15) + "..."
        : item.product_name,
    profit: Number(item.total_profit),
    sales: Number(item.total_sales_amount),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights and analytics
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights and analytics
          </p>
        </div>

        <Tabs defaultValue="profit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profit">Profit Summary</TabsTrigger>
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          </TabsList>

          <TabsContent value="profit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profit Summary</CardTitle>
                <CardDescription>
                  Overall profit analysis across all products
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profitSummary.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No profit data available yet. Start making sales to see
                      profit insights.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="profit" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Workshop</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Sold</TableHead>
                          <TableHead>Sales Amount</TableHead>
                          <TableHead>Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profitSummary.map((item) => (
                          <TableRow key={item.product_id}>
                            <TableCell className="font-medium">
                              {item.product_name}
                            </TableCell>
                            <TableCell>{item.workshop_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {item.remaining_stock}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.total_quantity_sold}</TableCell>
                            <TableCell>
                              ${Number(item.total_sales_amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  Number(item.total_profit) >= 0
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                ${Number(item.total_profit).toFixed(2)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>
                  Detailed sales performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesReport.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No sales data available yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sales Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Sales Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesReport.slice(0, 10).map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>
                              {new Date(sale.sale_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{sale.customer_name}</TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {sale.product_name || "Unknown Product"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Item: {sale.item_no || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>{sale.sold_quantity}</TableCell>
                            <TableCell>
                              ${Number(sale.total_sale_price).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  Number(sale.profit) >= 0
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                ${Number(sale.profit).toFixed(2)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>
                  Stock levels and inventory valuation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profitSummary.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No inventory data available yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Inventory Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={profitSummary.map((item) => ({
                              name: item.product_name,
                              value: item.remaining_stock,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {profitSummary.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Inventory Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Workshop</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Unit Cost</TableHead>
                          <TableHead>Total Value</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profitSummary.map((item) => (
                          <TableRow key={item.product_id}>
                            <TableCell className="font-medium">
                              {item.product_name}
                            </TableCell>
                            <TableCell>{item.workshop_name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.remaining_stock > 10
                                    ? "default"
                                    : item.remaining_stock > 0
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {item.remaining_stock}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              ${Number(item.sell_price_per_piece).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              $
                              {(
                                item.remaining_stock *
                                Number(item.sell_price_per_piece)
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.remaining_stock > 10
                                    ? "default"
                                    : item.remaining_stock > 0
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {item.remaining_stock > 10
                                  ? "In Stock"
                                  : item.remaining_stock > 0
                                  ? "Low Stock"
                                  : "Out of Stock"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
