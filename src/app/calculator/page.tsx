import { Suspense } from "react";
import { WizardContainer } from "@/components/calculator/WizardContainer";

export const metadata = {
  title: "ROI Calculator | Appmixer",
  description: "Calculate your return on investment with Appmixer integration platform",
};

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading calculator...</div>}>
      <WizardContainer />
    </Suspense>
  );
}
