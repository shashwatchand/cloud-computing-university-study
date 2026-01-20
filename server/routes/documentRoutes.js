const AuditLog = require("../models/AuditLog");

router.put(
  "/approve/:id",
  verifyToken,
  verifyRole("faculty"),
  async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      document.status = "approved";
      document.approvedBy = req.user.id;
      document.approvedAt = new Date();
      await document.save();

      // 🔹 AUDIT LOG ENTRY
      await AuditLog.create({
        action: "APPROVED",
        documentId: document._id,
        performedBy: req.user.id,
        role: req.user.role,
        remarks: "Document approved",
        ipAddress: req.ip,
      });

      res.json({ message: "Document approved successfully" });
    } catch (err) {
      res.status(500).json({ message: "Approval failed" });
    }
  }
);
