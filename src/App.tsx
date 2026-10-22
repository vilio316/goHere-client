import { Outlet } from "react-router";
import { BottomNavigation, StatusBar } from "./components/layout";

export default function App() {
  return (
    <div className="min-h-screen relative">
      <StatusBar/>
      <Outlet />
      <BottomNavigation />
    </div>
  );
}