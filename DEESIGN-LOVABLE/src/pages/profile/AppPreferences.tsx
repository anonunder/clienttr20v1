import { useState } from "react";
import { ArrowLeft, Settings, Globe, Ruler, Moon, Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AppPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    units: "metric",
    language: "en",
    theme: "dark",
    autoPlay: true,
    hapticFeedback: true,
  });

  const handleSave = () => {
    toast.success("Preferences saved successfully!");
    setTimeout(() => navigate("/profile"), 1000);
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
              <h1 className="text-2xl font-bold text-foreground">App Preferences</h1>
              <p className="text-sm text-muted-foreground">Customize your app experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 pb-24 space-y-6">
        {/* Units */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ruler className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Measurement Units</h3>
                <p className="text-sm text-muted-foreground">Choose between metric and imperial units</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="units" className="text-foreground">Units System</Label>
                <Select
                  value={preferences.units}
                  onValueChange={(value) => setPreferences({ ...preferences, units: value })}
                >
                  <SelectTrigger id="units">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                    <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Language */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Globe className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Language</h3>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-foreground">App Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              {preferences.theme === "dark" ? (
                <Moon className="h-5 w-5 text-warning" />
              ) : (
                <Sun className="h-5 w-5 text-warning" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">Choose your app theme</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-foreground">Appearance</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Video Settings */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <Settings className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Video Settings</h3>
                <p className="text-sm text-muted-foreground">Configure video playback preferences</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoPlay" className="text-foreground">Auto-play Videos</Label>
                  <p className="text-sm text-muted-foreground">Automatically play exercise videos</p>
                </div>
                <Switch
                  id="autoPlay"
                  checked={preferences.autoPlay}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoPlay: checked })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Haptic Feedback */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Haptic Feedback</h3>
              <p className="text-sm text-muted-foreground">Enable vibration for interactions</p>
            </div>
            <Switch
              checked={preferences.hapticFeedback}
              onCheckedChange={(checked) => setPreferences({ ...preferences, hapticFeedback: checked })}
            />
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

export default AppPreferences;
