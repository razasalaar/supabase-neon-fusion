import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Database,
  Building2,
  LogOut,
  PlusCircle,
  History,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/workshops', icon: Building2, label: 'Workshops' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/add-product', icon: PlusCircle, label: 'Add Product' },
    { path: '/sales', icon: ShoppingCart, label: 'Make Sale' },
    { path: '/sales-history', icon: History, label: 'Sales History' },
    { path: '/storage', icon: Database, label: 'Storage' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">Nimble Workshop</h1>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-sidebar-border p-4">
          <div className="mb-3 text-sm text-sidebar-foreground">
            <p className="font-medium">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
