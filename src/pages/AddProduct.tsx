import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    itemNo: '',
    quantity: '',
    costPerPiece: '',
    sellPrice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will integrate with Neon DB
    console.log('Product data:', formData);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add Product</h1>
          <p className="text-muted-foreground mt-2">Add a new product to your inventory</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Enter the details of your new product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemNo">Item Number</Label>
                <Input
                  id="itemNo"
                  value={formData.itemNo}
                  onChange={(e) => setFormData({ ...formData, itemNo: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerPiece">Cost Per Piece</Label>
                  <Input
                    id="costPerPiece"
                    type="number"
                    step="0.01"
                    value={formData.costPerPiece}
                    onChange={(e) => setFormData({ ...formData, costPerPiece: e.target.value })}
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
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Product</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddProduct;
