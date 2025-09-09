"use client";

import { Calendar, CreditCard, QrCode, Users, Shield, Zap } from "lucide-react";
import AnimatedCard from "./dynamic-border-animations-card";

function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Event Creation & Management",
      description:
        "Create and manage events with ease. Set up venues, schedules, and capacity limits with our intuitive interface.",
    },
    {
      icon: CreditCard,
      title: "Razorpay Integration",
      description:
        "Secure payment processing with Razorpay. Accept multiple payment methods with industry-standard security.",
    },
    {
      icon: QrCode,
      title: "QR Code Generation",
      description:
        "Automatic QR code generation for tickets. Enable quick check-ins and seamless event entry management.",
    },
    {
      icon: Users,
      title: "Attendee Management",
      description:
        "Track registrations, manage attendee lists, and send automated confirmations and reminders.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with data encryption and reliable infrastructure for your peace of mind.",
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description:
        "Get insights into ticket sales, attendance patterns, and revenue with comprehensive analytics dashboard.",
    },
  ];

  const sectionTitle = "Everything you need to manage events";
  const sectionDescription =
    "From creation to completion, EVENTRO provides all the tools you need to run successful events";

  return (
    <section className="py-20 bg-gray-900 flex items-center justify-center">
      <AnimatedCard
        title={sectionTitle}
        description={sectionDescription}
        features={features}
      />
    </section>
  );
}

export { FeaturesSection };
