"use client";

import { buttonVariants } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DownloadSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-orange-500" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Smartphone className="w-4 h-4" />
            Available Now
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Lock In?
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Download LockedIn today and start achieving your goals with a community that has your back.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/download/lockedin.apk"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "h-14 px-8 text-lg font-semibold gap-3 w-full sm:w-auto rounded-lg"
              )}
            >
              <Download className="w-5 h-5" />
              Download for Android
            </Link>
            
            <span
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-14 px-8 text-lg font-semibold gap-3 bg-transparent border-white/30 text-white w-full sm:w-auto rounded-lg opacity-50 cursor-not-allowed"
              )}
            >
              <Download className="w-5 h-5" />
              iOS Coming Soon
            </span>
          </div>
          
          <p className="mt-6 text-sm text-white/60">
            Requires Android 8.0 or higher • 25MB
          </p>
        </div>
      </div>
    </section>
  );
}
