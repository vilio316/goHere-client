const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

interface OpenWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface OpenWeatherCurrentResponse {
  dt: number;
  name: string;
  timezone: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: OpenWeatherCondition[];
}

interface OpenWeatherForecastItem {
  dt: number;
  pop?: number;
  main: {
    temp: number;
  };
  weather: OpenWeatherCondition[];
}

interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
  city: {
    name: string;
    timezone: number;
  };
}

export interface WeatherSnapshot {
  /** Current temperature in Celsius. */
  temperature: number;
  /** Human-readable condition, e.g. "light rain". */
  condition: string;
  /** OpenWeatherMap condition id, used to pick an icon. */
  conditionId: number;
  /** OpenWeatherMap icon code, e.g. "10d" or "01n". */
  iconCode: string;
  /** Highest chance of precipitation for the location's current day, 0–100. */
  rainChance: number;
  /** Location name returned by OpenWeatherMap. */
  city: string;
  /** Time the snapshot was fetched. */
  updatedAt: number;
}

function localDateKey(unixSeconds: number, offsetSeconds: number) {
  // Shift UTC into the location's local wall time, then take the date part.
  return new Date((unixSeconds + offsetSeconds) * 1000)
    .toISOString()
    .slice(0, 10);
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  apiKey: string,
  signal?: AbortSignal,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    appid: apiKey,
    units: "metric",
  });

  const [current, forecast] = await Promise.all([
    requestJson<OpenWeatherCurrentResponse>(
      `${OPEN_WEATHER_BASE_URL}/weather?${params.toString()}`,
      signal,
    ),
    requestJson<OpenWeatherForecastResponse>(
      `${OPEN_WEATHER_BASE_URL}/forecast?${params.toString()}`,
      signal,
    ),
  ]);

  const condition = current.weather[0];

  if (!condition) {
    throw new Error("Weather response did not include a condition");
  }

  const timezone = forecast.city?.timezone ?? current.timezone;
  const todayKey = localDateKey(current.dt, timezone);
  const todayForecast = forecast.list.filter(
    (item) => localDateKey(item.dt, timezone) === todayKey,
  );
  // If the forecast has rolled past midnight, fall back to the next 24 hours.
  const rainWindow =
    todayForecast.length > 0 ? todayForecast : forecast.list.slice(0, 8);
  const rainChance = Math.round(
    Math.max(0, ...rainWindow.map((item) => item.pop ?? 0)) * 100,
  );

  return {
    temperature: Math.round(current.main.temp),
    condition: condition.description,
    conditionId: condition.id,
    iconCode: condition.icon,
    rainChance,
    city: current.name || forecast.city?.name || "",
    updatedAt: Date.now(),
  };
}
