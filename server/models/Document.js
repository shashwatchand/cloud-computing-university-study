const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
      unique: true,
    },

 status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
