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
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Product, Workshop } from "@/lib/api";
import { toast } from "sonner";
import { Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const Storage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [productsData, workshopsData] = await Promise.all([
        api.getAllProducts(user.id),
        api.getWorkshops(user.id),
      ]);
      setProducts(productsData);
      setWorkshops(workshopsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const getWorkshopName = (workshopId: string) => {
    const workshop = workshops.find((w) => w.id === workshopId);
    return workshop?.workshop_name || "Unknown Workshop";
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { status: "out", color: "destructive", icon: XCircle };
    if (quantity <= 5)
      return { status: "low", color: "secondary", icon: AlertTriangle };
    return { status: "good", color: "default", icon: CheckCircle };
  };

  const getTotalInventoryValue = () => {
    return products.reduce(
      (total, product) =>
        total + product.product_quantity * Number(product.sell_price_per_piece),
      0
    );
  };

  const getLowStockItems = () => {
    return products.filter((product) => product.product_quantity <= 5);
  };

  const getOutOfStockItems = () => {
    return products.filter((product) => product.product_quantity === 0);
  };

  const totalValue = getTotalInventoryValue();
  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Storage</h1>
            <p className="text-muted-foreground mt-2">
              View current stock levels across all products
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
          <h1 className="text-3xl font-bold">Storage</h1>
          <p className="text-muted-foreground mt-2">
            View current stock levels across all products
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Different products
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Inventory value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Items need restocking
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Items out of stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Stock Alerts</CardTitle>
              <CardDescription className="text-orange-700">
                Some items need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              Inventory Storage ({products.length} products)
            </CardTitle>
            <CardDescription>
              Current stock levels and storage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No inventory data available yet. Add products to see your
                  storage information.
                </p>
                <Button onClick={() => (window.location.href = "/add-product")}>
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item No</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/Piece</TableHead>
                    <TableHead>Sell Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockInfo = getStockStatus(product.product_quantity);
                    const StatusIcon = stockInfo.icon;
                    const totalValue =
                      product.product_quantity *
                      Number(product.sell_price_per_piece);

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.item_no ? (
                            <Badge variant="outline">{product.item_no}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.product_name}
                        </TableCell>
                        <TableCell>
                          {getWorkshopName(product.workshop_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockInfo.color as any}>
                            {product.product_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ${Number(product.cost_per_piece).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${Number(product.sell_price_per_piece).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${totalValue.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge variant={stockInfo.color as any}>
                              {stockInfo.status === "out" && "Out of Stock"}
                              {stockInfo.status === "low" && "Low Stock"}
                              {stockInfo.status === "good" && "In Stock"}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Storage;
