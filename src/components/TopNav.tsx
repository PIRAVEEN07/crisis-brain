import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ShieldAlert, LogOut, Activity } from "lucide-react";

export default function TopNav() {
  const { currentUser } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00E5FF]/10 rounded-lg flex items-center justify-center border border-[#00E5FF]/20">
          <ShieldAlert className="w-6 h-6 text-[#00E5FF]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider">
            CRISIS<span className="text-[#00E5FF]">BRAIN</span>
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
          <Activity className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono text-gray-300">
            Global Threat Level:{" "}
            <span className="text-yellow-400">ELEVATED</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{currentUser?.email}</div>
            <div className="text-xs font-mono text-gray-500 uppercase">
              Command Operator
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Terminate Session"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
