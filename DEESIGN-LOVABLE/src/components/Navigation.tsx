import { Home, Dumbbell, Activity, Utensils, MessageCircle, BarChart3, Ruler, User, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  // Mock pending reports count - in a real app this would come from API/state
  const pendingReportsCount = 2;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Dumbbell, label: "Programs", path: "/programs" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: BarChart3, label: "Reports", path: "/reports", badge: pendingReportsCount },
    { icon: Ruler, label: "Measurements", path: "/progress" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center">
        {/* Fixed HOME button on mobile */}
        <Link
          to={navItems[0].path}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all min-w-[70px] flex-shrink-0 relative h-16 border-r border-border md:hidden rounded-[2px]",
            isActive(navItems[0].path) ? "bg-primary text-primary-foreground" : "bg-primary/10 text-foreground hover:bg-primary/20",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium leading-tight text-center">{navItems[0].label}</span>
        </Link>

        {/* Scrollable navigation items */}
        <div className="flex items-center justify-start md:justify-center gap-1 h-16 px-2 overflow-x-auto scrollbar-hide flex-1 md:max-w-4xl md:mx-auto">
          {/* Desktop: Show all items with HOME in the center */}
          <div className="hidden md:flex items-center gap-1">
            {/* Reorder items to put Home in the middle on desktop */}
            {[navItems[1], navItems[2], navItems[5], navItems[0], navItems[3], navItems[4], navItems[6]].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all min-w-[70px] flex-shrink-0 relative",
                    item.path === "/" 
                      ? "rounded-[2px] " + (active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-foreground hover:bg-primary/20")
                      : "rounded-xl " + (active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"),
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile: Show all items EXCEPT HOME (since it's fixed) */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[70px] flex-shrink-0 relative",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
