const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true }, // Zimmetlenen eşyanın adı
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Kime zimmetlendi
    assignedDate: { type: Date, default: Date.now }, // Zimmet tarihi
    returnDate: { type: Date }, // Geri dönüş tarihi (Opsiyonel)
    status: { type: String, enum: ["active", "returned"], default: "active" } // Durumu
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = Assignment;
