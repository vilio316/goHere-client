import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import {authClient} from "../../lib/authClient";

export function SavedScreen() {
  const {data: session} = authClient.useSession();


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-xl mx-auto w-full py-12">
          <h2 className="font-display font-bold text-2xl mb-6 text-center">
            Saved Places
          </h2>
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-text-secondary mb-6">No saved places yet</p>
              <p className="text-text-lede text-sm mb-6">
                Tap the save icon on any place to add it here
              </p>
              <Button variant="primary" onClick={() => window.history.back()}>
                Start Exploring
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
