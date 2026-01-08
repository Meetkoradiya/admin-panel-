// Local Imports
import { Page } from "@/components/shared/Page";
import { Overview } from "./Overview";
import { Statistics } from "./Statistics";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import { FormPerformanceOverview } from "./FormPerformaceOverview";

export default function CRMAnalytics() {
  return (
    <Page title="Dashboard">
      <div className="overflow-hidden pb-8">
        <div className="transition-content px-(--margin-x)">
          <RealTimeAnalytics />
        </div>
        <div className="transition-content mt-4 grid grid-cols-12 gap-2 px-(--margin-x) sm:mt-5 sm:gap-3 lg:mt-5 lg:gap-4">
          <Overview />
          <Statistics />
        </div>
        <div className="transition-content mt-4 px-(--margin-x)">
          <FormPerformanceOverview />
        </div>
      </div>
    </Page>
  );
}
