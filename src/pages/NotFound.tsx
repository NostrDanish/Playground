import { useSeoMeta } from "@unhead/react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "404 - Lost Blobbi",
    description: "This Blobbi wandered off! Return home to find it.",
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-4">
        <div className="text-6xl">🐾</div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">
          Oops! This Blobbi wandered off the trail...
        </p>
        <Button asChild className="rounded-xl">
          <a href="/">Return Home 🏠</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
