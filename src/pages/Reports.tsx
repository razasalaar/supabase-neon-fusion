import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">Comprehensive insights and analytics</p>
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
                <CardDescription>Overall profit analysis across all products</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No profit data available yet. Start making sales to see profit insights.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>Detailed sales performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No sales data available yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>Stock levels and inventory valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No inventory data available yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
