import { useNavigate } from "react-router";
import { HeroCTA, MoodChips, SearchField, StatusBar } from "../layout";
import { moods } from "../../data/places";

export function HomeScreen() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/explore");
  };

  const handleMoodSelect = (mood: string) => {
    navigate(`/explore?q=${mood}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="flex flex-col max-w-xl mx-auto w-full">
          <HeroCTA onClick={handleExplore} />
          <MoodChips moods={moods} onMoodSelect={handleMoodSelect} />
          <div className="flex-1" />
          <SearchField placeholder="Search or explore…" />
        </div>
      </div>
    </div>
  );
}
