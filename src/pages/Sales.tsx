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
import { useAuth } from "@/contexts/AuthContext";
import { api, Product, Workshop } from "@/lib/api";
import { toast } from "sonner";

const Sales = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    product: "",
    quantity: "",
    sellingPrice: "",
  });

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      const [productsData, workshopsData] = await Promise.all([
        api.getAllProducts(user.id),
        api.getWorkshops(user.id),
      ]);
      setProducts(productsData);
      setWorkshops(workshopsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load products and workshops");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const selectedProduct = products.find((p) => p.id === formData.product);
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    const requestedQuantity = parseInt(formData.quantity);
    if (requestedQuantity > selectedProduct.product_quantity) {
      toast.error(
        `Insufficient stock! Available: ${selectedProduct.product_quantity}, Requested: ${requestedQuantity}`
      );
      return;
    }

    try {
      setLoading(true);
      await api.createSale({
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone || undefined,
        sold_quantity: requestedQuantity,
        selling_price_piece: parseFloat(formData.sellingPrice),
        cost_price_piece: selectedProduct.cost_per_piece,
        workshop_id: selectedProduct.workshop_id,
        product_id: selectedProduct.id,
      });

      toast.success("Sale recorded successfully! Stock updated.");

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        product: "",
        quantity: "",
        sellingPrice: "",
      });

      // Refresh products to update quantities
      fetchData();
    } catch (error) {
      console.error("Failed to record sale:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to record sale";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWorkshopName = (workshopId: string) => {
    const workshop = workshops.find((w) => w.id === workshopId);
    return workshop?.workshop_name || "Unknown Workshop";
  };

  const getProductDisplayName = (product: Product) => {
    return `${product.product_name} (${
      product.item_no || "No Item#"
    }) - ${getWorkshopName(product.workshop_id)} - Stock: ${
      product.product_quantity
    }`;
  };

  if (products.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Make Sale</h1>
            <p className="text-muted-foreground mt-2">
              Record a new sale transaction
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>No Products Available</CardTitle>
              <CardDescription>
                You need to add products before making sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Before recording sales, you need to create workshops and add
                products to your inventory.
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => (window.location.href = "/workshops")}>
                  Go to Workshops
                </Button>
                <Button onClick={() => (window.location.href = "/add-product")}>
                  Add Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Make Sale</h1>
          <p className="text-muted-foreground mt-2">
            Record a new sale transaction
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sale Details</CardTitle>
            <CardDescription>
              Enter customer and product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="Enter phone number (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => {
                    const selectedProduct = products.find(
                      (p) => p.id === value
                    );
                    setFormData({
                      ...formData,
                      product: value,
                      sellingPrice: selectedProduct
                        ? selectedProduct.sell_price_per_piece.toString()
                        : "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {getProductDisplayName(product)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={
                      formData.product
                        ? products.find((p) => p.id === formData.product)
                            ?.product_quantity
                        : undefined
                    }
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="1"
                    required
                  />
                  {formData.product && (
                    <p className="text-xs text-muted-foreground">
                      💡 Maximum available:{" "}
                      {
                        products.find((p) => p.id === formData.product)
                          ?.product_quantity
                      }{" "}
                      units
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price Per Piece</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, sellingPrice: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                  {formData.product && (
                    <p className="text-xs text-muted-foreground">
                      💡 Auto-filled with suggested price. You can adjust as
                      needed.
                    </p>
                  )}
                </div>
              </div>

              {formData.product && (
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-semibold mb-3">Sale Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span className="font-medium">
                        {
                          products.find((p) => p.id === formData.product)
                            ?.product_name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Item Number:</span>
                      <span>
                        {products.find((p) => p.id === formData.product)
                          ?.item_no || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Workshop:</span>
                      <span>
                        {getWorkshopName(
                          products.find((p) => p.id === formData.product)
                            ?.workshop_id || ""
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Stock:</span>
                      <span>
                        {products.find((p) => p.id === formData.product)
                          ?.product_quantity || 0}{" "}
                        units
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span>Cost per piece:</span>
                      <span className="text-red-600">
                        $
                        {Number(
                          products.find((p) => p.id === formData.product)
                            ?.cost_per_piece || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suggested sell price:</span>
                      <span className="text-blue-600">
                        $
                        {Number(
                          products.find((p) => p.id === formData.product)
                            ?.sell_price_per_piece || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your selling price:</span>
                      <span className="font-medium">
                        ${formData.sellingPrice || "0.00"}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{formData.quantity || 0}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount:</span>
                      <span>
                        $
                        {(
                          parseFloat(formData.quantity || "0") *
                          parseFloat(formData.sellingPrice || "0")
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Estimated Profit:</span>
                      <span
                        className={
                          parseFloat(formData.sellingPrice || "0") -
                            Number(
                              products.find((p) => p.id === formData.product)
                                ?.cost_per_piece || 0
                            ) >=
                          0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        $
                        {(
                          parseFloat(formData.quantity || "0") *
                          (parseFloat(formData.sellingPrice || "0") -
                            Number(
                              products.find((p) => p.id === formData.product)
                                ?.cost_per_piece || 0
                            ))
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Recording Sale..." : "Record Sale"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
