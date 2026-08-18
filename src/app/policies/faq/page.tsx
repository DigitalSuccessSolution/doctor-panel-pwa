"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ClinicalFaqPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleBack = () => {
    router.push("/policies");
  };

  const faqList = [
    {
      q: "Is Moncradel Doctor PWA free for pediatricians?",
      a: "Yes! Core clinical intake, WHO z-score growth percentile calculation, e-prescriptions, and nutrition charts are 100% complimentary for all verified pediatric practitioners.",
    },
    {
      q: "Does the portal work offline without Wi-Fi?",
      a: "Yes. Moncradel works offline as a Progressive Web App (PWA). Clinical notes and prescriptions recorded offline automatically sync once your internet connection is restored.",
    },
    {
      q: "How are digital e-prescriptions sent to parents?",
      a: "Signed prescriptions are delivered instantly to the parent's mobile number via WhatsApp or exported as a clean PDF document directly from the patient record file.",
    },
    {
      q: "How do I request a new Parent or Child patient account to be linked to my portal?",
      a: "Go to Support Desk and submit an Admin Request ticket with the parent's phone number or child's registration code. Super Admin will link the patient within 2 hours.",
    },
    {
      q: "Is patient health data secure and compliant?",
      a: "All medical records are encrypted using end-to-end AES-256 standard encryption both in transit and at rest, strictly complying with Telemedicine guidelines.",
    },
  ];

  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 sm:-mt-6 sm:-mb-6 lg:-mx-8 animate-fadeIn pb-24 font-sans bg-white min-h-screen">

      <div className="px-4 py-6 sm:px-6">
        {/* Clean Accordion List */}
        <div className="divide-y divide-slate-100">
          {faqList.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#1E4E70] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#1E4E70] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed border-l-2 border-amber-400 pl-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2 font-medium">Still have questions?</p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 bg-[#1E4E70] hover:bg-[#153852] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
