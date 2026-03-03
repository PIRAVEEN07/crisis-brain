import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,229,255,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50"></div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mb-4 border border-[#00E5FF]/20">
              <ShieldAlert className="w-8 h-8 text-[#00E5FF]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider">
              CRISIS<span className="text-[#00E5FF]">BRAIN</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest font-mono">
              Authorized Personnel Only
            </p>
          </div>

          {error && (
            <div className="bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] p-3 rounded-lg mb-6 text-sm text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                Operator ID (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-mono"
                placeholder="operator@crisisbrain.gov"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                Access Key (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-mono"
                placeholder="••••••••"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 rounded-lg px-4 py-3 font-mono uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              {loading ? "Authenticating..." : "Initialize Session"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
