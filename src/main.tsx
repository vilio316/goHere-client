import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { HomeScreen } from "./components/screens/HomeScreen";
import { FeedScreen } from "./components/screens/FeedScreen";
import { DetailScreen } from "./components/screens/DetailScreen";
// import { DirectionsScreen } from "./components/screens/DirectionsScreen";
import { SavedScreen } from "./components/screens/SavedScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { AuthScreen } from "./components/screens/AuthScreen";
import ErrorPage from "./components/ErrorPage";
import { LocationProvider } from "./contexts/LocationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const browserRouter = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthScreen,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    Component: App,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomeScreen },
      { path: "explore", Component: FeedScreen },
      { path: "place/:id", Component: DetailScreen },
      // { path: "directions/:id", Component: DirectionsScreen },
      { path: "saved", Component: SavedScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LocationProvider>
        <RouterProvider router={browserRouter} />
      </LocationProvider>
    </ThemeProvider>
  </QueryClientProvider>,
);

// autoUpdate keeps the installed app current; no update UI is required.
registerSW({ immediate: true });
