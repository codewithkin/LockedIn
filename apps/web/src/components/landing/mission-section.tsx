"use client";

import { Target, Heart, Zap } from "lucide-react";

export function MissionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Our Mission
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Lock In Together,{" "}
            <span className="text-primary">Achieve Together</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            We believe that the best way to achieve your goals is with a community that supports you. LockedIn brings people together to stay accountable, motivated, and focused on what matters most.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">10K+</h3>
              <p className="text-muted-foreground">Goals Achieved</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">5K+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Gangs Created</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
