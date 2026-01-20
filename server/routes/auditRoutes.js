const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const { verifyToken } = require("../middleware/authMiddleware");

// GET approval history for a document (Admin + Faculty)
router.get(
  "/audit-logs/:documentId",
  verifyToken,
  async (req, res) => {
    try {
      // 🔐 Allow only admin or faculty
      if (req.user.role !== "admin" && req.user.role !== "faculty") {
        return res.status(403).json({ message: "Access denied" });
      }

      const logs = await AuditLog.find({
        documentId: req.params.documentId,
      })
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 });

      res.json(logs);
    } catch (err) {
      console.error("Audit log error:", err);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  }
);

module.exports = router;
