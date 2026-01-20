const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const auditRoutes = require("./routes/auditRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", require("./routes/Auth"));

// DOCUMENT ROUTES
app.use("/api/docs", require("./routes/docs"));

// ✅ AUDIT ROUTES (FIXED)
app.use("/api", auditRoutes);

// FILE UPLOADS
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
