import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Nimble Workshop</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')}>Get Started</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Workshop Management
            <br />
            <span className="text-primary">Made Simple</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Streamline your workshop operations with powerful inventory tracking, sales management,
            and profit analytics all in one place.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-3xl font-bold">Why Choose Nimble Workshop?</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">Inventory Control</h4>
                <p className="text-sm text-muted-foreground">
                  Track products, sub-products, and stock levels in real-time
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">Sales Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Record sales instantly and monitor customer transactions
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <BarChart3 className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">Profit Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Automatic profit calculations and detailed financial reports
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">Secure & Reliable</h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with cloud-based data protection
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
