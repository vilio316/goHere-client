import { Button } from "../ui";

export interface HeroCTAProps {
  onClick: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export function HeroCTA({
  onClick,
  title = "What now?",
  subtitle = "Tap below to find something good right where you are.",
  buttonText = "✨ Show me something",
}: HeroCTAProps) {
  return (
    <div className="bg-gradient-to-br from-dusk-800 to-dusk-700 border border-dusk-600 rounded-lg p-8 text-center">
      <h1 className="font-display font-bold text-3xl mb-4">{title}</h1>
      <p className="text-fog-200 mb-6 text-body-m">{subtitle}</p>
      <Button variant="primary" size="default" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
}
