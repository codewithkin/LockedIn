import { Navbar, Footer } from "@/components/landing";
import { Target, Users, Heart, Sparkles, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | LockedIn",
  description: "Learn about LockedIn's mission to help people lock in to their goals together. Discover our story and values.",
  openGraph: {
    title: "About LockedIn - Lock In Together, Achieve Together",
    description: "Learn about LockedIn's mission to help people lock in to their goals together.",
  },
};

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe goals are better achieved together. Every feature we build strengthens the bonds between goal-setters.",
  },
  {
    icon: Heart,
    title: "Genuine Support",
    description: "Real accountability comes from real relationships. We foster genuine connections, not superficial interactions.",
  },
  {
    icon: Shield,
    title: "Privacy Matters",
    description: "Your goals are personal. We give you full control over what you share and with whom.",
  },
  {
    icon: Sparkles,
    title: "Celebrate Wins",
    description: "Every milestone matters. We help you recognize and celebrate progress, no matter how small.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "The Beginning",
    description: "LockedIn was born from a simple idea: what if achieving goals was a team sport?",
  },
  {
    year: "2024",
    title: "First Beta",
    description: "We launched our beta with a small community of goal-setters who believed in our vision.",
  },
  {
    year: "2025",
    title: "Gang Feature",
    description: "Introduced Gangs - groups of people who hold each other accountable.",
  },
  {
    year: "2025",
    title: "Growing Strong",
    description: "Thousands of users are now locking in together, achieving more than ever before.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-orange-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              About LockedIn
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Lock In Together,{" "}
              <span className="text-primary">Achieve Together</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              LockedIn is more than an app—it's a movement. We're building a community of people who support each other in achieving their goals, one day at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  We believe that the traditional approach to goal-setting is broken. Going it alone leads to burnout, discouragement, and ultimately, giving up.
                </p>
                <p className="text-muted-foreground mb-4">
                  LockedIn flips the script. By bringing people together in "Gangs"—groups of like-minded achievers—we create an environment where accountability is built-in and support is always just a tap away.
                </p>
                <p className="text-muted-foreground">
                  Our mission is simple: <span className="text-foreground font-medium">help people lock in to their goals together</span>.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary to-orange-500 rounded-2xl p-8 text-white">
                <Zap className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Why "Lock In"?</h3>
                <p className="text-white/80">
                  "Locking in" means committing fully—no half-measures, no excuses. When you lock in, you're telling yourself and your gang that you're serious about your goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              These principles guide everything we do at LockedIn.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-muted/30 rounded-2xl p-6 border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground">
              From idea to movement—here's how LockedIn came to be.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {item.year.slice(2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
