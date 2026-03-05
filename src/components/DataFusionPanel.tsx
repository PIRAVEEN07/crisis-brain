import React from "react";
import {
  CloudLightning,
  Radio,
  Users,
  PhoneCall,
  ActivitySquare,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export default function DataFusionPanel() {
  const { settings } = useSettings();
  
  // Mock logic: if filtered distress posts percentage is above threshold
  const filteredDistress = 892;
  const totalDistress = 4281;
  const sosPriorityScore = (filteredDistress / totalDistress) * 100;
  const isSOSPriorityHigh = sosPriorityScore > settings.thresholds.sosPriority;

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-[#00E5FF]">
          Data Fusion Overview
        </h2>
        <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <MetricCard
          icon={<CloudLightning className="w-5 h-5 text-blue-400" />}
          title="Weather Feed"
          value="Severe Cyclone Warning"
          subValue="Wind: 120km/h | Rain: 45mm/hr"
          raw="Raw: 1,204 readings"
        />
        <MetricCard
          icon={<Radio className="w-5 h-5 text-purple-400" />}
          title="Distress Posts (Social)"
          value={totalDistress.toLocaleString()}
          subValue={`Filtered: ${filteredDistress} high-priority`}
          raw={`Raw: 12,405 posts/hr | Priority: ${sosPriorityScore.toFixed(1)}%`}
          alert={isSOSPriorityHigh}
        />
        <MetricCard
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          title="Field Reports"
          value="156 Active"
          subValue="Verified: 142"
          raw="Raw: 302 submissions"
        />
        <MetricCard
          icon={<PhoneCall className="w-5 h-5 text-[#FF3D00]" />}
          title="Emergency Calls"
          value="89/min"
          subValue="Wait time: 2.4m"
          raw="Raw: 5,340 calls today"
          alert
        />
        <MetricCard
          icon={<ActivitySquare className="w-5 h-5 text-yellow-400" />}
          title="Hospital Availability"
          value="12% Capacity"
          subValue="Critical beds: 4 available"
          raw="Raw: 42 facilities reporting"
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  subValue,
  raw,
  alert = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subValue: string;
  raw: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${alert ? "bg-[#FF3D00]/10 border-[#FF3D00]/30" : "bg-white/5 border-white/10"} hover:bg-white/10 transition-colors group`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="text-xs font-mono text-gray-400 uppercase mb-1">
            {title}
          </div>
          <div
            className={`text-lg font-semibold ${alert ? "text-[#FF3D00]" : "text-white"}`}
          >
            {value}
          </div>
          <div className="text-sm text-gray-400 mt-1">{subValue}</div>
          <div className="text-xs font-mono text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {raw}
          </div>
        </div>
      </div>
    </div>
  );
}
