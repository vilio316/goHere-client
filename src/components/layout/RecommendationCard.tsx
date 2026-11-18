import { useId } from "react";
import { FaArrowRight, FaWalking } from "react-icons/fa";
import { Button } from "../ui/Button";
import { Card, CardActions, CardBody, CardMeta} from "../ui/Card";
import { transformOSMPlaceToPlace } from "../../utils/placeTransformer";
import type { OSMPlace } from "../../types/osm";
import { useNavigate } from "react-router";



export interface RecommendationCardProps {
  recommendation: OSMPlace;
  onExplore?: (recommendation: OSMPlace) => void;
}

/**
 * Recommendation card built from the shared Card/Button/Badge primitives so it
 * inherits the GoHere surface, type, radius, and motion tokens in both themes.
 */
export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const navigate = useNavigate()
  const headingId = useId();
  const {
    name,
    vibe,
    distance,
    walkTime,
  } = transformOSMPlaceToPlace(recommendation);

  return (
    <article aria-labelledby={headingId} className="h-full">
      <Card
        variant="elevated"
        className="flex h-full flex-col hover:border-border-strong"
      >
        {/* <CardPhoto style={{ height: "144px" }}>
          <div className="flex flex-wrap gap-2">
            <Badge variant={isOpenNow ? "live" : "closed"}>
              {isOpenNow ? "Open now" : "Closed"}
            </Badge>
            {isSoloFriendly && <Badge variant="solo">Solo-friendly</Badge>}
          </div>

          <span className="rounded-pill bg-dusk-950/75 px-2.5 py-1.5 font-data text-xs text-fog-050">
            {hours}
          </span>
        </CardPhoto> */}

        <CardBody className="flex flex-1 flex-col">
          {/* <p className="text-label-s uppercase text-text-secondary">
            {category}
          </p> */}

          <h3
            id={headingId}
            className="mt-1 font-display text-lg font-bold leading-snug text-text-primary"
          >
            {name}
          </h3>

          <p className="mt-2 font-data text-xs text-text-meta">{vibe}</p>

          <div className="flex-1" />

          <CardMeta className="mt-4 grid-cols-2 gap-2">
            <span className="flex items-center gap-1.5">
              <FaWalking aria-hidden="true" size={13} />
              <span>
                {walkTime} walk · {distance}
              </span>
            </span>
          </CardMeta>

          <CardActions>
            <Button
              variant="primary"
              fullWidth
              className="gap-2"
              onClick={() => {
                navigate(`/place/${recommendation.osm_id}`)
              }}
            >
              <span>View Place</span>
              <FaArrowRight aria-hidden="true" size={12} />
            </Button>
          </CardActions>
        </CardBody>
      </Card>
    </article>
  );
}
