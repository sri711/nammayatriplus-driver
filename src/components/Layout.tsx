
import { ReactNode } from "react";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  showHeader?: boolean;
}

const Layout = ({ 
  children, 
  fullWidth = false, 
  className, 
  showHeader = true 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-driver-background">
      {showHeader && <Header />}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out animate-fade-in",
        fullWidth ? "w-full" : "container mx-auto px-4 py-4 md:px-6",
        className
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
