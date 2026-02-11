import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loginTime: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
});

export default mongoose.models.LoginHistory || mongoose.model("LoginHistory", loginHistorySchema);
