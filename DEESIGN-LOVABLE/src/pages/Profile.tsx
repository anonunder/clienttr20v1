import { User, Settings, Bell, LogOut, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    joined: "October 2025",
    plan: "Muscle Gain - Premium",
  };

  const settingsSections = [
    {
      title: "Personal Information",
      icon: User,
      items: [
        { label: "Edit Profile", path: "/profile/edit" },
        { label: "Change Password", path: "/profile/password" },
      ],
    },
    {
      title: "App Preferences",
      icon: Settings,
      items: [
        { label: "Units, Language & Theme", path: "/profile/preferences" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Notification Settings", path: "/profile/notifications" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profile" description="Manage your account and preferences" />
      
      <div className="container px-4 py-8 md:px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* User Info Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary">
              <User className="h-10 w-10" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{userInfo.name}</h2>
              <p className="text-muted-foreground">{userInfo.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since {userInfo.joined} • {userInfo.plan}
              </p>
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="bg-card border-border overflow-hidden">
            <div className="flex items-center gap-3 p-4 bg-primary/5 border-b border-border">
              <section.icon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors text-left"
                >
                  <span className="text-foreground">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Card>
        ))}

        <Separator className="bg-border" />

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          size="lg"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>

        <Card className="bg-card border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            Version 1.0.0 • © 2025 TR20 Fitness App
          </p>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
