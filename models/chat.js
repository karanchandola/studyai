import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: String,
  messages: [messageSchema],
  lastMessage: String,
  createdAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);