import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorPage from "./components/ErrorPage.tsx";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={browserRouter} />,
);
