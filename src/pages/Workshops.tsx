import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Workshop } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Workshops = () => {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({ workshop_name: "" });

  useEffect(() => {
    fetchWorkshops();
  }, [user?.id]);

  const fetchWorkshops = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await api.getWorkshops(user.id);
      setWorkshops(data);
    } catch (error) {
      console.error("Failed to fetch workshops:", error);
      toast.error("Failed to load workshops");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      if (editingWorkshop) {
        await api.updateWorkshop(editingWorkshop.id, formData.workshop_name);
        toast.success("Workshop updated successfully");
      } else {
        await api.createWorkshop({
          workshop_name: formData.workshop_name,
          user_id: user.id,
        });
        toast.success("Workshop created successfully");
      }

      setFormData({ workshop_name: "" });
      setEditingWorkshop(null);
      setIsDialogOpen(false);
      fetchWorkshops();
    } catch (error) {
      console.error("Failed to save workshop:", error);
      toast.error("Failed to save workshop");
    }
  };

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({ workshop_name: workshop.workshop_name });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this workshop? This will also delete all associated products and sales."
      )
    ) {
      return;
    }

    try {
      await api.deleteWorkshop(id);
      toast.success("Workshop deleted successfully");
      fetchWorkshops();
    } catch (error) {
      console.error("Failed to delete workshop:", error);
      toast.error("Failed to delete workshop");
    }
  };

  const openCreateDialog = () => {
    setEditingWorkshop(null);
    setFormData({ workshop_name: "" });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Workshops</h1>
              <p className="text-muted-foreground mt-2">
                Manage your workshop locations
              </p>
            </div>
            <Button disabled>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Workshop
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-6 animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold">Workshops</h1>
            <p className="text-muted-foreground mt-2">
              Manage your workshop locations
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Workshop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingWorkshop ? "Edit Workshop" : "Create New Workshop"}
                </DialogTitle>
                <DialogDescription>
                  {editingWorkshop
                    ? "Update your workshop information"
                    : "Add a new workshop location to manage products and sales"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop_name">Workshop Name</Label>
                  <Input
                    id="workshop_name"
                    value={formData.workshop_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workshop_name: e.target.value,
                      })
                    }
                    placeholder="Enter workshop name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingWorkshop ? "Update" : "Create"} Workshop
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {workshops.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Workshops</CardTitle>
              <CardDescription>
                Create and manage multiple workshop locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No workshops yet. Add your first workshop to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workshops.map((workshop) => (
              <Card key={workshop.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {workshop.workshop_name}
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(workshop)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(workshop.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Created {new Date(workshop.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Workshop ID: {workshop.id.slice(0, 8)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Workshops;
