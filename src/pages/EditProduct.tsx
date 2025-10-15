import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, Product, Workshop } from "@/lib/api";
import { toast } from "sonner";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productName: "",
    itemNo: "",
    quantity: "",
    costPerPiece: "",
    sellPrice: "",
    workshopId: "",
  });

  useEffect(() => {
    if (id && user?.id) {
      fetchData();
    }
  }, [id, user?.id]);

  const fetchData = async () => {
    if (!user?.id || !id) return;

    try {
      const [productsData, workshopsData] = await Promise.all([
        api.getAllProducts(user.id),
        api.getWorkshops(user.id),
      ]);

      const foundProduct = productsData.find((p) => p.id === id);
      if (!foundProduct) {
        toast.error("Product not found");
        navigate("/products");
        return;
      }

      setProduct(foundProduct);
      setWorkshops(workshopsData);

      // Populate form with existing data
      setFormData({
        productName: foundProduct.product_name,
        itemNo: foundProduct.item_no || "",
        quantity: foundProduct.product_quantity.toString(),
        costPerPiece: foundProduct.cost_per_piece.toString(),
        sellPrice: foundProduct.sell_price_per_piece.toString(),
        workshopId: foundProduct.workshop_id,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load product data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !id) return;

    try {
      setLoading(true);
      await api.updateProduct(id, {
        product_name: formData.productName,
        item_no: formData.itemNo || undefined,
        product_quantity: parseInt(formData.quantity),
        cost_per_piece: parseFloat(formData.costPerPiece),
        sell_price_per_piece: parseFloat(formData.sellPrice),
        workshop_id: formData.workshopId,
      });

      toast.success("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground mt-2">
              Loading product data...
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-2">
            Update the details of "{product.product_name}"
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Update the details of your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workshop">Workshop</Label>
                <Select
                  value={formData.workshopId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, workshopId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workshop" />
                  </SelectTrigger>
                  <SelectContent>
                    {workshops.map((workshop) => (
                      <SelectItem key={workshop.id} value={workshop.id}>
                        {workshop.workshop_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemNo">Item Number</Label>
                <Input
                  id="itemNo"
                  value={formData.itemNo}
                  onChange={(e) =>
                    setFormData({ ...formData, itemNo: e.target.value })
                  }
                  placeholder="Enter item number"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerPiece">Cost Per Piece</Label>
                  <Input
                    id="costPerPiece"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPerPiece}
                    onChange={(e) =>
                      setFormData({ ...formData, costPerPiece: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellPrice">Sell Price Per Piece</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, sellPrice: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/products")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditProduct;
