import { useCallback, useEffect, useState } from "react";
import { FiDownload, FiShare, FiX } from "react-icons/fi";
import { Button } from "../ui";

/** How long "Not now" hides the prompt before it may appear again. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const SNOOZE_KEY = "gohere-install-prompt-snoozed-until";
const IOS_HINT_DELAY_MS = 1500;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  const standaloneMedia = window.matchMedia?.("(display-mode: standalone)");
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;

  return Boolean(
    standaloneMedia?.matches || navigatorWithStandalone.standalone === true,
  );
}

function isSnoozed() {
  try {
    const snoozedUntil = Number(
      window.localStorage.getItem(SNOOZE_KEY) ?? 0,
    );

    return snoozedUntil > Date.now();
  } catch {
    return false;
  }
}

function snooze() {
  try {
    window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    // localStorage can be unavailable in private/locked-down contexts.
  }
}

function isIosSafari() {
  if (typeof window === "undefined") {
    return false;
  }

  const { userAgent, maxTouchPoints, platform } = window.navigator;
  const isIos =
    /iphone|ipad|ipod/i.test(userAgent) ||
    (platform === "MacIntel" && maxTouchPoints > 1);
  const isSafari =
    /safari/i.test(userAgent) &&
    !/crios|fxios|edgios|opios/i.test(userAgent);

  return isIos && isSafari && !isStandalone();
}

/**
 * Non-blocking install suggestion. It appears as soon as the browser offers an
 * install prompt (or, on iOS, once we can show Add to Home Screen steps) and
 * stays out of the way of the app's own navigation.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIos] = useState(isIosSafari);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const dismiss = useCallback(() => {
    snooze();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isStandalone() || isSnoozed()) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      if (isStandalone() || isSnoozed()) {
        return;
      }

      // Keep the event so we can trigger the browser prompt from our button.
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    const iosTimer = isIos
      ? window.setTimeout(() => {
          if (!isSnoozed()) {
            setIsVisible(true);
          }
        }, IOS_HINT_DELAY_MS)
      : undefined;

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
      if (iosTimer !== undefined) {
        window.clearTimeout(iosTimer);
      }
    };
  }, [isIos]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "dismissed") {
        snooze();
      }

      setIsVisible(false);
    } catch {
      // The browser can reject a stale prompt; hiding avoids a dead button.
      setIsVisible(false);
    } finally {
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:bottom-16 md:px-6 md:pb-4">
      <div
        role="dialog"
        aria-live="polite"
        aria-labelledby="install-prompt-title"
        aria-describedby="install-prompt-description"
        className="animate-phrase-in pointer-events-auto relative mx-auto flex w-full max-w-md items-start gap-3 rounded-lg border border-border-subtle bg-surface-raised p-4 shadow-card-elevated md:max-w-lg"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="focus-visible-ring absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-standard hover:bg-surface-sunken hover:text-text-primary"
        >
          <FiX aria-hidden="true" size={18} />
        </button>

        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-text">
          <FiDownload aria-hidden="true" size={22} />
        </span>

        <div className="min-w-0 flex-1 pr-6">
          <h2
            id="install-prompt-title"
            className="font-display text-base font-bold leading-tight text-text-primary"
          >
            Install GoHere
          </h2>
          <p
            id="install-prompt-description"
            className="mt-1 text-body-m text-text-secondary"
          >
            {isIos ? (
              <>
                Tap{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-text-primary">
                  <FiShare aria-hidden="true" size={14} />
                  Share
                </span>
                , then choose{" "}
                <span className="font-semibold text-text-primary">
                  Add to Home Screen
                </span>{" "}
                for a full-screen, one-tap GoHere.
              </>
            ) : (
              "Add GoHere to your home screen for one-tap access and a full-screen map."
            )}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isIos ? (
              <Button size="sm" onClick={dismiss}>
                Got it
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleInstall}
                  disabled={isInstalling || !deferredPrompt}
                >
                  {isInstalling ? "Opening…" : "Install"}
                </Button>
                <Button size="sm" variant="ghost" onClick={dismiss}>
                  Not now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
