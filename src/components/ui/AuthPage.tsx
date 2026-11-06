import type { FormEvent } from "react";
import { useState } from "react";
import {
  FaArrowRight,
  FaBookmark,
  FaCompass,
  FaMapPin,
} from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ThemeToggle } from "../layout/ThemeToggle";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardBody } from "./Card";
import { Input } from "./Input";

export type AuthMode = "signin" | "signup";

export interface SignInValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
}

export interface AuthPageProps {
  initialMode?: AuthMode;
  onSignIn?: (values: SignInValues) => void | Promise<void>;
  onSignUp?: (values: SignUpValues) => void | Promise<void>;
  onGuest?: () => void;
  onForgotPassword?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  className?: string;
}

const features = [
  {
    icon: FaBookmark,
    title: "Keep your spots",
    description: "Save the places you want to come back to.",
  },
  {
    icon: FaCompass,
    title: "Pick up where you left off",
    description: "Your searches and moods stay with you.",
  },
  {
    icon: FaMapPin,
    title: "Made for right now",
    description: "Recommendations shaped around where you are.",
  },
];

export function AuthPage({
  initialMode = "signin",
  onSignIn,
  onSignUp,
  onGuest,
  onForgotPassword,
  onTermsClick,
  onPrivacyClick,
  className = "",
}: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFormError(null);
    setShowPassword(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await onSignIn?.({ email, password, remember });
      } else {
        await onSignUp?.({ name, email, password });
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignIn = mode === "signin";

  return (
    <main
      className={`min-h-screen bg-surface-page lg:grid lg:grid-cols-2 ${className}`}
    >
      <BrandPanel />

      <section
        aria-labelledby="auth-title"
        className="relative flex min-h-screen flex-col overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 8%, var(--accent-tint), transparent 38%)",
          }}
        />

        <div className="absolute right-4 top-4 z-20">
          <ThemeToggle tone="surface" />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:py-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-fill text-on-accent">
                <FaCompass aria-hidden="true" size={18} />
              </span>
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-text-primary">
                  GoHere
                </p>
                <p className="font-data text-[10px] uppercase tracking-[0.24em] text-text-secondary">
                  City guide / after dark
                </p>
              </div>
            </div>

            <Card variant="elevated" className="w-full">
              <CardBody className="p-6 sm:p-8">
                <div key={`header-${mode}`} className="animate-phrase-in">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-signal-500"
                    />
                    <p className="font-data text-[10px] uppercase tracking-[0.24em] text-text-secondary">
                      Secure access
                    </p>
                  </div>

                  <h1
                    id="auth-title"
                    className="mt-3 font-display text-2xl font-bold text-text-primary sm:text-3xl"
                  >
                    {isSignIn ? "Sign in to your city" : "Create your account"}
                  </h1>
                  <p className="mt-2 text-body-m text-text-secondary">
                    {isSignIn
                      ? "Your saved spots and recommendations are waiting."
                      : "Start saving the places that make your city yours."}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Authentication mode"
                  className="mt-6 grid grid-cols-2 gap-1 rounded-pill bg-surface-sunken p-1"
                >
                  <button
                    type="button"
                    aria-pressed={isSignIn}
                    disabled={isSubmitting}
                    onClick={() => switchMode("signin")}
                    className={`rounded-pill px-4 py-2 text-sm font-semibold transition-standard focus-visible-ring disabled:cursor-not-allowed disabled:opacity-60 ${
                      isSignIn
                        ? "bg-chip-active-bg text-chip-active-text shadow-sm"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    aria-pressed={!isSignIn}
                    disabled={isSubmitting}
                    onClick={() => switchMode("signup")}
                    className={`rounded-pill px-4 py-2 text-sm font-semibold transition-standard focus-visible-ring disabled:cursor-not-allowed disabled:opacity-60 ${
                      !isSignIn
                        ? "bg-chip-active-bg text-chip-active-text shadow-sm"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                <form
                  key={`form-${mode}`}
                  onSubmit={handleSubmit}
                  className="animate-phrase-in mt-6 space-y-4"
                >
                  {!isSignIn && (
                    <Input
                      label="Full name"
                      type="text"
                      placeholder="Alex Rivera"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  )}

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  <PasswordField
                    id={isSignIn ? "signin-password" : "signup-password"}
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    autoComplete={
                      isSignIn ? "current-password" : "new-password"
                    }
                    showPassword={showPassword}
                    onToggleVisibility={() =>
                      setShowPassword((visible) => !visible)
                    }
                    hint={isSignIn ? undefined : "At least 8 characters."}
                    minLength={isSignIn ? undefined : 8}
                  />

                  {isSignIn ? (
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(event) => setRemember(event.target.checked)}
                          className="h-4 w-4 rounded border-border-strong accent-amber-500 focus-visible-ring"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="rounded-sm text-xs font-semibold text-accent-text transition-colors hover:underline focus-visible-ring"
                      >
                        Forgot password?
                      </button>
                    </div>
                  ) : null}

                  {formError && (
                    <div
                      role="alert"
                      className="rounded-md border border-alert-text/30 bg-badge-closed-bg px-3 py-2 text-xs leading-5 text-badge-closed-text"
                    >
                      {formError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    className="mt-2 gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? isSignIn
                        ? "Signing in…"
                        : "Creating account…"
                      : isSignIn
                        ? "Sign in"
                        : "Create account"}
                    {!isSubmitting && <FaArrowRight aria-hidden="true" />}
                  </Button>
                </form>

                {!isSignIn && (
                  <p className="mt-4 text-balance text-center text-xs leading-5 text-text-secondary">
                    By creating an account, you agree to our{" "}
                    <button
                      type="button"
                      onClick={onTermsClick}
                      className="rounded-sm font-semibold text-accent-text transition-colors hover:underline focus-visible-ring"
                    >
                      Terms
                    </button>{" "}
                    and{" "}
                    <span className="whitespace-nowrap">
                      <button
                        type="button"
                        onClick={onPrivacyClick}
                        className="rounded-sm font-semibold text-accent-text transition-colors hover:underline focus-visible-ring"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </p>
                )}

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border-subtle" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface-raised px-3 text-label-s text-text-secondary">
                      or
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  disabled={isSubmitting}
                  onClick={onGuest}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue as guest
                </Button>
              </CardBody>
            </Card>

            <p className="mt-6 text-center text-xs text-text-secondary">
              Your city, on your terms. No account needed to explore.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  hint?: string;
  minLength?: number;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  showPassword,
  onToggleVisibility,
  hint,
  minLength,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-label-s text-text-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          minLength={minLength}
          className="pr-12"
          required
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-3 flex w-8 items-center justify-center rounded-sm text-text-secondary transition-colors hover:text-text-primary focus-visible-ring"
        >
          {showPassword ? (
            <FiEyeOff aria-hidden="true" size={18} />
          ) : (
            <FiEye aria-hidden="true" size={18} />
          )}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  );
}

function BrandPanel() {
  return (
    <section
      aria-label="About GoHere"
      className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-dusk-950 p-10 lg:flex xl:p-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 600 600"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[560px] w-[560px] text-dusk-700/80"
        focusable="false"
      >
        <circle
          cx="300"
          cy="300"
          r="220"
          fill="none"
          stroke="currentColor"
        />
        <circle
          cx="300"
          cy="300"
          r="160"
          fill="none"
          stroke="currentColor"
          strokeDasharray="6 12"
        />
        <path
          d="M300 40v520M40 300h520"
          stroke="currentColor"
          strokeDasharray="3 12"
        />
        <circle cx="300" cy="300" r="6" fill="currentColor" />
        <circle cx="430" cy="170" r="8" className="fill-amber-500" />
      </svg>

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-dusk-950">
          <FaCompass aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-text-on-dark">
            GoHere
          </p>
          <p className="font-data text-[10px] uppercase tracking-[0.24em] text-nav-muted">
            City guide / after dark
          </p>
        </div>
      </div>

      <div className="relative z-10 flex max-w-lg flex-1 flex-col justify-center py-16">
        <Badge variant="solo" className="mb-5 w-fit">
          Member access
        </Badge>
        <p className="text-display-l text-text-on-dark">
          Your city,
          <br />
          <span className="text-amber-500">after dark.</span>
        </p>
        <p className="mt-5 max-w-md text-body-m text-nav-muted">
          Save the places you love, pick up where you left off, and get
          recommendations that fit your night.
        </p>

        <ul className="mt-8 space-y-4">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-dusk-800 text-amber-500">
                <Icon aria-hidden="true" size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-text-on-dark">
                  {title}
                </p>
                <p className="mt-0.5 text-sm text-nav-muted">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.2em] text-nav-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-500" />
        <span>Built for the city, after dark</span>
      </div>
    </section>
  );
}
