import { Button } from "./ui/Button";
import { StatusBar } from "./layout";

export default function ErrorPage() {
  return (
    <div className="flex flex-col h-screen">
      <StatusBar time="9:41" />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="font-display font-bold text-2xl mb-4">Resource not found</h2>
          <p className="text-slate-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Button variant="primary" onClick={() => window.location.href = "/"}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}