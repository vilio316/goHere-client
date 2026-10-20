export interface OSMTags {
  cuisine?: string;
  building?: string;
  opening_hours?: string;
  email?: string;
  website?: string;
  "contact:instagram"?: string;
  mobile?: string;
  [key: string]: string | undefined;
}

export interface OSMPlace {
  id: string;
  osm_type: "W" | "N" | "R";
  osm_id: string;
  name: string;
  category: string;
  osm_class: string;
  osm_type_tag: string;
  tags: OSMTags;
  latitude: number;
  longitude: number;
  distance_meters: string;
}

export interface OSMPlaceResponse {
  places: OSMPlace[];
}
