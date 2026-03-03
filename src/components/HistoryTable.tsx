import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { Database } from "lucide-react";

interface DisasterRecord {
  id: string;
  type: string;
  severity: number;
  population: number;
  zone: string;
  timestamp: any;
  confidence: number;
}

export default function HistoryTable() {
  const [records, setRecords] = useState<DisasterRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // In a real app, this would fetch from Firestore.
        // For the preview/demo, we'll provide mock data if the collection is empty or fails.
        const q = query(
          collection(db, "disasterDecisions"),
          orderBy("timestamp", "desc"),
          limit(10),
        );
        const querySnapshot = await getDocs(q);

        const fetchedRecords: DisasterRecord[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRecords.push({ id: doc.id, ...doc.data() } as DisasterRecord);
        });

        if (fetchedRecords.length > 0) {
          setRecords(fetchedRecords);
        } else {
          // Fallback mock data
          setRecords([
            {
              id: "1",
              type: "Hurricane Category 5",
              severity: 88,
              population: 2500000,
              zone: "Zone A",
              timestamp: new Date(),
              confidence: 92,
            },
            {
              id: "2",
              type: "Major Earthquake (7.2)",
              severity: 72,
              population: 8210000,
              zone: "Zone B",
              timestamp: new Date(Date.now() - 86400000),
              confidence: 85,
            },
            {
              id: "3",
              type: "Severe Flooding",
              severity: 95,
              population: 15095000,
              zone: "Zone C",
              timestamp: new Date(Date.now() - 172800000),
              confidence: 98,
            },
            {
              id: "4",
              type: "Wildfire Outbreak",
              severity: 45,
              population: 320000,
              zone: "All Zones",
              timestamp: new Date(Date.now() - 259200000),
              confidence: 75,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        // Fallback mock data on error
        setRecords([
          {
            id: "1",
            type: "Hurricane Category 5",
            severity: 88,
            population: 2500000,
            zone: "Zone A",
            timestamp: new Date(),
            confidence: 92,
          },
          {
            id: "2",
            type: "Major Earthquake (7.2)",
            severity: 72,
            population: 8210000,
            zone: "Zone B",
            timestamp: new Date(Date.now() - 86400000),
            confidence: 85,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-[#00E5FF]" />
        <h2 className="text-sm font-mono uppercase tracking-widest text-white">
          Historical Decision Logs
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Timestamp</th>
              <th className="pb-3">Disaster Type</th>
              <th className="pb-3">Zone</th>
              <th className="pb-3">Severity</th>
              <th className="pb-3">Affected Pop.</th>
              <th className="pb-3">AI Confidence</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-500 font-mono text-xs"
                >
                  Querying database...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-500 font-mono text-xs"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const date = record.timestamp?.toDate
                  ? record.timestamp.toDate()
                  : new Date(record.timestamp);
                const isCritical = record.severity > 75;

                return (
                  <tr
                    key={record.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-3 pl-2 text-gray-400 font-mono text-xs">
                      {format(date, "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="py-3 font-medium text-gray-200">
                      {record.type}
                    </td>
                    <td className="py-3 text-gray-300">{record.zone}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono border ${isCritical ? "bg-[#FF3D00]/10 border-[#FF3D00]/30 text-[#FF3D00]" : "bg-white/5 border-white/10 text-gray-300"}`}
                      >
                        {record.severity}/100
                      </span>
                    </td>
                    <td className="py-3 text-gray-300 font-mono text-xs">
                      {record.population.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00E5FF]"
                            style={{ width: `${record.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono text-gray-400">
                          {record.confidence}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
