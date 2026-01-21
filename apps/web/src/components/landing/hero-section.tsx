"use client";

import { buttonVariants } from "@/components/ui/button";
import { Download, Target, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Lock In To Your Goals{" "}
            <span className="text-primary">Together</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track your goals, build accountability with your gang, and achieve more together.
            All your goal tracking needs are now in one app.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/download/lockedin.apk"
              className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-lg")}
            >
              <Download className="w-5 h-5" />
              Download for Android
            </Link>
            <span
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 rounded-lg opacity-50 cursor-not-allowed")}
            >
              iOS Coming Soon
            </span>
          </div>
        </div>

        {/* App Preview - Phone Mockups */}
        <div className="relative flex justify-center items-end gap-4 max-w-5xl mx-auto">
          {/* Left Phone */}
          <div className="hidden md:block w-48 lg:w-56 transform -rotate-6 translate-y-8">
            <div className="bg-muted rounded-3xl p-2 shadow-2xl">
              <div className="bg-background rounded-2xl aspect-[9/19] flex items-center justify-center border">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Gang View</p>
                  <p className="text-lg font-bold mt-2">24 Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Phone (Main) */}
          <div className="w-64 lg:w-72 z-10">
            <div className="bg-muted rounded-3xl p-2 shadow-2xl">
              <div className="bg-background rounded-2xl aspect-[9/19] flex flex-col border overflow-hidden">
                {/* Mock App Header */}
                <div className="bg-primary/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Welcome back</p>
                  <p className="font-semibold">Let&apos;s Get Locked In! 🔥</p>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Save $500</span>
                    </div>
                    <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-primary rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$300 / $500</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Run 50 miles</span>
                    </div>
                    <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full w-2/5 bg-green-500 rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">23.5 / 50 mi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Phone */}
          <div className="hidden md:block w-48 lg:w-56 transform rotate-6 translate-y-8">
            <div className="bg-muted rounded-3xl p-2 shadow-2xl">
              <div className="bg-background rounded-2xl aspect-[9/19] flex items-center justify-center border">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-lg font-bold mt-2">8 Goals Hit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
