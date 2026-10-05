import { Outlet } from "react-router";
import { BottomNavigation } from "./components/layout";

export default function App() {
  return (
    <div className="min-h-screen relative">
      <Outlet />
      <BottomNavigation />
    </div>
  );
}