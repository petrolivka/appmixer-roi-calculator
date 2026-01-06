import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Calculate Your{" "}
              <span className="text-primary">Integration ROI</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover how much you can save by choosing Appmixer over building
              custom integrations. Get personalized projections in under 5
              minutes.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            >
              Start Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                413%
              </div>
              <div className="text-sm text-muted-foreground">Average iPaaS ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                &lt;4 mo
              </div>
              <div className="text-sm text-muted-foreground">Payback Period</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                $2.2M
              </div>
              <div className="text-sm text-muted-foreground">
                Avg. Annual Benefits
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                64%
              </div>
              <div className="text-sm text-muted-foreground">Faster Integration</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            What You&apos;ll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build vs. Buy Analysis</h3>
              <p className="text-muted-foreground">
                Compare the true cost of building custom integrations against
                using Appmixer over 3 years.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">ROI Projections</h3>
              <p className="text-muted-foreground">
                Get personalized ROI calculations including payback period,
                break-even point, and total savings.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Report</h3>
              <p className="text-muted-foreground">
                Download a professional report to share with stakeholders and
                build your business case.
              </p>
            </div>
          </div>
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
