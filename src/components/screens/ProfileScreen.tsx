import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../layout/ThemeToggle";
import  { authClient}  from "../../lib/authClient";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function ProfileScreen() {
  const {data: session} = authClient.useSession();
  const navigate = useNavigate()

  useEffect(() => {
  if (!session || !session.user) {
    navigate('/auth')
  }}, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-xl mx-auto w-full py-12">
          <h2 className="font-display font-bold text-2xl mb-6">Profile</h2>
          <Card className="mb-4">
            <CardBody className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">
                    Solo Traveler
                  </h3>
                  <p className="text-text-secondary text-sm">Exploring since 2026</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardBody className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <span className="text-text-primary">Saved places</span>
                <span className="font-data font-semibold text-accent-text">
                  0
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <span className="text-text-primary">Places visited</span>
                <span className="font-data font-semibold text-accent-text">
                  0
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-primary">Cities explored</span>
                <span className="font-data font-semibold text-accent-text">
                  0
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <div>
                  <p className="text-text-primary">Appearance</p>
                  <p className="text-text-secondary text-xs">
                    Switch between light and dark mode
                  </p>
                </div>
                <ThemeToggle tone="surface" showLabel />
              </div>
              <Button variant="secondary" fullWidth>
                ⚙️ Settings
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="text-alert-text border-alert-text/30 hover:bg-alert-text/10"
              >
                Sign out
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
