"use client";

import { motion } from "motion/react";
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
    <Card variant="glass">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="gradient"
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPdf ? "Generating..." : "Download PDF Report"}
            </Button>
          </motion.div>

          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={handleScheduleDemo}
              className="w-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" onClick={onShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
          </motion.div>
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
