"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Calendar, Share2, ArrowLeft, Mail, MessageSquare, Link2, ClipboardCopy, Check } from "lucide-react";
import Link from "next/link";
import type { CalculatorInputs } from "@/types/calculator";
import type { CalculationResults } from "@/types/results";
import { generateEmailTemplate, generateSlackMessage, generateSummaryText } from "@/lib/shareTemplates";

interface ActionButtonsProps {
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
  inputs: CalculatorInputs;
  results: CalculationResults;
}

export function ActionButtons({ onDownloadPdf, isGeneratingPdf, inputs, results }: ActionButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const showCopied = (key: string) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleScheduleDemo = () => {
    window.open("https://appmixer.com/contact", "_blank");
  };

  const handleEmailShare = () => {
    const url = window.location.href;
    const { subject, body } = generateEmailTemplate(inputs, results, url);
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  const handleSlackCopy = async () => {
    const url = window.location.href;
    const text = generateSlackMessage(inputs, results, url);
    await navigator.clipboard.writeText(text);
    showCopied("slack");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showCopied("link");
  };

  const handleCopySummary = async () => {
    const text = generateSummaryText(inputs, results);
    await navigator.clipboard.writeText(text);
    showCopied("summary");
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Results
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleEmailShare}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email to Stakeholder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSlackCopy}>
                  {copied === "slack" ? (
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  {copied === "slack" ? "Copied!" : "Copy as Slack Message"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyLink}>
                  {copied === "link" ? (
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                  ) : (
                    <Link2 className="mr-2 h-4 w-4" />
                  )}
                  {copied === "link" ? "Copied!" : "Copy Link"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopySummary}>
                  {copied === "summary" ? (
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                  ) : (
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                  )}
                  {copied === "summary" ? "Copied!" : "Copy Summary"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
