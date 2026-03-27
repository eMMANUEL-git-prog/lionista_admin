"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { api } from "@/lib/api";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.getInquiries();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.updateInquiryStatus(id.toString(), "read"); // ✅ FIX
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)),
      );
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.deleteInquiry(id.toString()); // ✅ FIX
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread message${
                  unreadCount > 1 ? "s" : ""
                }`
              : "All messages read"}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === "unread") {
                        handleMarkAsRead(message.id);
                      }
                    }}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedMessage?.id === message.id ? "bg-muted/50" : ""
                    } ${message.status === "unread" ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          message.status === "unread"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.status === "unread" ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailOpen className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`font-medium truncate ${
                              message.status === "unread"
                                ? ""
                                : "text-muted-foreground"
                            }`}
                          >
                            {message.name}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {message.subject}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No messages yet
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-card border border-border rounded-xl">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {selectedMessage.subject}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          From: {selectedMessage.name} ({selectedMessage.email})
                        </p>
                        {selectedMessage.phone && (
                          <p className="text-muted-foreground">
                            Phone: {selectedMessage.phone}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(
                            selectedMessage.created_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <p className="whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground p-8">
                  Select a message to view
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
