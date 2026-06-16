// Matt Powe — first registered agent profile.
// Body copy, stats, headshot URL and reel posters ported verbatim from the prototype
// at design_handoff_team_member/team-member.jsx (MATT, TESTIMONIALS, REELS).
// TODO: replace Unsplash URLs with real Matt photography + Mux/YouTube reel posters
// once captured (golden-hour, warm-toned per brand).

import type { Agent } from "@/lib/agents/types";

export const matt: Agent = {
  id: "matt-powe",
  slug: "matt-powe",
  name: "Matt Powe",
  role: "Sales Agent · Noosaville & Tewantin",
  agency: "Max. Property",
  phone: "0412 884 207",
  phoneHref: "tel:+61412884207",
  email: "matt@maxproperty.au",
  headshot:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop&crop=faces",
  patches: ["Noosaville", "Tewantin", "Doonan", "Noosa Heads", "Cooroibah"],
  patchLine: "Noosaville & Tewantin",
  positioning:
    "The agent vendors call when the result matters more than the noise. Nine years, one patch, and a buyer list most agencies would envy.",
  bioHeading: "Born on the river. Still selling on it.",
  bioLead:
    "Matt grew up three streets back from Gympie Terrace and has watched Noosaville turn from a quiet fishing village into one of the most sought-after pockets on the eastern seaboard. That history isn't a marketing line — it's a <strong>working knowledge of every street, every body corporate, and most of the families</strong> who've lived here for a generation.",
  bioMore: [
    "He left a decade in commercial brokerage to come home in 2017, and built his residential practice the slow way: one honest appraisal at a time. He doesn't list everything — he lists what he can sell well, and he tells vendors the truth about price before they sign, not after.",
    "The result is a campaign that feels calm from the outside and relentless underneath. A buyer list four years in the making. Photography booked for golden hour, never midday. And a vendor who hears from Matt every Friday, whether there's news or not. <strong>Most of his business now comes from past clients and their neighbours</strong> — which is exactly how he likes it.",
  ],
  stats: [
    { label: "Properties sold", value: "142" },
    { label: "Avg days on market", value: "21" },
    { label: "Sale vs. asking", value: "101", suffix: "%" },
    { label: "Years local", value: "9" },
  ],
  featuredVideo: {
    thumbnail:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&auto=format&fit=crop",
    title: "Meet Matt — why I only sell Noosaville",
    kicker: "Featured · 2:40",
  },
  reels: [
    {
      id: "inside-24-hilltop",
      thumbnail:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80&auto=format&fit=crop",
      label: "Inside 24 Hilltop Cres",
      duration: "0:48",
    },
    {
      id: "morning-in-noosaville",
      thumbnail:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop",
      label: "A morning in Noosaville",
      duration: "1:12",
    },
    {
      id: "how-i-price-a-home",
      thumbnail:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80&auto=format&fit=crop",
      label: "How I price a home",
      duration: "0:36",
    },
    {
      id: "auction-day-tewantin",
      thumbnail:
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&q=80&auto=format&fit=crop",
      label: "Auction day · Tewantin",
      duration: "0:54",
    },
  ],
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
};
