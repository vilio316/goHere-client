import type { Recommendation } from "../components/layout/RecommendationCard";
import { dummyPlaces } from "./places";

/**
 * Presentation-only sample feed for the Recommendations page. It reuses the
 * shared demo places and adds the category + Explore mood that each card needs.
 * Swap this for the recommendations API response once the endpoint exists.
 *
 * `mood` values must match the labels in `data/moods.ts` because they are sent
 * to Explore as the `q` search param.
 */
const recommendationDetails: Record<
  string,
  Pick<Recommendation, "category" | "mood">
> = {
  "1": { category: "Coffee & café", mood: "Food & Drinks" },
  "2": { category: "Museum" },
  "3": { category: "Park", mood: "Parks/Gardens" },
  "4": { category: "Bookshop", mood: "Shopping" },
  "5": { category: "Rooftop bar", mood: "Nightlife" },
  "6": { category: "Walking tour" },
  "7": { category: "Café", mood: "Food & Drinks" },
  "8": { category: "Live music", mood: "Nightlife" },
};

export const sampleRecommendations: Recommendation[] = dummyPlaces.map(
  (place) => ({
    ...place,
    ...(recommendationDetails[place.id] ?? { category: "Nearby pick" }),
  }),
);
