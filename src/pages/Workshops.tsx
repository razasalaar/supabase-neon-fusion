import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

const Workshops = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workshops</h1>
            <p className="text-muted-foreground mt-2">Manage your workshop locations</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Workshop
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Workshops</CardTitle>
            <CardDescription>Create and manage multiple workshop locations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No workshops yet. Add your first workshop to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Workshops;
