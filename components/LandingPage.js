"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
// You will import data, icons, and other components here

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Section 1: Hero */}
      <section className="text-center py-24 bg-gray-50">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Manage Your Finances with Intelligence
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          An AI-powered financial management platform that helps you track, analyze, and optimize your budget.
        </p>
        <div className="mt-8 space-x-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>
      
      {/* You will add the Stats, Features, and Testimonials sections here */}

    </div>
  );
};

export default LandingPage;