import { useEffect, useState } from "react";
import api from "../services/api";

const ApprovalHistoryModal = ({ documentId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId) return;

    setLoading(true);
    setError("");

    api
      .get(`/audit-logs/${documentId}`)
      .then((res) => {
        setLogs(res.data || []);
      })
      .catch((err) => {
        console.error("Audit log error:", err);
        setError("Unable to load approval history");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [documentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-[600px] p-5 rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Approval History</h2>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading approval history...</p>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-red-600">{error}</p>
        )}

        {/* EMPTY */}
        {!loading && !error && logs.length === 0 && (
          <p className="text-gray-500">No approval history found</p>
        )}

        {/* DATA */}
        {!loading && !error && logs.length > 0 && (
          <div className="max-h-[350px] overflow-y-auto space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="p-3 border rounded">
                <p className="font-semibold">{log.action}</p>
                <p className="text-sm">
                  By: {log.performedBy?.name || "Unknown"} ({log.role})
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
                {log.remarks && (
                  <p className="mt-1 text-sm">Remark: {log.remarks}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalHistoryModal;
