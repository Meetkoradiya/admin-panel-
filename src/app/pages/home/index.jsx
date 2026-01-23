import { Page } from "@/components/shared/Page";
import { Overview } from "./Overview";
import { Statistics } from "./Statistics";
import { RealTimeAnalytics } from "./RealTimeAnalytics";
import { FormPerformanceOverview } from "./FormPerformaceOverview";
import StatisticsChart from "./StatisticsChart";

export default function CRMAnalytics() {
  return (
    <Page title="Dashboard">
      <div className="pb-6">
        <div className="px-(--margin-x)">
          <RealTimeAnalytics />
        </div>
        
        <div className="mt-3 px-(--margin-x)">
          <StatisticsChart />
        </div>

        <div className="mt-3 grid grid-cols-12 gap-3 px-(--margin-x)">
          <Overview />
          <Statistics />
        </div>

        <div className="mt-3 px-(--margin-x)">
          <FormPerformanceOverview />
        </div>
      </div>
    </Page>
  );
}