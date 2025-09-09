"use client";

import { HeroSection } from "../components/ui/hero";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { FeaturesSection } from "../components/ui/features-section";
import { memo } from "react";
import { Logos3 } from "../components/ui/logos3";

const StatsSection = memo(() => {
  const stats = [
    { number: "10K+", label: "Events Created" },
    { number: "500K+", label: "Tickets Sold" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
      {/* Simplified background decoration - removed blur animations */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/8 rounded-full blur-2xl opacity-50"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative">
                <div className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent mb-4 will-change-transform">
                  {stat.number}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-lg md:text-xl text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = "StatsSection";

const TestimonialsSection = memo(() => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Manager",
      company: "Tech Conferences Inc.",
      content:
        "EventBooker has transformed how we manage our tech conferences. The QR code system and payment integration are seamless.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "StartupEvents",
      content:
        "The analytics dashboard gives us incredible insights. We've increased our event attendance by 40% since switching to EventBooker.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      company: "Local Meetups",
      content:
        "Simple, powerful, and reliable. EventBooker handles everything from small meetups to large conferences effortlessly.",
      rating: 5,
      avatar: "ER",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              customers
            </span>{" "}
            say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it - hear from event organizers who
            have transformed their events with EventBooker
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm will-change-transform"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                    <div className="text-purple-400 text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

const CTASection = memo(() => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-900 relative">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to create amazing events?
        </h2>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Join thousands of event organizers who trust EventBooker to power their
          events. Start your free trial today and see the difference.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate("/register")}
            className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl will-change-transform"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            onClick={() => navigate("/events")}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm will-change-transform"
          >
            Browse Events
          </Button>
        </div>

        <div className="mt-12 text-gray-300">
          <p className="text-sm mb-4">
            Trusted by 10,000+ event organizers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 opacity-70">
            <div className="text-xs">✓ Free 14-day trial</div>
            <div className="text-xs">✓ No setup fees</div>
            <div className="text-xs">✓ Cancel anytime</div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default function EventroLandingPage() {
  return (
    <main className="bg-black overflow-x-hidden">
      {/* Minimal CSS for performance optimization only */}
      <style jsx>{`
        section {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .will-change-transform {
          will-change: transform;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <HeroSection />
      <StatsSection />
      <Logos3 />
      <FeaturesSection />
    </main>
  );
}
