import { useEffect, useState } from "react";
import api from "../services/api";
import ApprovalHistoryModal from "../components/ApprovalHistoryModal";


const AdminDashboard = () => {
  const [showHistory, setShowHistory] = useState(false);
const [selectedDocId, setSelectedDocId] = useState(null);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [rejectedDocs, setRejectedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
const [semesterFilter, setSemesterFilter] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [approvedCount, setApprovedCount] = useState(0);



  useEffect(() => {
    fetchDocs();
  }, []);

const fetchDocs = async () => {
  try {
    const pending = await api.get("/docs/pending");
    const rejected = await api.get("/docs/rejected");
    const approved = await api.get("/docs/approved");

    setPendingDocs(pending.data);
    setRejectedDocs(rejected.data);
    setApprovedCount(approved.data.length);
  } catch (err) {
    console.error("Failed to fetch documents", err);
  }

};


  const approveDoc = async (id) => {
    try {
      await api.put(`/docs/approve/${id}`);
      alert("Document approved");
      fetchDocs();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectDoc = async (id) => {
    try {
      await api.put(`/docs/reject/${id}`);
      alert("Document rejected");
      fetchDocs();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this rejected document?")) return;

    try {
      await api.delete(`/docs/delete/${id}`);
      alert("Document deleted");
      fetchDocs();
    } catch (err) {
      alert("Delete failed");
    }
  };

    const applyFilters = (docs) => {
    return docs.filter((doc) => {
      const matchSearch =
        doc.studentId.toLowerCase().includes(search.toLowerCase());

      const matchSemester =
        semesterFilter === "" ||
        doc.semester.toString() === semesterFilter;

      const matchStatus =
        statusFilter === "" || doc.status === statusFilter;

      return matchSearch && matchSemester && matchStatus;
    });
  };


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">

        {/* ===== SUMMARY CARDS ===== */}
<div className="grid gap-6 mb-8 md:grid-cols-3">
  {/* Pending */}
  <div className="p-6 bg-orange-100 border border-orange-300 rounded shadow">
    <p className="text-sm font-medium text-orange-700">
      Pending Documents
    </p>
    <p className="mt-2 text-3xl font-bold text-orange-800">
      {pendingDocs.length}
    </p>
  </div>

  {/* Approved */}
  <div className="p-6 bg-green-100 border border-green-300 rounded shadow">
    <p className="text-sm font-medium text-green-700">
      Approved Documents
    </p>
    <p className="mt-2 text-3xl font-bold text-green-800">
      {approvedCount}
    </p>
  </div>

  {/* Rejected */}
  <div className="p-6 bg-red-100 border border-red-300 rounded shadow">
    <p className="text-sm font-medium text-red-700">
      Rejected Documents
    </p>
    <p className="mt-2 text-3xl font-bold text-red-800">
      {rejectedDocs.length}
    </p>
  </div>
  {showHistory && (
  <ApprovalHistoryModal
    documentId={selectedDocId}
    onClose={() => setShowHistory(false)}
  />
)}

</div>


<div className="p-4 mb-6 bg-white rounded shadow">
  <div className="grid gap-4 md:grid-cols-3">

    {/* Search by Student Email */}
    <input
      type="text"
      placeholder="Search by student email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="p-2 border rounded"
    />

    {/* Filter by Semester */}
    <input
      type="text"
      placeholder="Filter by semester"
      value={semesterFilter}
      onChange={(e) => setSemesterFilter(e.target.value)}
      className="p-2 border rounded"
    />

    {/* Filter by Status */}
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">All Status</option>
      <option value="pending">Pending</option>
      <option value="rejected">Rejected</option>
    </select>

  </div>
</div>


        {/* ================= PENDING ================= */}
        <h2 className="mb-4 text-2xl font-bold">Pending Documents</h2>

        {pendingDocs.length === 0 && (
          <div className="p-5 mb-8 text-center bg-white rounded shadow">
            No pending documents
          </div>
        )}

{applyFilters(pendingDocs).map((doc) => (

          <div
            key={doc._id}
            className="flex justify-between p-5 mb-4 bg-white rounded shadow"
          >
            <div>
              <p><b>Student:</b> {doc.studentId}</p>
              <p>Semester: {doc.semester}</p>
              <a
                href={`http://localhost:5000${doc.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            </div>

            <div className="flex flex-col gap-2">
  <button
    onClick={() => approveDoc(doc._id)}
    className="px-4 py-2 text-white bg-blue-600 rounded"
  >
    Approve
  </button>

  <button
    onClick={() => rejectDoc(doc._id)}
    className="px-4 py-2 text-white bg-yellow-500 rounded"
  >
    Reject
  </button>

  <button
    onClick={() => {
      setSelectedDocId(doc._id);
      setShowHistory(true);
    }}
    className="px-4 py-2 text-white bg-indigo-600 rounded"
  >
    Approval History
  </button>
</div>

          </div>
        ))}

        {/* ================= REJECTED ================= */}
        <h2 className="mt-10 mb-4 text-2xl font-bold text-red-600">
          Rejected Documents
        </h2>

        {rejectedDocs.length === 0 && (
          <div className="p-5 text-center bg-white rounded shadow">
            No rejected documents
          </div>
        )}

{applyFilters(rejectedDocs).map((doc) => (

          <div
            key={doc._id}
            className="flex justify-between p-5 mb-4 bg-white rounded shadow"
          >
            <div>
              <p><b>Student:</b> {doc.studentId}</p>
              <p>Semester: {doc.semester}</p>
              <a
                href={`http://localhost:5000${doc.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            </div>

            <div className="flex flex-col gap-2">
  <button
    onClick={() => deleteDoc(doc._id)}
    className="px-4 py-2 text-white bg-red-600 rounded"
  >
    Delete
  </button>

  <button
    onClick={() => {
      setSelectedDocId(doc._id);
      setShowHistory(true);
    }}
    className="px-4 py-2 text-white bg-indigo-600 rounded"
  >
    Approval History
  </button>
</div>

          </div>
        ))}

      </div>
    </div>
    
  );
};

export default AdminDashboard;
