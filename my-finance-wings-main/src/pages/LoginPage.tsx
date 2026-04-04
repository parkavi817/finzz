import React, { useState } from "react";
import { useApp, Role } from "@/context/AppContext";
import butterflyImg from "@/assets/butterfly.png";
import { Sparkle } from "@/components/Sparkle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User } from "lucide-react";

export default function LoginPage() {
  const { login } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsFlying(true);
    setTimeout(() => login(selectedRole), 2000);
  };

  const handleQuickAdmin = () => {
    setSelectedRole("admin");
    setIsFlying(true);
    setTimeout(() => login("admin"), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-butterfly-teal/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-butterfly-lavender/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-butterfly-pink/5 blur-3xl" />
      </div>

      {/* Sparkles scattered */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Sparkle
          key={i}
          size={Math.random() * 10 + 6}
          delay={Math.random() * 3}
          color={["hsl(40,80%,55%)", "hsl(270,50%,70%)", "hsl(168,60%,50%)"][i % 3]}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Butterfly */}
        <div className="flex justify-center mb-6">
          <div className={`relative ${isFlying ? "animate-fly-away" : "animate-float"}`}>
            <img
              src={butterflyImg}
              alt="FinFly butterfly mascot"
              width={120}
              height={120}
              className={isFlying ? "" : "drop-shadow-lg"}
            />
            {isFlying && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Sparkle
                    key={`fly-${i}`}
                    size={6}
                    delay={i * 0.15}
                    color={["hsl(40,80%,60%)", "hsl(270,50%,75%)", "hsl(168,60%,55%)", "hsl(320,50%,70%)"][i % 4]}
                    style={{
                      top: `${30 + Math.random() * 40}%`,
                      left: `${20 + Math.random() * 60}%`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-heading font-bold text-center mb-1 text-gradient">
          FinFly
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Your finances, beautifully tracked
        </p>

        {/* Loading overlay when flying */}
        {isFlying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="gradient-butterfly rounded-2xl p-8 text-center animate-fade-in-up">
              <p className="text-primary-foreground font-heading font-semibold text-lg">
                ✨ Taking flight... ✨
              </p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className={`glass-card rounded-2xl p-8 transition-opacity duration-500 ${isFlying ? "opacity-30 blur-sm" : ""}`}>
          <h2 className="text-xl font-heading font-semibold text-center mb-6 text-foreground">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          {/* Role Selector */}
          <div className="mb-6">
            <Label className="text-foreground text-sm mb-3 block">Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === "admin"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Shield className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Admin</p>
                  <p className="text-xs opacity-70">Full access</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("viewer")}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === "viewer"
                    ? "border-butterfly-lavender bg-butterfly-lavender/10 text-butterfly-lavender shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-butterfly-lavender/50"
                }`}
              >
                <User className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold text-sm">User</p>
                  <p className="text-xs opacity-70">View only</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" className="bg-background" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>

            <Button
              type="submit"
              disabled={!selectedRole}
              className="w-full gradient-primary text-primary-foreground font-semibold h-11 rounded-xl"
            >
              {isSignup ? "Sign Up" : "Log In"} {selectedRole ? `as ${selectedRole === "admin" ? "Admin" : "User"}` : ""}
            </Button>
          </form>

          {/* Quick Admin Sign In */}
          <div className="mt-4">
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-border flex-1" />
              <span className="text-xs text-muted-foreground px-3">or</span>
              <div className="border-t border-border flex-1" />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleQuickAdmin}
              className="w-full h-11 rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-semibold gap-2"
            >
              <Shield className="h-4 w-4" />
              Sign in as Admin
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-medium hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
