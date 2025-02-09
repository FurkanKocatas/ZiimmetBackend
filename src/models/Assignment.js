const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Burayı ekledik!
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "returned"], default: "active" },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = Assignment;
