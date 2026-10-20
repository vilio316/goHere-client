import { Card, CardPhoto, CardBody, CardMeta, CardActions } from "../ui/Card";
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
  phone?: string;
  website?: string;
}

export interface PlaceCardProps {
  place: Place;
  onDetailClick?: () => void;
  onSaveClick?: () => void;
  compact?: boolean;
}

export function PlaceCard({
  place,
  onDetailClick,
  onSaveClick,
  compact = false,
}: PlaceCardProps) {
  if (compact) {
    return (
      <Card className="mb-6">
        <CardBody>
          <h3 className="font-display font-bold text-lg text-fog-050 mb-2">
            {place.name}
          </h3>
          <CardMeta>
            <div className="flex gap-2 font-data text-xs">
              <span>⏱️ {place.walkTime}</span>
              <span>📍 {place.distance}</span>
            </div>
          </CardMeta>
          <CardActions>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={onDetailClick}
            >
              👁️ Details
            </Button>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={onSaveClick}
            >
              💾 Save
            </Button>
          </CardActions>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardBody>
        <h3 className="font-display font-bold text-xl text-fog-050 mb-2">
          {place.name}
        </h3>
        {/* <p className="text-slate-400 text-sm mb-4">{place.why}</p> */}
        <CardMeta>
          <div className="flex gap-2 font-data text-xs">
            <span>⏱️ {place.walkTime}</span>
            <span>📍 {place.distance}</span>
          </div>
        </CardMeta>
        <CardMeta>
          {place.phone && (
            <div className="flex items-center gap-1">
              <span>Phone: </span>
              <span className="font-medium">{place.phone}</span>
            </div>
          )}
          {place.website && (
            <div className="block items-center gap-1 text-sm font-light">
              <span>Website: </span>
              <a className="font-medium" href={place.website} target="_blank">
                {place.website}
              </a>
            </div>
          )}
        </CardMeta>
        <CardActions>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onDetailClick}
          >
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
