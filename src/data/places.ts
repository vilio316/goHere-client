import type { Place } from "../components/layout/PlaceCard";

export const dummyPlaces: Place[] = [
  {
    id: "1",
    name: "Kaffe Nero",
    description:
      "A cozy coffee shop with quiet corner seating, excellent espresso, and reliable WiFi. Perfect for solo travelers needing a break from exploring.",
    why: "Quiet corner seating, good espresso, free WiFi. Perfect for a solo break between stops.",
    distance: "0.3 km",
    walkTime: "4 min",
    rating: 4.6,
    reviewCount: 340,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Well-lit, calm, solo-friendly",
    hours: "Open until 22:00",
  },
  {
    id: "2",
    name: "National Museum",
    description:
      "The city's premier cultural institution housing an impressive collection of artifacts spanning centuries. Climate-controlled galleries make it an ideal escape from the heat.",
    why: "Indoor gallery, 90 mins to explore alone, climate-controlled escape from heat.",
    distance: "0.9 km",
    walkTime: "12 min",
    rating: 4.4,
    reviewCount: 1280,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Cultural, quiet, educational",
    hours: "Open until 18:00",
  },
  {
    id: "3",
    name: "Riverside Park",
    description:
      "A beautifully landscaped park along the river with walking paths, benches with views, and a small café. Well-lit in the evening and popular with locals.",
    why: "Scenic river views, well-lit paths at night, solo-friendly benches.",
    distance: "0.6 km",
    walkTime: "8 min",
    rating: 4.7,
    reviewCount: 890,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Peaceful, scenic, safe at night",
    hours: "Open 24 hours",
  },
  {
    id: "4",
    name: "The Book Nook",
    description:
      "An independent bookstore with a curated selection, reading nooks, and a small coffee bar. Staff are knowledgeable and happy to give recommendations.",
    why: "Quiet reading spots, great curation, coffee bar inside.",
    distance: "0.4 km",
    walkTime: "5 min",
    rating: 4.8,
    reviewCount: 210,
    isOpenNow: false,
    isSoloFriendly: true,
    vibe: "Cozy, intellectual, welcoming",
    hours: "Closed · Opens 09:00",
  },
  {
    id: "5",
    name: "Luna Rooftop Bar",
    description:
      "A stylish rooftop bar with panoramic city views, craft cocktails, and small plates. Has a relaxed atmosphere early evening, gets lively later.",
    why: "Best sunset views in the city, good for solo drinks at the bar.",
    distance: "1.2 km",
    walkTime: "15 min",
    rating: 4.5,
    reviewCount: 560,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Sophisticated, great views, social",
    hours: "Open until 02:00",
  },
  {
    id: "6",
    name: "Old Quarter Walking Tour",
    description:
      "A self-guided walking tour through the historic district with audio narration. Covers 15 points of interest over 2km. Well-marked and safe.",
    why: "Self-paced, well-lit route, rich history, solo-friendly.",
    distance: "0.2 km",
    walkTime: "3 min to start",
    rating: 4.3,
    reviewCount: 420,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Historic, self-guided, immersive",
    hours: "Available anytime",
  },
  {
    id: "7",
    name: "Greenhouse Café",
    description:
      "A plant-filled café with hanging gardens, natural light, and a menu focused on healthy bowls and fresh juices. Very popular for solo work sessions.",
    why: "Abundant plants, natural light, healthy menu, laptop-friendly.",
    distance: "0.7 km",
    walkTime: "9 min",
    rating: 4.6,
    reviewCount: 380,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Bright, green, productive",
    hours: "Open until 20:00",
  },
  {
    id: "8",
    name: "Jazz Cellar",
    description:
      "An intimate underground jazz club with nightly live performances. Small tables and a bar area. Cover charge includes one drink.",
    why: "Intimate setting, world-class jazz, solo-friendly bar seating.",
    distance: "1.0 km",
    walkTime: "13 min",
    rating: 4.9,
    reviewCount: 180,
    isOpenNow: true,
    isSoloFriendly: true,
    vibe: "Intimate, musical, atmospheric",
    hours: "Open until 23:30",
  },
];

export const moods = ["☕ Coffee", "🍽️ Food", "🎨 Culture", "🌳 Nature", "📸 A view", "🎵 Music", "📚 Books", "🍷 Drinks"];

export function getPlaceById(id: string): Place | undefined {
  return dummyPlaces.find((place) => place.id === id);
}