import { Calendar } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import HeroBanner from './common/HeroBanner';
import TimelineStepper from './routine/TimelineStepper';
import BeforeAfterSlider from './routine/BeforeAfterSlider';
import MoistureSandwich from './routine/MoistureSandwich';
import RoutineChecklist from './routine/RoutineChecklist';
import FaqList from './routine/FaqList';

export default function RoutineGuide({ selectedWeekIndex, setSelectedWeekIndex }) {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <HeroBanner icon={Calendar} badge="Clinical 8–12 Week Dermatological Roadmap" title="Pigmentation Timeline & Care Guide">
        Real skin cellular turnover takes 28 to 45 days. Set realistic expectations for skin tone evening and odor defense, master the winter "Moisture Sandwich" technique, and prevent irritation flare-ups.
      </HeroBanner>

      <TimelineStepper
        selectedWeekIndex={selectedWeekIndex}
        onSelect={(idx) => {
          soundManager.playClick();
          setSelectedWeekIndex(idx);
        }}
      />
      <BeforeAfterSlider />
      <MoistureSandwich />
      <RoutineChecklist />
      <FaqList />
    </div>
  );
}
