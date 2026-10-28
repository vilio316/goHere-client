import type { IconType } from "react-icons";
import {
  FaGlassMartiniAlt,
  FaHeartbeat,
  FaShoppingBag,
  FaSpa,
  FaTree,
  FaUtensils,
} from "react-icons/fa";

export interface MoodOption {
  label: string;
  description: string;
  icon: IconType;
}

/**
 * Single source of truth for the moods used by Home, Explore, and the
 * mood chips. Keep the labels stable because they are sent to the API
 * as the `q` search param.
 */
export const moods: MoodOption[] = [
  {
    label: "Food & Drinks",
    description: "Cafés, restaurants, and a good bite.",
    icon: FaUtensils,
  },
  {
    label: "Parks/Gardens",
    description: "Green escapes and quiet corners.",
    icon: FaTree,
  },
  {
    label: "Healthcare & Wellness",
    description: "Pharmacies, clinics, and essentials.",
    icon: FaHeartbeat,
  },
  {
    label: "Spas & Relaxation",
    description: "Massage, sauna, or a slow afternoon.",
    icon: FaSpa,
  },
  {
    label: "Shopping",
    description: "Local shops and markets worth a browse.",
    icon: FaShoppingBag,
  },
  {
    label: "Nightlife",
    description: "Bars, music, and late-night energy.",
    icon: FaGlassMartiniAlt,
  },
];

export const moodLabels = moods.map((mood) => mood.label);
