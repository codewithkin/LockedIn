import { Navbar, Footer } from "@/components/landing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Target,
  Users,
  TrendingUp,
  Bell,
  Shield,
  Smartphone,
  Calendar,
  BarChart3,
  Share2,
  Zap,
  CheckCircle2,
  Download,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | LockedIn",
  description: "Discover all the powerful features that make LockedIn the best app for goal tracking and accountability.",
  openGraph: {
    title: "LockedIn Features - Everything You Need to Achieve Your Goals",
    description: "From goal tracking to gang accountability, discover what makes LockedIn different.",
  },
};

const mainFeatures = [
  {
    icon: Target,
    title: "Smart Goal Tracking",
    description: "Set goals with flexible frequencies—daily, weekly, monthly, or custom schedules. Track your progress with beautiful check-in interfaces and streak counters.",
    highlights: ["Custom frequencies", "Streak tracking", "Progress visualization"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Gang Accountability",
    description: "Create or join Gangs—groups of people with shared goals. See each other's progress, celebrate wins together, and hold each other accountable.",
    highlights: ["Create private or public gangs", "Shared goal tracking", "Group celebrations"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    description: "Understand your patterns with detailed analytics. See when you're most likely to succeed and get insights to improve your consistency.",
    highlights: ["Weekly/monthly reports", "Pattern recognition", "Success predictions"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const additionalFeatures = [
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Get notified at the right time to check in on your goals.",
    color: "text-blue-500",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    description: "Choose what's public and what stays between you and your gang.",
    color: "text-purple-500",
  },
  {
    icon: Smartphone,
    title: "Offline Mode",
    description: "Track progress even without internet. Syncs when you're back online.",
    color: "text-pink-500",
  },
  {
    icon: Calendar,
    title: "Habit Calendar",
    description: "Visualize your consistency with beautiful calendar views.",
    color: "text-yellow-500",
  },
  {
    icon: BarChart3,
    title: "Detailed Stats",
    description: "See your completion rates, streaks, and overall performance.",
    color: "text-cyan-500",
  },
  {
    icon: Share2,
    title: "Share Progress",
    description: "Share achievements with your gang or on social media.",
    color: "text-indigo-500",
  },
];

const gangFeatures = [
  {
    title: "Create Your Gang",
    description: "Start a gang for your friends, family, or colleagues. Set it as public for anyone to join, or keep it private.",
  },
  {
    title: "Shared Goals",
    description: "Create goals that your entire gang works towards together. Everyone's progress contributes to the group's success.",
  },
  {
    title: "Gang Leaderboard",
    description: "See who's crushing it this week with gang leaderboards. A little friendly competition never hurt anyone!",
  },
  {
    title: "Group Check-ins",
    description: "Check in on your goals and see your gang members' check-ins in real-time.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-orange-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Features
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="text-primary">Lock In</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From personal goal tracking to gang accountability, LockedIn has all the features you need to achieve your goals and stay focused.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-2xl border flex items-center justify-center">
                    <feature.icon className={`w-20 h-20 ${feature.color} opacity-20`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gang Deep Dive */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                The Power of <span className="text-primary">Gangs</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Gangs are at the heart of LockedIn. Here's why they're game-changing.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {gangFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-background rounded-2xl p-6 border"
                >
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">And Much More</h2>
            <p className="text-muted-foreground">
              Every detail is designed to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-muted/30 rounded-xl p-5 border flex items-start gap-4"
              >
                <feature.icon className={`w-6 h-6 ${feature.color} shrink-0`} />
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-500">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience All Features?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Download LockedIn today and start achieving your goals with a community that has your back.
          </p>
          <Link
            href="/download/lockedin.apk"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "h-14 px-8 text-lg font-semibold gap-3 rounded-lg"
            )}
          >
            <Download className="w-5 h-5" />
            Download Now
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
