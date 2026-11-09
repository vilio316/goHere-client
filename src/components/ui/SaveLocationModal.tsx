import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { FaArrowRight, FaBookmark } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface SaveLocationModalProps {
  open: boolean;
  onClose: () => void;
  /** Shown in the body copy so the prompt feels tied to the tapped place. */
  placeName?: string;
}

/**
 * Guest-only prompt shown when someone tries to save a place. It is dismissible
 * both ways: close the dialog or explicitly continue as a guest.
 */
export function SaveLocationModal({
  open,
  onClose,
  placeName,
}: SaveLocationModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
        className="animate-phrase-in relative w-full max-w-md rounded-lg border border-border-subtle bg-surface-raised p-6 shadow-card-elevated sm:max-w-lg"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close sign-up prompt"
          className="focus-visible-ring absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-standard hover:bg-surface-sunken hover:text-text-primary"
        >
          <FiX aria-hidden="true" size={18} />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-accent-text">
          <FaBookmark aria-hidden="true" size={20} />
        </span>

        <Badge variant="solo" className="mt-4 w-fit">
          Save places
        </Badge>

        <h2
          id={titleId}
          className="mt-3 font-display text-xl font-bold leading-tight text-text-primary"
        >
          Save this place for later
        </h2>

        <p
          id={descriptionId}
          className="mt-2 text-body-m text-text-secondary"
        >
          {placeName
            ? `Create a free GoHere account to save ${placeName} to your profile and find it again anytime.`
            : "Create a free GoHere account to save places to your profile and find them again anytime."}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="focus-visible-ring inline-flex w-full items-center justify-center gap-2 rounded-pill bg-accent-fill px-6 py-3.5 font-body text-base font-semibold text-on-accent transition-standard hover:bg-amber-600 active:scale-[0.98]"
          >
            <span>Sign up to save</span>
            <FaArrowRight aria-hidden="true" size={14} />
          </Link>

          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            Continue as guest
          </Button>
        </div>

        <p className="mt-3 text-center font-data text-xs text-text-secondary">
          No account needed to keep exploring.
        </p>
      </div>
    </div>,
    document.body,
  );
}
