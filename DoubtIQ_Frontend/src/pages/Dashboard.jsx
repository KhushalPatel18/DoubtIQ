import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  LogOut,
  MessageSquare,
  Plus,
  Send,
  Menu,
  X,
  Bot,
  User,
  Pencil,
  Trash2,
  Check,
  Paperclip,
  FileText
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const Typewriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const lines = text.split("\n");
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  useEffect(() => {
    if (currentLineIdx < lines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, lines[currentLineIdx]]);
        setCurrentLineIdx((prev) => prev + 1);
      }, 100); // Adjust speed here (ms per line)
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentLineIdx, lines, onComplete]);

  return (
    <div className="space-y-1">
      {displayedLines.map((line, i) => (
        <div key={i} className="animate-slide-up">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {line}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
};


// API base
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Stats
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Rename/Delete states
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Fetch chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const loadChat = async (chatId) => {
    // Don't load if we are editing this chat item
    if (editingChatId === chatId) return;

    try {
      setLoading(true);
      setActiveChatId(chatId);
      setSidebarOpen(false); // Close sidebar on mobile

      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(data.messages);
    } catch (err) {
      toast.error("Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    setSelectedFile(null);
    setSidebarOpen(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const currentInput = input;
    const currentFile = selectedFile;

    setInput("");
    setSelectedFile(null);

    // Optimistic UI update
    let previewImage = null;
    if (currentFile && currentFile.type.startsWith("image/")) {
      previewImage = URL.createObjectURL(currentFile);
    }

    const tempMessages = [...messages, {
      role: "user",
      content: currentInput || `Attached: ${currentFile?.name}`,
      image: previewImage,
      timestamp: new Date()
    }];
    setMessages(tempMessages);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      let data;

      const formData = new FormData();
      if (currentInput.trim()) formData.append("message", currentInput);
      if (currentFile) formData.append("file", currentFile);

      if (activeChatId) {
        // Send to existing chat
        const res = await axios.post(
          `${API_BASE}/chat/${activeChatId}/message`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        data = res.data;
      } else {
        // Create new chat
        const res = await axios.post(
          `${API_BASE}/chat/new`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        data = res.data;
        setActiveChatId(data._id);
        fetchChatHistory(); // Refresh sidebar to show new chat
      }

      setMessages(data.messages.map((m, i) =>
        i === data.messages.length - 1 && m.role === 'ai'
          ? { ...m, shouldAnimate: true }
          : m
      ));
    } catch (err) {
      toast.error("Failed to send message");
      // Revert optimistic update on failure (optional, but good UX)
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // --- Chat Management ---

  const startEditing = (e, chat) => {
    e.stopPropagation(); // Prevent loading chat
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
  };

  const saveRename = async (e, chatId) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/chat/${chatId}/rename`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setChats(chats.map(c => c._id === chatId ? { ...c, title: editTitle } : c));
      toast.success("Chat renamed");
    } catch (err) {
      toast.error("Failed to rename chat");
    } finally {
      setEditingChatId(null);
    }
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI
      setChats(chats.filter((c) => c._id !== chatId));
      if (activeChatId === chatId) {
        startNewChat();
      }
      toast.success("Chat deleted");
    } catch (err) {
      toast.error("Failed to delete chat");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#0B1120] border-r border-gray-800 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold text-lg">DoubtIQ</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => loadChat(chat._id)}
                className={`group w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer ${activeChatId === chat._id
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                  }`}
              >
                <MessageSquare size={18} className="flex-shrink-0" />

                {editingChatId === chat._id ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-gray-900 text-white text-xs px-1 py-1 rounded border border-indigo-500 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(e, chat._id);
                      }}
                    />
                    <button
                      onClick={(e) => saveRename(e, chat._id)}
                      className="text-green-400 hover:text-green-300 p-1"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="truncate text-sm flex-1">{chat.title}</span>
                )}

                {/* Action Buttons (visible on hover) */}
                {editingChatId !== chat._id && (
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => startEditing(e, chat)}
                      className="p-1 text-gray-500 hover:text-indigo-400 transition-colors"
                      title="Rename"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => deleteChat(e, chat._id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {chats.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                No history yet
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full p-2 rounded-lg hover:bg-gray-800/50"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 text-center lg:text-left lg:ml-4">
            <h1 className="font-semibold text-white">
              {activeChatId ? (chats.find(c => c._id === activeChatId)?.title || "Chat") : "New Conversation"}
            </h1>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-50">
              <Bot size={48} />
              <p className="text-lg">Ask anything to start a new chat...</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 overflow-x-auto ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-100 rounded-bl-none prose prose-invert max-w-none'
                    }`}
                >
                  {msg.image && (
                    <div className="mb-3">
                      <img src={msg.image} alt="User upload" className="max-h-64 object-contain rounded-lg border border-white/10" />
                    </div>
                  )}
                  {msg.fileAttachment && !msg.image && (
                    <div className="mb-3 flex items-center gap-2 bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 w-fit max-w-full">
                      <FileText size={18} className="text-indigo-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{msg.fileAttachment}</span>
                    </div>
                  )}
                  {msg.role === 'user' ? (
                    msg.content && msg.content !== "Analyze this file" && (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base">
                        {msg.content}
                      </p>
                    )
                  ) : (
                    <div className="text-sm lg:text-base">
                      {msg.shouldAnimate ? (
                        <Typewriter
                          text={msg.content}
                          onComplete={() => {
                            // Optionally remove flag once done to prevent re-animation on re-renders if needed
                            setMessages(prev => prev.map((m, i) => i === idx ? { ...m, shouldAnimate: false } : m));
                          }}
                        />
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-gray-800 rounded-2xl px-6 py-4 rounded-bl-none min-w-[120px] animate-thinking border border-white/5 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs font-medium text-indigo-300/80 tracking-wide uppercase">Assistant is thinking</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative flex items-end gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700 focus-within:border-indigo-500 transition-colors"
          >
            {/* File Preview Popup */}
            {selectedFile && (
              <div className="absolute bottom-[calc(100%+0.5rem)] left-0 p-2 bg-gray-800 border border-gray-700 rounded-xl flex items-center gap-3 shadow-lg max-w-sm animate-fade-in-up">
                {selectedFile.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="preview" className="h-12 w-12 object-cover rounded-md" />
                ) : (
                  <div className="h-12 w-12 bg-gray-700 flex items-center justify-center rounded-md text-indigo-400">
                    <FileText size={24} />
                  </div>
                )}
                <div className="flex flex-col overflow-hidden text-sm">
                  <span className="font-medium text-gray-200 truncate">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 hover:bg-gray-700 hover:text-red-400 rounded-lg ml-auto transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-700/50 mb-1"
            >
              <Paperclip size={20} />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message or attach a file..."
              className="w-full bg-transparent border-none focus:ring-0 text-white resize-none max-h-32 min-h-[44px] py-3 px-2"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedFile)}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg transition-colors mb-1"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">AI can make mistakes. Consider checking important information.</p>
          </div>
        </div>

      </main>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default Dashboard;
