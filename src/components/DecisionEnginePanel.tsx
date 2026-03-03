import React from "react";
import { BrainCircuit, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DecisionEnginePanel() {
  const severityScore = 88;
  const confidenceScore = 92;
  const isCritical = severityScore > 75;

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 h-full flex flex-col relative overflow-hidden">
      {isCritical && (
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF3D00] animate-pulse"></div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" />
          AI Strategic Engine
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border ${isCritical ? "bg-[#FF3D00]/10 border-[#FF3D00]/30" : "bg-white/5 border-white/10"} flex flex-col items-center justify-center text-center`}
        >
          <div className="text-xs font-mono text-gray-400 uppercase mb-2">
            Severity Score
          </div>
          <div
            className={`text-4xl font-bold ${isCritical ? "text-[#FF3D00]" : "text-white"}`}
          >
            {severityScore}
          </div>
          <div className="text-xs text-gray-500 mt-1">/ 100</div>
        </div>

        <div className="p-4 rounded-lg border bg-white/5 border-white/10 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-mono text-gray-400 uppercase mb-2">
            Confidence
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-gray-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00E5FF]"
                strokeWidth="3"
                strokeDasharray={`${confidenceScore}, 100`}
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-sm font-bold">{confidenceScore}%</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-mono text-gray-400 uppercase mb-3">
          Zone Risk Ranking
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-[#FF3D00]/10 border border-[#FF3D00]/20 rounded">
            <span className="text-sm font-medium text-[#FF3D00]">
              1. Zone A (Hurricane)
            </span>
            <span className="text-xs font-mono">CRITICAL</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-orange-500/10 border border-orange-500/20 rounded">
            <span className="text-sm font-medium text-orange-400">
              2. Zone B (Seismic)
            </span>
            <span className="text-xs font-mono">HIGH</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <span className="text-sm font-medium text-yellow-400">
              3. Zone C (Flood)
            </span>
            <span className="text-xs font-mono">MODERATE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="text-xs font-mono text-gray-400 uppercase mb-3">
          Structured Action Plan
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-[#FF3D00] shrink-0 mt-0.5" />
              <span className="text-gray-300">
                Deploy International Rescue Team Alpha to Zone A immediately. Wind speeds
                exceeding 250km/h.
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="text-gray-300">
                Reroute incoming medical supplies from regional hubs to Zone B due to
                damaged infrastructure.
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-gray-300">
                Initiate mass evacuation broadcast for Zone C low-lying coastal areas.
              </span>
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">
              AI Reasoning
            </div>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "High concentration of SOS signals (892) correlates with severe
              weather satellite data in Zone A. Hospital capacity in adjacent regions
              is reaching critical limits (12% remaining), necessitating
              immediate international triage and rerouting."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
