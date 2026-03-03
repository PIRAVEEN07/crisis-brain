import React from "react";
import TopNav from "../components/TopNav";
import DataFusionPanel from "../components/DataFusionPanel";
import MapComponent from "../components/MapComponent";
import DecisionEnginePanel from "../components/DecisionEnginePanel";
import HistoryTable from "../components/HistoryTable";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col">
      <TopNav />

      <main className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[600px]">
          {/* Left Panel */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <DataFusionPanel />
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md relative shadow-lg">
            <MapComponent />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <DecisionEnginePanel />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4">
          <HistoryTable />
        </div>
      </main>
    </div>
  );
}
