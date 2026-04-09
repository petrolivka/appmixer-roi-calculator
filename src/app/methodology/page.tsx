import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Building2,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Calculation Methodology | Appmixer ROI Calculator",
  description:
    "Understand how we calculate ROI projections for Appmixer integration platform. Transparent methodology based on industry benchmarks.",
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-white/70 backdrop-blur-xl dark:bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <Image src="/logo.svg" alt="Appmixer" width={140} height={40} priority />
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Open Calculator
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/calculator">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Calculator
            </Button>
          </Link>
          <h1 className="font-heading text-3xl font-bold mb-2">
            Calculation Methodology
          </h1>
          <p className="text-muted-foreground">
            Transparency is important to us. Here&apos;s exactly how we calculate
            your ROI projections.
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              Our ROI calculator compares the total cost of ownership (TCO) between
              building custom integrations in-house versus using the Appmixer
              platform over a 3-year period. The calculations are based on industry
              benchmarks from leading research firms and real-world implementation
              data.
            </p>
            <p>
              All projections are estimates based on typical scenarios. Your actual
              results may vary depending on your specific implementation, team
              efficiency, and usage patterns.
            </p>
          </CardContent>
        </Card>

        {/* Custom Build Costs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Custom Build Cost Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              We calculate custom build costs using the following components:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Initial Development Cost</h4>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  Number of Integrations × Complexity Multiplier × $15,000
                </code>
                <p className="text-sm text-muted-foreground">
                  The base cost of $15,000 per integration represents industry-average
                  development costs including design, implementation, testing, and
                  documentation.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Annual Maintenance</h4>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  Initial Development Cost × 25%
                </code>
                <p className="text-sm text-muted-foreground">
                  Industry standard maintenance rate for software systems, covering
                  bug fixes, API updates, security patches, and monitoring.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Infrastructure Costs</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mt-2">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">API Calls/Month</th>
                        <th className="text-left py-2">Monthly Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">&lt; 50,000</td>
                        <td className="py-2">$500/month</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">50,000 - 500,000</td>
                        <td className="py-2">$1,000/month</td>
                      </tr>
                      <tr>
                        <td className="py-2">&gt; 500,000</td>
                        <td className="py-2">$2,000/month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Developer Opportunity Cost</h4>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  Monthly Dev Hours on Integration × Number of Developers × Hourly Rate × 12 months
                </code>
                <p className="text-sm text-muted-foreground">
                  Time your developers spend maintaining and troubleshooting
                  integrations instead of building core product features.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">3-Year Total Custom Build Cost</h4>
              <code className="block bg-background p-3 rounded text-sm">
                Year 1: Initial Dev + Maintenance + Infrastructure + Opportunity Cost
                <br />
                Year 2-3: Maintenance + Infrastructure + Opportunity Cost (each year)
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Appmixer Costs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Appmixer Cost Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Appmixer costs are calculated based on platform subscription and
              implementation time:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Platform Subscription</h4>
                <p className="text-sm text-muted-foreground">
                  Appmixer pricing is tailored to each customer based on their
                  specific requirements, usage volume, and deployment model. In the
                  calculator, you enter the monthly subscription cost from your
                  custom quote. If you don&apos;t have a quote yet,{" "}
                  <a
                    href="https://appmixer.com/contact"
                    className="text-primary hover:underline"
                  >
                    contact our sales team
                  </a>{" "}
                  for a personalized offer.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Implementation Cost</h4>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  Custom Build Implementation Time × 15%
                </code>
                <p className="text-sm text-muted-foreground">
                  Appmixer implementations typically require only 15% of the time
                  needed for custom builds, representing an 85% reduction in
                  implementation effort.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Ongoing Management</h4>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  (10 hours × Number of Integrations) × 10% × Developer Hourly Rate
                </code>
                <p className="text-sm text-muted-foreground">
                  Custom maintenance is estimated at 10 hours per integration per year.
                  With Appmixer handling infrastructure, updates, and monitoring,
                  ongoing management time is reduced by approximately 90% (10% of
                  custom maintenance effort).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quantified Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Beyond direct cost savings, we quantify additional business benefits
              that contribute to your total ROI:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">One-Time Benefits</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Realized immediately when you launch with Appmixer:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                  <li>
                    <strong>Time-to-Market Value:</strong> Revenue captured by
                    launching faster. Calculated as{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      Months Saved × $5,000 × Revenue Impact Multiplier
                    </code>
                    , where months saved depends on complexity (Simple: 0.5,
                    Medium: 1, Complex: 2 months) and the revenue impact
                    multiplier scales by company size (SMB: 1×, Mid-Market: 1.5×,
                    Enterprise: 3×).
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Annual Recurring Benefits</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Ongoing value realized each year (multiplied by 3 for the
                  projection period):
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                  <li>
                    <strong>Error Reduction:</strong> Cost savings from fewer
                    integration failures and data issues. Calculated as{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      Monthly Incidents × 12 × 95% × $500/incident
                    </code>
                    , based on 95% automated error handling and an industry-average
                    cost of $500 per incident.
                  </li>
                  <li>
                    <strong>Churn Reduction</strong>{" "}
                    <span className="text-xs font-medium text-primary">(end-user-facing integrations only)</span>
                    : Revenue retained through better customer experience.
                    Uses conservative estimated churn costs (SMB: $10k, Mid-Market:
                    $30k, Enterprise: $100k) with a 10% attribution factor — only
                    a fraction of churn reduction is attributed to integration
                    improvements.
                  </li>
                  <li>
                    <strong>Deal Win Rate Improvement</strong>{" "}
                    <span className="text-xs font-medium text-primary">(end-user-facing integrations only)</span>
                    : Additional revenue from winning more deals with integration
                    capabilities. Uses conservative deal values (SMB: $3k,
                    Mid-Market: $15k, Enterprise: $50k) with a 5% attribution
                    factor applied to estimated annual deals.
                  </li>
                  <li>
                    <strong>Compliance Savings</strong>{" "}
                    <span className="text-xs font-medium text-primary">(self-hosted deployments only)</span>
                    : Avoided costs from built-in security and audit capabilities.
                    Amount varies by industry vertical.
                  </li>
                  <li>
                    <strong>Vendor Lock-In Avoidance</strong>{" "}
                    <span className="text-xs font-medium text-primary">(self-hosted deployments only)</span>
                    : Flexibility value from portable, standard integrations.
                    Estimated at $15,000 annually.
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Total 3-Year Benefits</h4>
              <code className="block bg-background p-3 rounded text-sm">
                One-Time Benefits + (Annual Benefits × 3 years)
              </code>
            </div>
          </CardContent>
        </Card>

        {/* ROI Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              ROI Metrics Formulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">3-Year Total Savings</h4>
              <code className="block bg-muted p-3 rounded text-sm mb-2">
                (Custom Build Cost - Appmixer Cost) + One-Time Benefits + (Annual
                Benefits × 3)
              </code>
              <p className="text-sm text-muted-foreground">
                The combined value of cost avoidance plus all quantified benefits
                over the 3-year period.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">ROI Percentage</h4>
              <code className="block bg-muted p-3 rounded text-sm mb-2">
                (3-Year Total Savings / Total Appmixer Cost) × 100
              </code>
              <p className="text-sm text-muted-foreground">
                Represents the percentage return on your Appmixer investment,
                including both cost savings and quantified benefits.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Payback Period</h4>
              <code className="block bg-muted p-3 rounded text-sm mb-2">
                Net Investment / Average Monthly Savings
              </code>
              <div className="text-sm text-muted-foreground space-y-2 mt-3">
                <p>Where:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>
                    <strong>Net Investment</strong> = Appmixer Implementation +
                    First Year Subscription - One-Time Benefits
                  </li>
                  <li>
                    <strong>Average Monthly Savings</strong> = (Cost Savings ÷ 36)
                    + (Annual Benefits ÷ 12)
                  </li>
                </ul>
                <p className="mt-2">
                  One-time benefits (like faster time-to-market) offset your
                  initial investment, potentially reducing payback period
                  significantly.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Net Present Value (NPV)</h4>
              <code className="block bg-muted p-3 rounded text-sm mb-2">
                Year 1: (Cost Savings + One-Time + Annual Benefits) ÷ 1.10
                <br />
                Year 2: (Cost Savings + Annual Benefits) ÷ 1.10²
                <br />
                Year 3: (Cost Savings + Annual Benefits) ÷ 1.10³
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                3-year cash flows adjusted for the time value of money at a 10%
                discount rate. One-time benefits are realized in Year 1 only;
                annual benefits recur each year.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Break-Even Point</h4>
              <p className="text-sm text-muted-foreground">
                The month when your cumulative savings (cost avoidance + benefits)
                exceed your initial Appmixer investment (implementation cost +
                first year platform subscription). This marks when you&apos;ve
                fully recovered your upfront investment and begin realizing net
                positive returns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Complexity Multipliers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complexity Multipliers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Integration complexity significantly impacts development time and cost:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Complexity</th>
                    <th className="text-left py-2">Multiplier</th>
                    <th className="text-left py-2">Typical Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Simple</td>
                    <td className="py-3">0.5×</td>
                    <td className="py-3 text-muted-foreground">
                      Basic data sync, webhooks, simple API calls
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Medium</td>
                    <td className="py-3">1.0×</td>
                    <td className="py-3 text-muted-foreground">
                      Multi-step workflows, data transformations, conditional logic
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Complex</td>
                    <td className="py-3">2.0×</td>
                    <td className="py-3 text-muted-foreground">
                      Custom logic, multiple systems, real-time sync, error handling
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmarks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Industry Benchmark Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our calculations are grounded in research from leading industry analysts:
            </p>

            <div className="space-y-3">
              <a
                href="https://nucleusresearch.com/research/single/roi-guidebook-informatica-ipaas/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Nucleus Research</h4>
                    <p className="text-sm text-muted-foreground">
                      iPaaS ROI Guidebook — Reports average iPaaS ROI of 413% with
                      payback periods under 4 months.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </a>

              <a
                href="https://www.businesswire.com/news/home/20230419005298/en/Informatica-iPaaS-Users-Experience-a-413-ROI-With-an-Average-Payback-of-Fewer-Than-Four-Months-According-to-Nucleus-Research-ROI-Guidebook"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Informatica Customer Studies</h4>
                    <p className="text-sm text-muted-foreground">
                      Documents average annual benefits of $2.2M for enterprise iPaaS
                      implementations.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </a>

              <a
                href="https://www.gartner.com/en/documents/5198963"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Gartner Magic Quadrant</h4>
                    <p className="text-sm text-muted-foreground">
                      Enterprise iPaaS 2024 — Industry analysis and vendor comparisons.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </a>

              <a
                href="https://www.fortunebusinessinsights.com/integration-platform-as-a-service-ipaas-market-109835"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Fortune Business Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      iPaaS Market Report 2024–2032 — Market trends and growth
                      projections. Market valued at $12.87B in 2024, projected to reach
                      $78.28B by 2032.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </a>

              <a
                href="https://www.getknit.dev/blog/state-of-saas-integration"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">State of SaaS Integration Report 2025</h4>
                    <p className="text-sm text-muted-foreground">
                      Global SaaS integration market trends — 40% increase in user
                      engagement for platforms offering native integrations and 75% of
                      business leaders agree integrations enhance business agility.
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </a>
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mt-6">
              <h4 className="font-semibold mb-2">Key Industry Statistics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Average iPaaS ROI</span>
                  <span className="font-medium">413%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Average Payback Period</span>
                  <span className="font-medium">&lt; 4 months</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Integration Speed Improvement</span>
                  <span className="font-medium">64% faster</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance Reduction</span>
                  <span className="font-medium">60-80%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Time-to-Market Acceleration</span>
                  <span className="font-medium">12× faster</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-amber-800">Important Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-900/80">
            <p className="mb-4">
              The projections provided by this calculator are estimates based on
              industry benchmarks and typical implementation scenarios. Actual
              results will vary based on:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Your team&apos;s technical expertise and efficiency</li>
              <li>Complexity and specific requirements of your integrations</li>
              <li>Existing infrastructure and technical debt</li>
              <li>Organizational processes and approval workflows</li>
              <li>Market conditions and vendor pricing changes</li>
            </ul>
            <p>
              We recommend using these projections as a starting point for internal
              discussions and business case development. For a more detailed analysis
              tailored to your specific situation, please contact our solutions team.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold">
            Ready to Calculate Your ROI?
          </h2>
          <p className="text-muted-foreground">
            Use our calculator to get personalized projections for your organization.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/calculator">
              <Button size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                Start Calculator
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Questions about our methodology?{" "}
            <a href="mailto:support@appmixer.com" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
