import { useEffect, useState } from "react";
import api from "../services/api";
import ApprovalHistoryModal from "../components/ApprovalHistoryModal";

const FacultyDashboard = () => {
  const [file, setFile] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [myDocs, setMyDocs] = useState([]);

  // 🔹 Approval History State
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  /* ================= FETCH FACULTY DOCS ================= */
  useEffect(() => {
    fetchMyDocs();
  }, []);

  const fetchMyDocs = async () => {
    try {
      const res = await api.get("/docs/faculty-docs");
      setMyDocs(res.data);
    } catch (err) {
      console.error("Failed to fetch faculty documents", err);
    }
  };

  /* ================= UPLOAD ================= */
  const uploadHandler = async () => {
    if (!file || !studentId || !semester) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentId", studentId);
      formData.append("semester", semester);

      await api.post("/docs/upload", formData);

      alert("Document uploaded successfully");

      setFile(null);
      setStudentId("");
      setSemester("");

      fetchMyDocs();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE (REJECTED ONLY) ================= */
  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this rejected document?")) return;

    try {
      await api.delete(`/docs/delete/${id}`);
      alert("Document deleted");
      fetchMyDocs();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* ================= UPLOAD FORM ================= */}
      <div className="max-w-xl p-8 mx-auto bg-white rounded shadow">
        <h2 className="mb-2 text-2xl font-bold">Upload Marksheet</h2>

        <p className="mb-6 text-gray-500">
          Upload academic documents for students. Documents require admin
          approval before students can view them.
        </p>

        <input
          type="text"
          placeholder="Student ID or Email"
          className="w-full p-3 mb-4 border rounded"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Semester (e.g. 1, 2, 3)"
          className="w-full p-3 mb-4 border rounded"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <input
          type="file"
          className="w-full p-3 mb-6 border rounded"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={uploadHandler}
          disabled={loading}
          className="w-full py-3 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      {/* ================= MY UPLOADED DOCUMENTS ================= */}
      <div className="max-w-4xl mx-auto mt-10">
        <h3 className="mb-4 text-xl font-bold">My Uploaded Documents</h3>

        {myDocs.length === 0 && (
          <div className="p-4 text-center bg-white rounded shadow">
            No documents uploaded yet.
          </div>
        )}

        {myDocs.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between p-5 mb-4 bg-white rounded shadow"
          >
            <div>
              <p className="font-semibold">
                Student: {doc.studentId}
              </p>

              <p className="text-sm">
                Semester: {doc.semester}
              </p>

              <p
                className={`text-sm font-medium ${
                  doc.status === "approved"
                    ? "text-green-600"
                    : doc.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {doc.status}
              </p>

              <a
                href={`http://localhost:5000${doc.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                View Document
              </a>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedDocId(doc._id);
                  setShowHistory(true);
                }}
                className="px-4 py-2 text-white bg-indigo-600 rounded"
              >
                Approval History
              </button>

              {doc.status === "rejected" && (
                <button
                  onClick={() => deleteDoc(doc._id)}
                  className="px-4 py-2 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= APPROVAL HISTORY MODAL ================= */}
      {showHistory && (
        <ApprovalHistoryModal
          documentId={selectedDocId}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;
