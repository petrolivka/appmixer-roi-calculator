"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Calendar, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ActionButtonsProps {
  onDownloadPdf: () => void;
  onShare: () => void;
  isGeneratingPdf?: boolean;
}

export function ActionButtons({ onDownloadPdf, onShare, isGeneratingPdf }: ActionButtonsProps) {
  const handleScheduleDemo = () => {
    // In production, this would open a Calendly/HubSpot booking widget
    window.open("https://appmixer.com/contact", "_blank");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingPdf ? "Generating..." : "Download PDF Report"}
          </Button>

          <Button
            variant="outline"
            onClick={handleScheduleDemo}
            className="flex-1"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Demo
          </Button>

          <Button variant="outline" onClick={onShare} className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link
            href="/calculator"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calculator
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
