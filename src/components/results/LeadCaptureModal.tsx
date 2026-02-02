"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Mail, FileText, Check, Loader2 } from "lucide-react";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadPdf: () => Promise<void>;
  roiPercentage: number;
  threeYearSavings: string;
}

interface LeadFormData {
  name: string;
  email: string;
  company: string;
  role: string;
}

async function submitLead(data: LeadFormData & { roiPercentage: number }) {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    // Silently fail — don't block PDF download
    return false;
  }
}

export function LeadCaptureModal({
  open,
  onOpenChange,
  onDownloadPdf,
  roiPercentage,
  threeYearSavings,
}: LeadCaptureModalProps) {
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmitAndDownload = async () => {
    if (!form.name.trim()) return;
    if (!form.email.trim() || !isValidEmail(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);

    // Submit lead data (non-blocking)
    submitLead({ ...form, roiPercentage });

    // Generate and download PDF
    await onDownloadPdf();

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleSkip = async () => {
    await onDownloadPdf();
    onOpenChange(false);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Report Downloaded!</h3>
            <p className="text-muted-foreground mb-4">
              Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}! Your ROI report is ready.
            </p>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Get Your ROI Report
          </DialogTitle>
          <DialogDescription>
            Your analysis shows <span className="font-semibold text-foreground">{roiPercentage}% ROI</span> with{" "}
            <span className="font-semibold text-foreground">{threeYearSavings}</span> in 3-year savings.
            Enter your details to download.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="lead-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lead-name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">
              Work Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={(e) => {
                setForm((f) => ({ ...f, email: e.target.value }));
                if (emailError) setEmailError("");
              }}
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                placeholder="Acme Inc."
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-role">Role</Label>
              <Input
                id="lead-role"
                placeholder="CTO"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="gradient"
            onClick={handleSubmitAndDownload}
            disabled={isSubmitting || !form.name.trim() || !form.email.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </>
            )}
          </Button>
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Skip — just download without details
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
