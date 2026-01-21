"use client";

import Link from "next/link";
import { Target } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Target className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          
          <h2 className="text-2xl font-bold mb-2">LockedIn</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Lock in to your goals together. Join goal-setters who are achieving more every day.
          </p>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline transition-all">
              Home
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground hover:underline transition-all">
              About
            </Link>
            <Link href="/features" className="text-muted-foreground hover:text-foreground hover:underline transition-all">
              Features
            </Link>
            <Link href="/download/lockedin.apk" className="text-muted-foreground hover:text-foreground hover:underline transition-all">
              Download
            </Link>
          </div>

          <div className="h-px w-full max-w-2xl bg-border/50 mb-8" />

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LockedIn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
