import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import fitnessLogo from "@/assets/fitness-logo.png";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-login without validation
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image/Logo Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary via-accent to-primary items-center justify-center p-8">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <img 
            src={fitnessLogo} 
            alt="Fitness App Logo" 
            className="w-64 h-64 object-contain animate-pulse"
          />
          <h1 className="text-5xl font-bold text-white text-center tracking-wider">
            FITNESS APP
          </h1>
          <p className="text-white/90 text-center text-lg">
            Transform your body, transform your life
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center gap-4 mb-8">
            <img 
              src={fitnessLogo} 
              alt="Fitness App Logo" 
              className="w-32 h-32 object-contain"
            />
            <h1 className="text-3xl font-bold text-primary tracking-wider">
              FITNESS APP
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Enter your email and password
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-secondary/50 border-border"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              LOG IN
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-border hover:bg-secondary"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-border hover:bg-secondary"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
