"use client";

import { useEffect } from "react";

export default function EnterToNextField() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process the Enter key (without Shift/Ctrl/Alt)
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;

        // Skip textareas because Enter usually creates a new line in them
        if (target.tagName.toLowerCase() === "textarea") {
          return;
        }

        // Only intercept when focus is on an input or select element
        if (
          target.tagName.toLowerCase() === "input" ||
          target.tagName.toLowerCase() === "select"
        ) {
          e.preventDefault();

          // Find the container (a form, a modal div, or fallback to document.body)
          const container = target.closest("form") || target.closest("[role='dialog']") || target.closest(".modal-container") || document.body;

          // Select all focusable form elements that are actually interactive
          const focusableElements = Array.from(
            container.querySelectorAll<HTMLElement>(
              'input:not([disabled]):not([type="hidden"]):not([readonly]), select:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), button:not([disabled])'
            )
          ).filter((el) => {
            // Basic visibility check: element must take up space
            return el.offsetWidth > 0 || el.offsetHeight > 0;
          });

          const index = focusableElements.indexOf(target);
          if (index > -1 && index < focusableElements.length - 1) {
            const nextElement = focusableElements[index + 1];

            // If the next focusable element is a submit button, we can just click it to submit
            if (
              nextElement.tagName.toLowerCase() === "button" &&
              ((nextElement as HTMLButtonElement).type === "submit" ||
                nextElement.textContent?.toLowerCase().includes("save") ||
                nextElement.textContent?.toLowerCase().includes("submit") ||
                nextElement.textContent?.toLowerCase().includes("confirm"))
            ) {
              nextElement.click();
            } else {
              // Otherwise move focus to it
              nextElement.focus();
            }
          } else if (index === focusableElements.length - 1) {
            // We are at the last focusable element in the container.
            // If it's wrapped in a form, trigger submit.
            const form = target.closest("form");
            if (form && typeof form.requestSubmit === "function") {
              form.requestSubmit();
            } else {
              // Alternatively, search for a submit button in the container and click it
              const submitBtn = container.querySelector<HTMLButtonElement>('button[type="submit"]');
              if (submitBtn) {
                submitBtn.click();
              }
            }
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
