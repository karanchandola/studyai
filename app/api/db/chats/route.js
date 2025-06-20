import { Chat } from "@/models/chat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connection from "@/lib/dbconnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connection();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId, topic, message } = await req.json();

    let chat;
    if (chatId) {
      // Update existing chat
      chat = await Chat.findById(chatId);
      if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      chat.messages.push(message);
      chat.lastMessage = message.content;
      await chat.save();
    } else {
      // Create new chat
      chat = await Chat.create({
        userId: session.user.id,
        topic,
        messages: [message],
        lastMessage: message.content
      });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("POST /api/db/chats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connection();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const chats = await Chat.find({ userId: session.user.id }).sort({ createdAt: -1 });
    console.log("Fetching chat : ", chats);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("GET /api/db/chats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connection();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // For query param version:
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    // For body version (uncomment if you use body instead):
    // const { chatId } = await req.json();

    const chat = await Chat.findById(chatId);
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await chat.remove();
    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/db/chats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connection();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId, topic } = await req.json();

    console.log("Updating chat with ID:", chatId, "to topic:", topic);
    const chat = await Chat.findById(chatId);
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    chat.topic = topic;
    await chat.save();

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("PUT /api/db/chats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}