import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
export function StatusBar() {
  function DigitalClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timerId = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(timerId);
    }, []);

    return (
      <span className="text-lg font-bold">{time.toLocaleTimeString()}</span>
    );
  }
  return (
    <div className="h-11 bg-dusk-950 flex items-center justify-between px-4 border-b border-dusk-700 font-data text-xs text-fog-050">
      <DigitalClock />
      <div>
        <FiMenu />
      </div>
    </div>
  );
}
