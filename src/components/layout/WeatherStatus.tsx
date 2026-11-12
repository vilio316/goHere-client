import { useQuery } from "@tanstack/react-query";
import {
  FiCloud,
  FiCloudDrizzle,
  FiCloudLightning,
  FiCloudRain,
  FiCloudSnow,
  FiDroplet,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useLocationCoords } from "../../contexts/LocationContext";
import { fetchWeather } from "../../lib/weather";

function getWeatherIcon(conditionId: number, iconCode: string) {
  if (conditionId >= 200 && conditionId < 300) {
    return FiCloudLightning;
  }

  if (conditionId >= 300 && conditionId < 400) {
    return FiCloudDrizzle;
  }

  if (conditionId >= 500 && conditionId < 600) {
    return FiCloudRain;
  }

  if (conditionId >= 600 && conditionId < 700) {
    return FiCloudSnow;
  }

  if (conditionId >= 700 && conditionId < 800) {
    return FiCloud;
  }

  if (conditionId === 800) {
    return iconCode.endsWith("n") ? FiMoon : FiSun;
  }

  return FiCloud;
}

function formatCondition(condition: string) {
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}

/**
 * Compact current-weather readout for the status bar.
 * Renders nothing until a location and OpenWeatherMap key are available.
 */
export function WeatherStatus() {
  const { location } = useLocationCoords();
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();
  const hasLocation = location.lat !== 0 && location.long !== 0;

  const { data, isPending, isError } = useQuery({
    queryKey: ["weather", location.lat, location.long],
    queryFn: ({ signal }) => {
      if (!apiKey) {
        throw new Error("Missing OpenWeatherMap API key");
      }

      return fetchWeather(location.lat, location.long, apiKey, signal);
    },
    enabled: hasLocation && Boolean(apiKey),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    retry: 1,
  });

  if (!apiKey || !hasLocation) {
    return null;
  }

  if (isPending) {
    return (
      <span
        aria-hidden="true"
        className="h-6 w-20 animate-pulse rounded-pill bg-dusk-800 motion-reduce:animate-none md:w-28"
      />
    );
  }

  if (isError || !data) {
    return null;
  }

  const condition = formatCondition(data.condition);
  const Icon = getWeatherIcon(data.conditionId, data.iconCode);
  const iconTone =
    data.conditionId === 800 ? "text-accent-fill" : "text-nav-muted";
  const label = `Current weather: ${data.temperature} degrees Celsius, ${data.condition}, ${data.rainChance}% chance of rain today.`;

  return (
    <span
      title={`${data.temperature}°C · ${condition} · ${data.rainChance}% chance of rain today`}
      className="inline-flex items-center gap-1 rounded-pill bg-dusk-800 px-1.5 py-0.5 text-text-on-dark md:gap-2 md:px-2.5 md:py-1"
    >
      <span className="sr-only">{label}</span>
      <Icon
        aria-hidden="true"
        className={`shrink-0 text-xs md:text-base ${iconTone}`}
      />
      <span aria-hidden="true" className="contents">
        <span className="whitespace-nowrap font-bold">
          {data.temperature}°<span className="hidden sm:inline">C</span>
        </span>
        <span className="hidden whitespace-nowrap text-nav-muted sm:inline">
          {condition}
        </span>
        <span className="inline-flex items-center gap-0.5 whitespace-nowrap text-nav-muted">
          <FiDroplet aria-hidden="true" className="text-[10px] md:text-xs" />
          {data.rainChance}%
        </span>
      </span>
    </span>
  );
}
