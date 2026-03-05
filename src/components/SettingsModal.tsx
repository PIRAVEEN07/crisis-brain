import React, { useState } from "react";
import { X, Save, RotateCcw, AlertCircle } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateSettings(localSettings);
      onClose();
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings({
      thresholds: {
        severity: 75,
        sosPriority: 50,
        confidence: 80,
      },
      riskRanges: {
        zoneA: 80,
        zoneB: 60,
        zoneC: 40,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold tracking-wider flex items-center gap-2">
            <span className="text-[#00E5FF]">AI</span> ENGINE CONFIG
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Thresholds Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
              System Thresholds
            </h3>
            
            <div className="space-y-4">
              <ThresholdInput
                label="Severity Alert Threshold"
                description="Score above which alerts are triggered"
                value={localSettings.thresholds.severity}
                onChange={(v) => setLocalSettings({
                  ...localSettings,
                  thresholds: { ...localSettings.thresholds, severity: v }
                })}
              />
              <ThresholdInput
                label="SOS Priority Threshold"
                description="Minimum score for high-priority classification"
                value={localSettings.thresholds.sosPriority}
                onChange={(v) => setLocalSettings({
                  ...localSettings,
                  thresholds: { ...localSettings.thresholds, sosPriority: v }
                })}
              />
              <ThresholdInput
                label="Confidence Threshold"
                description="Minimum confidence for strategic execution"
                value={localSettings.thresholds.confidence}
                onChange={(v) => setLocalSettings({
                  ...localSettings,
                  thresholds: { ...localSettings.thresholds, confidence: v }
                })}
              />
            </div>
          </section>

          {/* Risk Ranges Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Risk Level Classification (%)
            </h3>
            
            <div className="space-y-4">
              <ThresholdInput
                label="Zone A (Critical)"
                description="Threshold for critical risk classification"
                value={localSettings.riskRanges.zoneA}
                onChange={(v) => setLocalSettings({
                  ...localSettings,
                  riskRanges: { ...localSettings.riskRanges, zoneA: v }
                })}
                color="text-[#FF3D00]"
              />
              <ThresholdInput
                label="Zone B (High Risk)"
                description="Threshold for high risk classification"
                value={localSettings.riskRanges.zoneB}
                onChange={(v) => setLocalSettings({
                  ...localSettings,
                  riskRanges: { ...localSettings.riskRanges, zoneB: v }
                })}
                color="text-[#FF9100]"
              />
              <ThresholdInput
                label="Zone C (Moderate)"
                description="Threshold for moderate risk classification"
                value={localSettings.riskRanges.zoneC}
                onChange={(v) => setLocalSettings({
                  ...localSettings,
                  riskRanges: { ...localSettings.riskRanges, zoneC: v }
                })}
                color="text-[#FFEA00]"
              />
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            RESET DEFAULTS
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-[#00E5FF] hover:bg-[#00B8CC] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all shadow-lg shadow-[#00E5FF]/20"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              SAVE CONFIG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThresholdInput({ 
  label, 
  description, 
  value, 
  onChange,
  color = "text-white"
}: { 
  label: string; 
  description: string; 
  value: number; 
  onChange: (v: number) => void;
  color?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className={`text-sm font-mono font-bold ${color}`}>{value}%</span>
      </div>
      <p className="text-[10px] text-gray-500 font-mono italic">{description}</p>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
      />
    </div>
  );
}
