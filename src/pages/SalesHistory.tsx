import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Sale } from "@/lib/api";
import { toast } from "sonner";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle,
} from "lucide-react";

const SalesHistory = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [user?.id]);

  const fetchSales = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const salesData = await api.getAllSales(user.id);
      setSales(salesData);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      toast.error("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  const getTotalStats = () => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.total_sale_price),
      0
    );
    const totalProfit = sales.reduce(
      (sum, sale) => sum + Number(sale.profit),
      0
    );

    return { totalSales, totalRevenue, totalProfit };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Sales History</h1>
            <p className="text-muted-foreground mt-2">
              View all your past sales transactions
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
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
          <h1 className="text-3xl font-bold">Sales History</h1>
          <p className="text-muted-foreground mt-2">
            View all your past sales transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">
                All time transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total sales amount
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Profit
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalProfit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total profit earned
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales ({sales.length} transactions)</CardTitle>
            <CardDescription>
              Complete history of all sales transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No sales recorded yet. Start making sales to see your history.
                </p>
                <Button onClick={() => (window.location.href = "/sales")}>
                  Make Your First Sale
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block md:hidden">
                  <div className="space-y-3">
                    {sales.map((sale) => (
                      <Card key={sale.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-muted-foreground">
                                Customer:
                              </span>
                              <div className="font-medium text-sm">
                                {sale.customer_name}
                              </div>
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                Product:
                              </span>
                              <div className="text-sm text-muted-foreground">
                                {sale.product_name || "Unknown Product"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                Item #:
                              </span>
                              <div className="text-sm text-muted-foreground">
                                {sale.item_no || "N/A"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Workshop:
                              </span>
                              <div className="text-xs text-muted-foreground">
                                {sale.workshop_name || "Unknown Workshop"}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(sale)}
                            className="flex-shrink-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Workshop</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">
                            {formatDate(sale.sale_date)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {sale.customer_name}
                              </div>
                              {sale.customer_phone && (
                                <div className="text-sm text-muted-foreground">
                                  {sale.customer_phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {sale.product_name || "Unknown Product"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Item: {sale.item_no || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {sale.workshop_name || "Unknown Workshop"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {sale.sold_quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${Number(sale.selling_price_piece).toFixed(2)}
                          </TableCell>
                          <TableCell className="font-medium">
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
                          <TableCell>
                            <Badge variant="default">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sale Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm mx-auto max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>
              Complete information about this sale transaction
            </DialogDescription>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-2">
              <div className="bg-muted p-3 rounded-lg space-y-2">
                {/* Customer */}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Customer:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedSale.customer_name}
                  </span>
                </div>
                {selectedSale.customer_phone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Phone:
                    </span>
                    <span className="text-sm">
                      {selectedSale.customer_phone}
                    </span>
                  </div>
                )}

                {/* Product */}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Product:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedSale.product_name || "Unknown Product"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Item #:</span>
                  <span className="text-sm">
                    {selectedSale.item_no || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Workshop:
                  </span>
                  <span className="text-sm">
                    {selectedSale.workshop_name || "Unknown Workshop"}
                  </span>
                </div>

                {/* Sale Details */}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm">
                    {formatDate(selectedSale.sale_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedSale.sold_quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Unit Price:
                  </span>
                  <span className="text-sm">
                    ${Number(selectedSale.selling_price_piece).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Cost per Unit:
                  </span>
                  <span className="text-sm">
                    ${Number(selectedSale.cost_price_piece).toFixed(2)}
                  </span>
                </div>

                {/* Financial */}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Amount:
                  </span>
                  <span className="text-sm font-semibold">
                    ${Number(selectedSale.total_sale_price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Cost:
                  </span>
                  <span className="text-sm">
                    ${Number(selectedSale.total_cost).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profit:</span>
                  <span
                    className={`text-sm font-semibold ${
                      Number(selectedSale.profit) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${Number(selectedSale.profit).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SalesHistory;
