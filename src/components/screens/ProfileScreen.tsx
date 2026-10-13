import { StatusBar } from "../layout";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";

export function ProfileScreen() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-xl mx-auto w-full py-12">
          <h2 className="font-display font-bold text-2xl mb-6">Profile</h2>
          <Card className="mb-4">
            <CardBody className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-dusk-700 flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">
                    Solo Traveler
                  </h3>
                  <p className="text-slate-400 text-sm">Exploring since 2026</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardBody className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-dusk-600">
                <span className="text-fog-050">Saved places</span>
                <span className="font-data font-semibold text-amber-500">
                  0
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dusk-600">
                <span className="text-fog-050">Places visited</span>
                <span className="font-data font-semibold text-amber-500">
                  0
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-fog-050">Cities explored</span>
                <span className="font-data font-semibold text-amber-500">
                  0
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <Button variant="secondary" fullWidth>
                ⚙️ Settings
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="text-transit-500 border-transit-500/30 hover:bg-transit-500/10"
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
