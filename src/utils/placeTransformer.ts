import type { OSMPlace, OSMTags } from "../types/osm";
import type { Place } from "../components/layout/PlaceCard";

const WALKING_SPEED_M_PER_MIN = 80; // ~4.8 km/h average walking speed

function parseDistance(distanceMeters: string): { distance: string; walkTime: string } {
  const meters = parseFloat(distanceMeters);
  if (isNaN(meters)) return { distance: "?", walkTime: "?" };

  if (meters < 1000) {
    const walkTime = Math.max(1, Math.round(meters / WALKING_SPEED_M_PER_MIN));
    return { distance: `${Math.round(meters)} m`, walkTime: `${walkTime} min` };
  }
  const km = (meters / 1000).toFixed(1);
  const walkTime = Math.max(1, Math.round(meters / WALKING_SPEED_M_PER_MIN));
  return { distance: `${km} km`, walkTime: `${walkTime} min` };
}

function parseOpeningHours(openingHours: string | undefined): { isOpenNow: boolean; hoursText: string } {
  if (!openingHours || openingHours.trim() === "") {
    return { isOpenNow: false, hoursText: "Hours unknown" };
  }

  // Check for 24/7
  if (openingHours.toLowerCase().includes("24/7") || openingHours.toLowerCase().includes("24h")) {
    return { isOpenNow: true, hoursText: "Open 24 hours" };
  }

  // Simple heuristic: if opening_hours exists and isn't empty, assume open during reasonable hours
  // A full implementation would parse the OSM opening_hours format
  const now = new Date();
  const currentHour = now.getHours();

  // Very basic check - if we have opening hours data, assume it's open during day/evening
  const hasDaytimeHours = openingHours.match(/\d{1,2}:\d{2}/);
  if (hasDaytimeHours) {
    // Rough heuristic: open 12:00-23:00 or similar
    const isLikelyOpen = currentHour >= 11 && currentHour <= 23;
    return {
      isOpenNow: isLikelyOpen,
      hoursText: isLikelyOpen ? "Open now" : "Closed",
    };
  }

  return { isOpenNow: false, hoursText: openingHours };
}

function inferSoloFriendly(tags: OSMTags, category: string): boolean {
  // Restaurants, cafes, bars are generally solo-friendly
  const soloFriendlyCategories = [
    "food_and_drink",
    "restaurant",
    "cafe",
    "bar",
    "pub",
    "bistro",
    "coffee_shop",
  ];

  const soloFriendlyCuisines = [
    "coffee_shop",
    "cafe",
    "bakery",
    "ice_cream",
    "juice_bar",
    "tea_house",
  ];

  if (soloFriendlyCategories.some((c) => category.toLowerCase().includes(c))) {
    return true;
  }

  if (tags.cuisine) {
    const cuisines = tags.cuisine.toLowerCase().split(";").map((c) => c.trim());
    if (cuisines.some((c) => soloFriendlyCuisines.includes(c))) {
      return true;
    }
  }

  return true; // Default to true for food places
}

function generateWhyText(tags: OSMTags, category: string, isOpenNow: boolean): string {
  const parts: string[] = [];

  // Cuisine
  if (tags.cuisine) {
    const cuisines = tags.cuisine.split(";").map((c) => c.trim());
    const mainCuisine = cuisines[0];
    parts.push(`${mainCuisine.charAt(0).toUpperCase() + mainCuisine.slice(1)} cuisine`);
  }

  // Opening hours context
  if (isOpenNow) {
    parts.push("open now");
  } else if (tags.opening_hours) {
    parts.push("check hours");
  }

  // Category-based vibe
  if (category.includes("restaurant")) {
    parts.push("sit-down dining");
  } else if (category.includes("cafe") || category.includes("coffee")) {
    parts.push("good for solo work");
  } else if (category.includes("bar") || category.includes("pub")) {
    parts.push("bar seating available");
  }

  // 24/7
  if (tags.opening_hours?.toLowerCase().includes("24/7")) {
    parts.push("24/7");
  }

  return parts.length > 0 ? parts.join(", ") : "Local spot worth checking out";
}

function generateVibe(tags: OSMTags, category: string, isOpenNow: boolean): string {
  const vibes: string[] = [];

  if (isOpenNow) vibes.push("open now");
  if (tags.opening_hours?.toLowerCase().includes("24/7")) vibes.push("24/7");
  if (category.includes("restaurant")) vibes.push("dining");
  if (category.includes("cafe") || category.includes("coffee")) vibes.push("casual");
  if (tags.cuisine?.includes("coffee_shop") || tags.cuisine?.includes("cafe")) vibes.push("work-friendly");

  return vibes.length > 0 ? vibes.join(", ") : "local spot";
}

export function transformOSMPlaceToPlace(osmPlace: OSMPlace): Place {
  const { distance, walkTime } = parseDistance(osmPlace.distance_meters);
  const { isOpenNow, hoursText } = parseOpeningHours(osmPlace.tags.opening_hours);
  const isSoloFriendly = inferSoloFriendly(osmPlace.tags, osmPlace.category);
  const why = generateWhyText(osmPlace.tags, osmPlace.category, isOpenNow);
  const vibe = generateVibe(osmPlace.tags, osmPlace.category, isOpenNow);

  return {
    id: osmPlace.id,
    name: osmPlace.name,
    description: `${osmPlace.name} is a ${osmPlace.osm_type_tag} in the ${osmPlace.category.replace("_", " ")} category. ${why}.`,
    why,
    distance,
    walkTime,
    rating: 4.0, // Default rating since OSM doesn't provide ratings
    reviewCount: 0,
    isOpenNow,
    isSoloFriendly,
    vibe,
    hours: hoursText,
    photoUrl: undefined,
  };
}

export function transformOSMPlacesToPlaces(osmPlaces: OSMPlace[]): Place[] {
  return osmPlaces.map(transformOSMPlaceToPlace);
}