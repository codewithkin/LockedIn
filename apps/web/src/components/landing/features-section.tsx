"use client";

import {
  Target,
  Users,
  TrendingUp,
  Bell,
  Shield,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set daily, weekly, or monthly goals. Track your progress with beautiful visualizations.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Gang Accountability",
    description: "Build your gang of like-minded achievers. Stay accountable together and celebrate wins.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    description: "Get insights into your progress patterns. Understand what works for you.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a check-in with intelligent notifications that keep you on track.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your goals are yours. Control who sees your progress with public or private profiles.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Smartphone,
    title: "Offline Ready",
    description: "Track your progress even without internet. Sync when you're back online.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* blob background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Everything You Need <br />
            <span className="text-primary">Nothing You Don't.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Comprehensive goal tracking and accountability designed with simplicity and effectiveness in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
