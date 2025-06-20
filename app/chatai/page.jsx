"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Plus, MessageSquare, Pencil, Menu, X, Trash2, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { set } from "mongoose";

const initialChats = [
  {
    id: 1,
    topic: "Math Help",
    lastMessage: "Can you explain quadratic equations?",
    messages: [
      {
        role: "assistant",
        content: "Hello! How can I help you with math today?",
      },
      {
        role: "user",
        content: "Can you explain quadratic equations?",
      },
      {
        role: "assistant",
        content: "A quadratic equation is a polynomial equation of degree 2. It's written in the form ax² + bx + c = 0, where a ≠ 0...",
      },
    ],
  },
  {
    id: 2,
    topic: "History Discussion",
    lastMessage: "Tell me about World War II",
    messages: [
      {
        role: "assistant",
        content: "Hello! Ready to explore history together!",
      },
      {
        role: "user",
        content: "Tell me about World War II",
      },
      {
        role: "assistant",
        content: "World War II was a global conflict that lasted from 1939 to 1945...",
      },
    ],
  },
];

  const welcomeSteps = [
    {
      message: "Hi there! 👋 I'm EduBot, your AI study assistant. I'm here to help you learn and understand any subject better.",
      options: ["Nice to meet you!", "Skip intro"],
    },
    {
      message: "What would you like to learn about today? You can ask me anything - from math and science to history and literature!",
      input: true,
    },
  ];

function generateChatTopic(message) {
  const topics = {
    math: ["equation", "calculus", "algebra", "geometry", "mathematics", "theorem"],
    physics: ["force", "energy", "motion", "quantum", "physics", "gravity"],
    chemistry: ["molecule", "reaction", "chemical", "atom", "compound"],
    biology: ["cell", "organism", "evolution", "genetics", "biology"],
    history: ["war", "century", "civilization", "empire", "historical"],
    literature: ["book", "author", "novel", "poetry", "write"],
    programming: ["code", "programming", "javascript", "python", "algorithm"],
  };

  const lowercaseMessage = message.toLowerCase();
  for (const [category, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Discussion`;
    }
  }

  const words = message.split(' ').slice(0, 3).join(' ');
  return words.length > 25 ? `${words.substring(0, 25)}...` : words;
}

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [editingChat, setEditingChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateChatName, setshowUpdateChatName] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [initialQuestion, setInitialQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch chats from backend on mount
    axios.get("/api/db/chats").then(res => {
      setChats(res.data.chats || []);
        
      if (res.data.chats?.length) setCurrentChat(res.data.chats[0]);
    });
  }, []);

  // ... handleWelcomeNext stays the same, but save to DB
  const handleWelcomeNext = async (skipIntro = false) => {
    if (skipIntro) {
      setShowWelcome(false);
      return;
    }
    if (welcomeStep < welcomeSteps.length - 1) {
      setWelcomeStep(prev => prev + 1);
    } else {
      if (initialQuestion.trim()) {
        const topic = generateChatTopic(initialQuestion);
        // Save new chat to DB
        const res = await axios.post("/api/db/chats", {
          chatId: null,
          topic,
          message: { role: "user", content: initialQuestion }
        });
        const newChat = res.data.chat;
        setChats([...chats, newChat]);
        setCurrentChat(newChat);
        setShowWelcome(false);
      }
    }
  };

  // Create new chat in DB
  const createNewChat = async () => {
    const res = await axios.post("/api/db/chats", {
      chatId: null,
      topic: "New Chat",
      message: { role: "assistant", content: "Hello! I'm your AI study assistant. How can I help you today?" }
    });
    const newChat = res.data.chat;
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    setIsSidebarOpen(false);
  };

  // Rename chat in DB
  const updateChatName = async (chatId, newName) => {
    setIsLoading(true);
    console.log("Updating chat name:", chatId, newName);
    try {
      await axios.put("/api/db/chats", { chatId, topic: newName });

    } catch (error) {
      console.error("Error updating chat name:", error);
      setIsLoading(false);
      return;
    } finally{
      setIsLoading(false);
    }
    setChats(chats.map(chat =>
      chat._id === chatId ? { ...chat, topic: newName } : chat
    ));
    if (currentChat?._id === chatId) {
      setCurrentChat({ ...currentChat, topic: newName });
    }
    setshowUpdateChatName(false);
    setEditingChat(null);
    setNewChatName("");
  };

  // Delete chat in DB
  const deleteChat = async () => {
    if (!chatToDelete) return;
    await axios.delete(`/api/db/chats?chatId=${chatToDelete._id}`);
    const updatedChats = chats.filter(chat => chat._id !== chatToDelete._id);
    setChats(updatedChats);
    if (currentChat?._id === chatToDelete._id) {
      setCurrentChat(updatedChats[0] || null);
    }
    setChatToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteClick = (chat, e) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setShowDeleteDialog(true);
  };

  // Send message and save to DB
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim() || !currentChat) return;

  try {
    setIsLoading(true);
    // Save user message to DB and get updated chat
    const res = await axios.post("/api/db/chats", {
      chatId: currentChat._id,
      topic: currentChat.topic,
      message: { role: "user", content: input }
    });
    let updatedChat = res.data.chat;

    // Get AI response
    const aiRes = await axios.post('/api/ai/chats', { input });
    const aiMessage = {
      role: "assistant",
      content: aiRes.data.data || "Sorry, I couldn't get a response.",
    };

    // Save AI message to DB and get updated chat
    const res2 = await axios.post("/api/db/chats", {
      chatId: currentChat._id,
      topic: currentChat.topic,
      message: aiMessage
    });
    updatedChat = res2.data.chat;

    setCurrentChat(updatedChat);
    setChats(chats.map(chat => chat._id === updatedChat._id ? updatedChat : chat));
    setInput("");
  } catch (error) {
    console.error("Error sending message or saving chat:", error);
    // Optionally show a toast or error message to the user here
  } finally{
    setIsLoading(false);
  }
};

  const selectChat = (chat) => {
    setCurrentChat(chat);
    setIsSidebarOpen(false);
  };

  if (!mounted) {
    return null;
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-orange-50/35 dark:bg-orange-950/10 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 opacity-10">
            <div className="w-full h-full rounded-full bg-orange-500 animate-pulse" />
          </div>

          <div className="relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48">
                <img
                  src="https://cdn3d.iconscout.com/3d/premium/thumb/robot-assistant-5665772-4721838.png"
                  alt="EduBot"
                  className="w-full h-full object-contain animate-bounce-slow"
                />
              </div>
            </div>

            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                {welcomeSteps[welcomeStep].message}
              </h2>

              {welcomeSteps[welcomeStep].input ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Type your question here..."
                    value={initialQuestion}
                    onChange={(e) => setInitialQuestion(e.target.value)}
                    className="text-lg p-6"
                  />
                  <Button 
                    onClick={() => handleWelcomeNext()}
                    className="w-full text-lg"
                    disabled={!initialQuestion.trim()}
                  >
                    Let's Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => handleWelcomeNext()}
                    className="text-lg"
                  >
                    {welcomeSteps[welcomeStep].options[0]}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleWelcomeNext(true)}
                    className="text-lg"
                  >
                    {welcomeSteps[welcomeStep].options[1]}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-orange-50/35 dark:bg-orange-950/10 scroll-smooth">
      <div className="relative container max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-11 left-5 z-50 lg:hidden ${isSidebarOpen ? 'left-[17.5rem] top-5 transition-all' : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Chat</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{chatToDelete?.topic}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteChat}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          <Card 
            className={`fixed inset-y-0 left-0 w-80 lg:w-auto lg:relative lg:col-span-3 h-full z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} backdrop-blur-xl bg-background/80 border-r lg:backdrop-blur-none lg:bg-background`}
          >
            <div className="h-full flex flex-col pt-16 lg:pt-0">
              <div className="p-4 border-b backdrop-blur-sm bg-background/50">
                <Button onClick={createNewChat} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {chats.map((chat) => (
                    <div key={chat._id} className="flex items-center justify-between gap-2 group">
                      <Button
                        variant={currentChat?.id === chat._id ? "secondary" : "ghost"}
                        className="w-40 justify-start group hover:bg-secondary/80"
                        onClick={() => selectChat(chat)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2 group-hover:text-primary" />
                        <div className="truncate text-left">
                          <div className="font-medium">{chat.topic}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage || "New conversation"}
                          </div>
                        </div>
                      </Button>
                      <div className="flex gap-1 transition-opacity">
                        <Dialog open={showUpdateChatName} onOpenChange={setshowUpdateChatName}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingChat(chat);
                                setNewChatName(chat.topic);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rename Chat</DialogTitle>
                            </DialogHeader>
                            <div className="flex gap-2">
                              <Input
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                placeholder="Enter chat name"
                              />
                              <Button onClick={() => updateChatName(chat._id, newChatName)}>
                                {isLoading? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'save'
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={(e) => handleDeleteClick(chat, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>

          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {currentChat ? (
            <Card className="col-span-12 lg:col-span-9 h-full relative overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 border-b bg-muted/50 backdrop-blur-sm max-lg:px-11">
                  <h1 className="text-lg font-semibold">{currentChat.topic}</h1>
                  <p className="text-sm text-muted-foreground">Ask questions about any topic</p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentChat.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                            message.role === "user"
                              ? "bg-primary/90 text-primary-foreground"
                              : "bg-muted/80"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        </div>
                    ))}
                        {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="rounded-lg px-4 py-2 bg-muted/80">
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="p-4 border-t backdrop-blur-sm bg-background/50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="hover:scale-105 transition-transform">
                     {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="col-span-12 lg:col-span-9 h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold mb-2">No Chat Selected</h2>
                <p className="text-muted-foreground mb-4">Select a chat from the sidebar or create a new one</p>
                <Button onClick={createNewChat}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}