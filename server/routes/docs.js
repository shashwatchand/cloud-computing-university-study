const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const Document = require("../models/Document");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

/* ================= FILE STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= FACULTY UPLOAD ================= */
router.post(
  "/upload",
  verifyToken,
  verifyRole("faculty"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const { studentId, semester } = req.body;

      if (!studentId || !semester) {
        return res
          .status(400)
          .json({ message: "Student ID and semester are required" });
      }

      const fileBuffer = fs.readFileSync(
        path.join("uploads", req.file.filename)
      );

      const hash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      const doc = new Document({
        studentId,
        semester,
        uploadedBy: req.user._id,
        fileUrl: `/uploads/${req.file.filename}`,
        hash,
        status: "pending",
      });

      await doc.save();

      res.status(201).json({
        message: "Document uploaded successfully and pending approval",
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ================= STUDENT VIEW (APPROVED ONLY) ================= */
router.get(
  "/my-docs",
  verifyToken,
  verifyRole("student"),
  async (req, res) => {
    const docs = await Document.find({
      studentId: req.user.email,
      status: "approved",
    });
    res.json(docs);
  }
);

/* ================= ADMIN VIEWS ================= */
router.get(
  "/pending",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    const docs = await Document.find({ status: "pending" });
    res.json(docs);
  }
);

router.get(
  "/approved",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    const docs = await Document.find({ status: "approved" });
    res.json(docs);
  }
);

router.get(
  "/rejected",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    const docs = await Document.find({ status: "rejected" });
    res.json(docs);
  }
);

/* ================= ADMIN ACTIONS ================= */

/* APPROVE DOCUMENT */
router.put(
  "/approve/:id",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (document.status === "approved") {
        return res
          .status(400)
          .json({ message: "Document already approved" });
      }

      document.status = "approved";
      document.approvedBy = req.user.id;
      document.approvedAt = new Date();

      await document.save();

      await AuditLog.create({
        action: "APPROVED",
        documentId: document._id,
        performedBy: req.user.id,
        role: req.user.role,
        remarks: "Document approved by admin",
      });

      res.json({ message: "Document approved successfully" });
    } catch (err) {
      console.error("Approve error:", err);
      res.status(500).json({ message: "Approval failed" });
    }
  }
);

/* REJECT DOCUMENT */
router.put(
  "/reject/:id",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      document.status = "rejected";
      await document.save();

      await AuditLog.create({
        action: "REJECTED",
        documentId: document._id,
        performedBy: req.user.id,
        role: req.user.role,
        remarks: "Document rejected by admin",
      });

      res.json({ message: "Document rejected successfully" });
    } catch (err) {
      console.error("Reject error:", err);
      res.status(500).json({ message: "Rejection failed" });
    }
  }
);

/* DELETE DOCUMENT */
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      await AuditLog.create({
        action: "DELETED",
        documentId: document._id,
        performedBy: req.user.id,
        role: req.user.role,
        remarks: "Document deleted by admin",
      });

      await Document.findByIdAndDelete(req.params.id);

      res.json({ message: "Document deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ message: "Delete failed" });
    }
  }
);

/* ================= FACULTY VIEW THEIR UPLOADS ================= */
router.get(
  "/faculty-docs",
  verifyToken,
  verifyRole("faculty"),
  async (req, res) => {
    const docs = await Document.find({
      uploadedBy: req.user._id,
    });
    res.json(docs);
  }
);

/* ================= PUBLIC VERIFY ================= */
router.get("/verify/:hash", async (req, res) => {
  const doc = await Document.findOne({ hash: req.params.hash });

  if (!doc) {
    return res.status(404).json({ message: "Invalid document" });
  }

  res.json({
    studentId: doc.studentId,
    semester: doc.semester,
    status: doc.status,
    verified: true,
  });
});

module.exports = router;
