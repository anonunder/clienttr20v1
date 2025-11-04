import { useState } from "react";
import { ArrowLeft, Bell, Mail, Dumbbell, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    chatMessages: true,
    weeklyReports: false,
    achievementAlerts: true,
  });

  const handleSave = () => {
    toast.success("Notification preferences saved!");
    setTimeout(() => navigate("/profile"), 1000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="text-foreground hover:bg-background/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 pb-24 space-y-6">
        {/* Push Notifications */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={notifications.pushEnabled}
                  onCheckedChange={() => toggleNotification("pushEnabled")}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Email Notifications */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailEnabled}
                  onCheckedChange={() => toggleNotification("emailEnabled")}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Reminder Settings */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Reminders</h3>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-foreground">Workout Reminders</Label>
                    <p className="text-xs text-muted-foreground">Daily workout notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.workoutReminders}
                  onCheckedChange={() => toggleNotification("workoutReminders")}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-foreground">Meal Reminders</Label>
                    <p className="text-xs text-muted-foreground">Meal time notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.mealReminders}
                  onCheckedChange={() => toggleNotification("mealReminders")}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Updates */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-info/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-info" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Activity Updates</h3>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <Label className="text-foreground">Progress Updates</Label>
                  <p className="text-xs text-muted-foreground">Track your fitness progress</p>
                </div>
                <Switch
                  checked={notifications.progressUpdates}
                  onCheckedChange={() => toggleNotification("progressUpdates")}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <Label className="text-foreground">Achievement Alerts</Label>
                  <p className="text-xs text-muted-foreground">Celebrate your milestones</p>
                </div>
                <Switch
                  checked={notifications.achievementAlerts}
                  onCheckedChange={() => toggleNotification("achievementAlerts")}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-foreground">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Summary of your week</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={() => toggleNotification("weeklyReports")}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Chat Messages</h3>
                  <p className="text-sm text-muted-foreground">Notifications for new messages</p>
                </div>
                <Switch
                  checked={notifications.chatMessages}
                  onCheckedChange={() => toggleNotification("chatMessages")}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
