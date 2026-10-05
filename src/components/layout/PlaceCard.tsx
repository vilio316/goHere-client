import { Card, CardPhoto, CardBody, CardMeta, CardActions } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export interface Place {
  id: string;
  name: string;
  description: string;
  why: string;
  distance: string;
  walkTime: string;
  rating: number;
  reviewCount: number;
  isOpenNow: boolean;
  isSoloFriendly: boolean;
  vibe: string;
  hours: string;
  photoUrl?: string;
}

export interface PlaceCardProps {
  place: Place;
  onDetailClick?: () => void;
  onSaveClick?: () => void;
  compact?: boolean;
}

export function PlaceCard({ place, onDetailClick, onSaveClick, compact = false }: PlaceCardProps) {
  const badges = [];
  if (place.isOpenNow) badges.push(<Badge key="live" variant="live">Open now</Badge>);
  if (place.isSoloFriendly) badges.push(<Badge key="solo" variant="solo">🎯 Solo-friendly</Badge>);
  if (!place.isOpenNow) badges.push(<Badge key="closed" variant="closed">Closed</Badge>);

  if (compact) {
    return (
      <Card className="mb-6">
        <CardPhoto className="h-40">
          <div className="flex gap-2">{badges}</div>
        </CardPhoto>
        <CardBody>
          <h3 className="font-display font-bold text-lg text-fog-050 mb-2">{place.name}</h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{place.why}</p>
          <CardMeta>
            <div className="flex gap-2 font-data text-xs">
              <span>⏱️ {place.walkTime}</span>
              <span>📍 {place.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>★</span>
              <span className="font-medium">{place.rating}</span>
            </div>
          </CardMeta>
          <CardActions>
            <Button variant="secondary" size="sm" fullWidth onClick={onDetailClick}>
              👁️ Details
            </Button>
            <Button variant="secondary" size="sm" fullWidth onClick={onSaveClick}>
              💾 Save
            </Button>
          </CardActions>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardPhoto>
        <div className="flex gap-2">{badges}</div>
      </CardPhoto>
      <CardBody>
        <h3 className="font-display font-bold text-xl text-fog-050 mb-2">{place.name}</h3>
        <p className="text-slate-400 text-sm mb-4">{place.why}</p>
        <CardMeta>
          <div className="flex gap-2 font-data text-xs">
            <span>⏱️ {place.walkTime}</span>
            <span>📍 {place.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>★</span>
            <span className="font-medium">{place.rating}</span>
          </div>
        </CardMeta>
        <CardActions>
          <Button variant="secondary" size="sm" fullWidth onClick={onDetailClick}>
            👁️ Details
          </Button>
          <Button variant="secondary" size="sm" fullWidth onClick={onSaveClick}>
            💾 Save
          </Button>
        </CardActions>
      </CardBody>
    </Card>
  );
}