"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Entrepreneur",
    avatar: "/avatars/sarah.jpg",
    content: "LockedIn changed how I approach my goals. Having a gang that holds me accountable makes all the difference.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Fitness Coach",
    avatar: "/avatars/marcus.jpg",
    content: "I use LockedIn with all my clients. The group accountability feature is exactly what was missing from other apps.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    avatar: "/avatars/emily.jpg",
    content: "Finally an app that understands that achieving goals is a team sport. My study group and I are crushing it!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="text-primary">Goal-Setters</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what people are saying about their LockedIn experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-muted/30 rounded-2xl p-6 border relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
