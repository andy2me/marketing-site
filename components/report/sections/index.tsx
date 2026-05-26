import type { ReactNode } from "react";
import type { Report, SectionId } from "@/lib/report/types";
import { Welcome } from "./Welcome";
import { TheMarket } from "./TheMarket";
import { YourBuyer } from "./YourBuyer";
import { Approach } from "./Approach";
import { Marketing } from "./Marketing";
import { YourTeam } from "./YourTeam";
import { WhyMax } from "./WhyMax";
import { NextSteps } from "./NextSteps";

const SECTION_COMPONENTS: Record<SectionId, (props: { report: Report }) => ReactNode> = {
  welcome: Welcome,
  market: TheMarket,
  buyer: YourBuyer,
  approach: Approach,
  marketing: Marketing,
  team: YourTeam,
  why: WhyMax,
  next: NextSteps,
};

export function SectionView({ id, report }: { id: SectionId; report: Report }) {
  const Component = SECTION_COMPONENTS[id];
  return <Component report={report} />;
}
