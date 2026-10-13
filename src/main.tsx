import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import { HomeScreen } from "./components/screens/HomeScreen";
import { FeedScreen } from "./components/screens/FeedScreen";
import { DetailScreen } from "./components/screens/DetailScreen";
import { DirectionsScreen } from "./components/screens/DirectionsScreen";
import { SavedScreen } from "./components/screens/SavedScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import ErrorPage from "./components/ErrorPage";
import { LocationProvider } from "./contexts/LocationContext";
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
    path: "/",
    Component: App,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomeScreen },
      { path: "explore", Component: FeedScreen },
      { path: "place/:id", Component: DetailScreen },
      { path: "directions/:id", Component: DirectionsScreen },
      { path: "saved", Component: SavedScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <RouterProvider router={browserRouter} />,
    </LocationProvider>
    ,
  </QueryClientProvider>,
);
