import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, Product, Workshop } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Products = () => {
  const navigate = useNavigate();
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
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This will also delete all associated sales records."
      )
    ) {
      return;
    }

    try {
      await api.deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const getWorkshopName = (workshopId: string) => {
    const workshop = workshops.find((w) => w.id === workshopId);
    return workshop?.workshop_name || "Unknown Workshop";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground mt-2">
                View and manage your product inventory
              </p>
            </div>
            <Button disabled>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-8 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your product inventory
            </p>
          </div>
          <Button onClick={() => navigate("/add-product")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                All your products with stock levels and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No products yet. Add your first product to get started.
                </p>
                <Button onClick={() => navigate("/add-product")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Product Inventory ({products.length} products)
              </CardTitle>
              <CardDescription>
                All your products with stock levels and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Item No</TableHead>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/Piece</TableHead>
                    <TableHead>Sell Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.product_name}
                      </TableCell>
                      <TableCell>
                        {product.item_no ? (
                          <Badge variant="outline">{product.item_no}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getWorkshopName(product.workshop_id)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.product_quantity > 0
                              ? "default"
                              : "destructive"
                          }
                        >
                          {product.product_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ${Number(product.cost_per_piece).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${Number(product.sell_price_per_piece).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${Number(product.total_cost).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/edit-product/${product.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
