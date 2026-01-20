import { useState } from "react";
import api from "../services/api";

const VerifyDocument = () => {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const verifyHandler = async () => {
    if (!hash) {
      setError("Please enter a document hash");
      return;
    }

    try {
      setError("");
      const res = await api.get(`/docs/verify/${hash}`);
      setResult(res.data);
    } catch (err) {
      setResult(null);
      setError("❌ Invalid or unverified document");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl p-8 mx-auto bg-white rounded shadow">
        <h2 className="mb-2 text-2xl font-bold text-center">
          Verify Academic Document
        </h2>

        <p className="mb-6 text-sm text-center text-gray-500">
          Enter the document hash to verify authenticity
        </p>

        <input
          type="text"
          placeholder="Enter document hash"
          className="w-full p-3 mb-4 border rounded"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />

        <button
          onClick={verifyHandler}
          className="w-full py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Verify Document
        </button>

        {/* ERROR */}
        {error && (
          <div className="p-4 mt-6 text-center text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {result && (
  <div
    className={`p-6 mt-6 rounded border ${
      result.status === "approved"
        ? "bg-green-50 border-green-400"
        : result.status === "pending"
        ? "bg-orange-50 border-orange-400"
        : "bg-red-50 border-red-400"
    }`}
  >
    <h3
      className={`mb-4 text-lg font-bold ${
        result.status === "approved"
          ? "text-green-700"
          : result.status === "pending"
          ? "text-orange-700"
          : "text-red-700"
      }`}
    >
      {result.status === "approved" && "✅ Document Approved & Verified"}
      {result.status === "pending" && "⏳ Document Pending Approval"}
      {result.status === "rejected" && "❌ Document Rejected"}
    </h3>


            <p>
              <b>Student ID:</b> {result.studentId}
            </p>

            <p>
              <b>Semester:</b> {result.semester}
            </p>

            <p>
  <b>Status:</b>{" "}
  <span
    className={`font-semibold ${
      result.status === "approved"
        ? "text-green-600"
        : result.status === "pending"
        ? "text-orange-600"
        : "text-red-600"
    }`}
  >
    {result.status}
  </span>
</p>


            <p className="mt-3 text-sm text-gray-600">
              This document is authentic and stored securely in the
              Academic Cloud Locker.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDocument;
