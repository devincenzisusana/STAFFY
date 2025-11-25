import { WelcomeSection, QuickStartGuide } from "./components";
import "./Overview.css";

export const Overview = () => {
  return (
    <div className="overview-page">
      <WelcomeSection />
      <QuickStartGuide />
    </div>
  );
};
