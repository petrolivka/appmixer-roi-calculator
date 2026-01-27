"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-mesh-gradient py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
              variants={fadeInUp}
            >
              Calculate Your{" "}
              <span className="text-gradient-primary">Integration ROI</span>
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Discover how much you can save by choosing Appmixer over building
              custom integrations. Get personalized projections in under 5
              minutes.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-rose-500 px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 transition-all duration-200"
              >
                Start Calculator
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { value: "413%", label: "Average iPaaS ROI" },
              { value: "<4 mo", label: "Payback Period" },
              { value: "$2.2M", label: "Avg. Annual Benefits" },
              { value: "64%", label: "Faster Integration" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={staggerItem}
              >
                <div className="text-4xl sm:text-5xl font-bold text-gradient-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-heading text-3xl font-bold text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            What You&apos;ll Get
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Build vs. Buy Analysis",
                description:
                  "Compare the true cost of building custom integrations against using Appmixer over 3 years.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                ),
              },
              {
                title: "ROI Projections",
                description:
                  "Get personalized ROI calculations including payback period, break-even point, and total savings.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                ),
              },
              {
                title: "PDF Report",
                description:
                  "Download a professional report to share with stakeholders and build your business case.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                ),
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                className="p-6 rounded-xl border bg-white/70 backdrop-blur-xl border-white/20 shadow-lg dark:bg-white/5 dark:border-white/10 hover:shadow-xl transition-shadow duration-200"
                variants={staggerItem}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>
            Industry benchmarks sourced from Nucleus Research, Informatica, and
            Gartner.
          </p>
          <p className="mt-2">
            <Link href="/methodology" className="text-primary hover:underline">
              View our calculation methodology
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
