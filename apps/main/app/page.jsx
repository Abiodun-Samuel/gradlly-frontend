"use client";
import React, { useState } from "react";

import CTA from "@/components/Home/CTA";
import FlowPortal from "@/components/Home/FlowPortal";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import HowItWorks from "@/components/Home/HowItWorks";
import Marquee from "@/components/Home/Marquee";
import Nav from "@/components/Home/Nav";
import Portals from "@/components/Home/Portals";
import Pricing from "@/components/Home/Pricing";
import Problem from "@/components/Home/Problem";
import Results from "@/components/Home/Results";
import Stats from "@/components/Home/Stats";
import Testimonials from "@/components/Home/Testimonials";
import Why from "@/components/Home/Why";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans bg-stone-50 text-stone-900 overflow-x-hidden">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <Stats />
      <Marquee />
      <Problem />
      <Portals />
      <HowItWorks />
      <FlowPortal />
      <Results />
      <Testimonials />
      <Pricing />
      <Why />
      <CTA />
      <Footer />
    </div>
  );
}
