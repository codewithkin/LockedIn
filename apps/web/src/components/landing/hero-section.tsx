"use client";

import { buttonVariants } from "@/components/ui/button";
import { Download, Target, Users, TrendingUp, CheckCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 lg:pt-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-background pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary/80 rounded-full blur-[80px] opacity-60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-secondary mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-secondary-foreground">The #1 Goal Tracking App</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Manage Your Goals Anytime, <br />
            <span className="text-primary">Anywhere.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            LockedIn helps you track goals, build accountability, join gangs, and manage your progress — all in one simple app.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/download/lockedin.apk"
              className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 rounded-full text-base gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1")}
            >
              <Download className="w-5 h-5" />
              <div className="flex flex-col items-start text-xs leading-none">
                <span className="opacity-80">Download on</span>
                <span className="text-sm font-bold">Android APK</span>
              </div>
            </Link>
            <span
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 px-8 rounded-full text-base gap-3 border-2 opacity-50 cursor-not-allowed")}
            >
              <Smartphone className="w-5 h-5" />
              <div className="flex flex-col items-start text-xs leading-none">
                <span className="opacity-80">Get it on</span>
                <span className="text-sm font-bold">App Store</span>
              </div>
            </span>
          </div>
        </div>

        {/* App Preview - Phone Mockups */}
        <div className="relative flex justify-center items-end gap-6 max-w-6xl mx-auto perspective-1000">
          
          {/* Floating Widget Left */}
          <div className="hidden lg:block absolute left-10 top-1/4 animate-float-slow z-20">
            <div className="bg-card/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border flex items-center gap-3 w-max">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-sm">10k+ Happy Users</p>
                <div className="flex text-yellow-500 text-xs">★★★★★</div>
              </div>
            </div>
          </div>

          {/* Left Phone - Gang View */}
          <div className="hidden md:block w-64 transform -rotate-6 translate-y-12 opacity-90 hover:opacity-100 hover:rotate-0 hover:z-20 transition-all duration-500">
            <div className="bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
              <div className="bg-background rounded-[2rem] overflow-hidden h-[500px] relative border-4 border-foreground/5">
                {/* Mock UI */}
                <div className="bg-primary/5 p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Runner's Gang</h3>
                      <p className="text-xs text-muted-foreground">24 Members Active</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className="bg-card p-3 rounded-xl flex items-center gap-3 shadow-sm">
                         <div className="w-8 h-8 rounded-full bg-muted" />
                         <div className="flex-1">
                           <div className="h-2 w-20 bg-muted rounded full mb-1" />
                           <div className="h-1.5 w-12 bg-muted/50 rounded-full" />
                         </div>
                         <CheckCircle className="w-4 h-4 text-green-500" />
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Phone (Main) - Dashboard */}
          <div className="w-72 md:w-80 z-10 transform hover:scale-105 transition-transform duration-500">
            <div className="bg-foreground rounded-[3rem] p-3 shadow-2xl ring-8 ring-black/10">
              <div className="bg-background rounded-[2.5rem] overflow-hidden h-[600px] relative border-4 border-foreground/5 flex flex-col">
                {/* Status Bar Mock */}
                <div className="h-6 flex justify-between px-6 py-2">
                  <span className="text-[10px] font-bold">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-foreground rounded-full opacity-20" />
                    <div className="w-3 h-3 bg-foreground rounded-full opacity-20" />
                  </div>
                </div>
                
                {/* App Header */}
                <div className="px-6 pt-4 pb-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                       <p className="text-muted-foreground text-xs font-medium">Welcome back,</p>
                       <h2 className="text-xl font-bold">Alex Johnson</h2>
                    </div>
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">AJ</div>
                  </div>
                  
                  {/* Hero Card inside Phone */}
                  <div className="bg-primary p-5 rounded-3xl text-primary-foreground mb-6 shadow-lg shadow-primary/30">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-primary-foreground/80 text-xs text-medium">Daily Progress</p>
                          <h3 className="text-2xl font-bold">85%</h3>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full">
                           <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                     </div>
                     <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-white rounded-full" />
                     </div>
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm">Your Goals</h3>
                    <div className="bg-card border p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                       <div className="bg-orange-100 p-3 rounded-xl">
                          <Target className="w-6 h-6 text-orange-600" />
                       </div>
                       <div>
                          <p className="font-bold text-sm">Read 20 Pages</p>
                          <p className="text-xs text-muted-foreground">Reading Comp • 12/20</p>
                       </div>
                    </div>
                    <div className="bg-card border p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                       <div className="bg-blue-100 p-3 rounded-xl">
                          <Smartphone className="w-6 h-6 text-blue-600" />
                       </div>
                       <div>
                          <p className="font-bold text-sm">Less Screen Time</p>
                          <p className="text-xs text-muted-foreground">Wellness • 2h left</p>
                       </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Nav Mock */}
                <div className="bg-card border-t mt-auto p-4 flex justify-around items-center pb-6">
                   <div className="w-6 h-6 bg-primary rounded-full" />
                   <div className="w-6 h-6 bg-muted rounded-full" />
                   <div className="w-6 h-6 bg-muted rounded-full" />
                   <div className="w-6 h-6 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Phone - Stats */}
          <div className="hidden md:block w-64 transform rotate-6 translate-y-12 opacity-90 hover:opacity-100 hover:rotate-0 hover:z-20 transition-all duration-500">
            <div className="bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
              <div className="bg-background rounded-[2rem] overflow-hidden h-[500px] relative border-4 border-foreground/5">
                <div className="bg-secondary/30 p-6 h-full">
                  <h3 className="font-bold mb-4 text-center">Weekly Insights</h3>
                  <div className="flex items-end justify-between h-40 mb-6 gap-2">
                     {[40, 70, 50, 90, 60, 80, 75].map((h, i) => (
                       <div key={i} className="bg-primary/80 w-full rounded-t-lg hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                     ))}
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm border text-center">
                     <p className="text-xs text-muted-foreground">Total Focus Time</p>
                     <p className="text-2xl font-bold text-primary">32h 15m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Widget Right */}
          <div className="hidden lg:block absolute right-10 top-1/3 animate-float z-20">
             <div className="bg-card/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border space-y-3 w-48">
                <div className="flex items-center gap-3">
                   <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <Target className="w-4 h-4" />
                   </div>
                   <div className="text-xs">
                      <p className="font-bold">Goal Hit!</p>
                      <p className="text-muted-foreground">You saved $500</p>
                   </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <Users className="w-4 h-4" />
                   </div>
                   <div className="text-xs">
                      <p className="font-bold">Gang Invite</p>
                      <p className="text-muted-foreground">John added you</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
