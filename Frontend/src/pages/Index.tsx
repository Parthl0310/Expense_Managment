import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, TrendingUp, Shield, Zap, Globe } from "lucide-react";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description: "Create and manage employee-manager hierarchies with ease"
    },
    {
      icon: Zap,
      title: "Automated Approvals",
      description: "Smart approval workflows based on configurable rules"
    },
    {
      icon: Globe,
      title: "Multi-Currency",
      description: "Support for multiple currencies with real-time conversion"
    },
    {
      icon: Shield,
      title: "OCR Integration",
      description: "Automatic receipt scanning and data extraction"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Comprehensive expense reports and insights"
    },
    {
      icon: CheckCircle,
      title: "Compliance",
      description: "Built-in compliance and audit trail features"
    }
  ];

  const benefits = [
    "Reduce expense processing time by 80%",
    "Real-time approval notifications",
    "Mobile-friendly dashboard",
    "Customizable approval workflows",
    "Secure cloud storage",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Smart Expense Management with{" "}
                <span className="bg-clip-text text-black ">
                  Automated Approvals
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline your expense workflow, reduce manual work, and gain complete visibility 
                into company spending with intelligent automation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button variant="hero" size="lg" className="shadow-glow">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Free 14-day trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Expense Management Dashboard" 
                className="rounded-2xl shadow-2xl border border-border"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Manage Expenses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make expense management effortless for your entire team
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose ExpenseFlow?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of companies that trust ExpenseFlow to manage their expenses efficiently.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-border shadow-xl">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Start Your Free Trial</h3>
                  <p className="text-muted-foreground">
                    No credit card required. Get started in minutes.
                  </p>
                </div>
                <div className="space-y-4">
                  <Link to="/signup" className="block">
                    <Button variant="hero" size="lg" className="w-full">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      Sign In to Existing Account
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
