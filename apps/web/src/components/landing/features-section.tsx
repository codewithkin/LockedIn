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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Lock In</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From goal setting to accountability, LockedIn has all the features you need to achieve your goals and stay locked in together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-background rounded-2xl p-6 border hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
