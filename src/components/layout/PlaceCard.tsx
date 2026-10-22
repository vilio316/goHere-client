import { Card, CardBody, CardMeta, CardActions } from "../ui/Card";
import { Button } from "../ui/Button";
import { FaClock, FaEye } from "react-icons/fa6";
import { FaWalking, FaSave } from "react-icons/fa"

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
              className="group hover:text-amber-500 hover:text-[15px] hover:bg-slate-600/45 rounded-xl transition-standard px-2 py-1 gap-x-1" 
            >
            <FaSave/>
            <span>Save</span>
            </Button>
          </CardActions>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardBody>
        <h3 className="font-display font-bold text-xl text-fog-050 mb-2 h-12 overflow-clip">
          {place.name}
        </h3>
        {/* <p className="text-slate-400 text-sm mb-4">{place.why}</p> */}
        <CardMeta>
          <div className="flex gap-2 font-data text-xs">
            <span>
              <FaClock size={18}/>
            </span>
            <span>{place.walkTime} walk</span>
            <span><FaWalking size={20}/></span>
            <span>{place.distance}</span>
          </div>
        </CardMeta>
        <CardMeta className="h-12">
          {place.phone && (
            <div className="flex items-center gap-1">
              <span>Phone: </span>
              <span className="font-medium">{place.phone}</span>
            </div>
          )}
          {place.website && (
            <div className="flex items-center gap-1 text-sm font-light">
              <span>Website: </span>
              <a className="font-medium max-w-25 truncate" href={place.website} target="_blank">
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
            className="group hover:bg-slate-600/45 hover:text-amber-500 hover:text-[15px] rounded-xl transition-standard px-2 py-1 gap-x-1"
          >
            <span>
              <FaEye/>
            </span>
            <span>Details</span>
          </Button>
          <Button variant="secondary" size="sm" fullWidth onClick={onSaveClick}  className="group hover:text-amber-500 hover:text-[15px] hover:bg-slate-600/45 rounded-xl transition-standard px-2 py-1 gap-x-1" >
            <span><FaSave /></span>
            <span>Save Location</span>
          </Button>
        </CardActions>
      </CardBody>
    </Card>
  );
}
