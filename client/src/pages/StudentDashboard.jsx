import { useEffect, useState } from "react";
import api from "../services/api";

const StudentDashboard = () => {
  const [docs, setDocs] = useState([]);

useEffect(() => {
  const fetchDocs = async () => {
    try {
      const res = await api.get("/docs/my-docs");
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDocs();
}, []);


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold">
          My Documents
        </h2>

        {/* Empty State */}
        {docs.length === 0 && (
          <div className="p-6 text-center bg-white rounded shadow">
            <p className="text-gray-600">
              No documents available yet.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Documents will appear here once uploaded by faculty
              and approved by admin.
            </p>
          </div>
        )}

        {/* Documents List (for future) */}
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between p-5 mb-4 bg-white rounded shadow"
          >
            <div>
              <p className="font-semibold">
                Semester: {doc.semester}
              </p>
              <p
                className={`text-sm ${
                  doc.status === "approved"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {doc.status}
              </p>
            </div>

           <a
  href={`http://localhost:5000${doc.fileUrl}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600"
>
  Download
</a>

          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
