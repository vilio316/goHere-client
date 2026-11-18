import { useCallback } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  RecommendationCard,
  type Recommendation,
} from "../layout/RecommendationCard";
import { sampleRecommendations } from "../../data/recommendations";

export function RecommendationsScreen() {
  const navigate = useNavigate();

  const handleExplore = useCallback(
    (recommendation: Recommendation) => {
      const query = recommendation.mood
        ? `?q=${encodeURIComponent(recommendation.mood)}`
        : "";

      navigate(`/explore${query}`);
    },
    [navigate],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="mx-auto w-full max-w-6xl py-4 md:py-10">
          <header className="animate-phrase-in">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="solo">For you</Badge>
              <span className="font-data text-xs text-text-secondary">
                {sampleRecommendations.length} picks near you
              </span>
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold text-text-primary md:text-3xl">
              Recommended for you
            </h1>

            <p className="mt-2 max-w-2xl text-body-m text-text-secondary">
              Solo-friendly places picked from what's nearby, open now, and easy
              to enjoy on your own.
            </p>
          </header>

          <section
            aria-labelledby="recommendations-heading"
            className="mt-6 md:mt-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="recommendations-heading"
                  className="font-display text-lg font-bold text-text-primary"
                >
                  Top picks near you
                </h2>
                <p className="mt-1 text-label-s uppercase text-text-secondary">
                  Curated for solo exploring
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() => navigate("/explore")}
                className="gap-2"
              >
                <span>Browse all</span>
                <FaArrowRight aria-hidden="true" size={12} />
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onExplore={handleExplore}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
