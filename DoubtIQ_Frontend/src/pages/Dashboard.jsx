import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API base
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logging out...");
    setTimeout(() => navigate("/", { replace: true }), 1000);
  };

  // Ask doubt
  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.warning("Please enter your doubt");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${API_BASE}/doubt/ask`,
        { question },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAnswer(data.answer || "No answer received");
      setQuestion("");
      toast.success("Answer received!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to get answer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Doubtiq Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 rounded-lg cursor-pointer hover:bg-red-500 transition"
        >
          Logout
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="w-full max-w-2xl mx-auto flex flex-col h-full px-4">

          {/* Answer Section */}
          <div className="flex-1 overflow-y-auto pb-4 pt-6">
            {answer ? (
              <div className="bg-[#020617] border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-2">AI Answer</h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {answer}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Ask your doubt to get started
              </div>
            )}
          </div>

          {/* Sticky Input Bar */}
          <form
            onSubmit={handleAskDoubt}
            className="sticky bottom-0 bg-[#020617] py-4"
          >
            <div className="relative">
              <textarea
                rows="3"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your doubt here..."
                className="w-full p-4 pr-16 rounded-xl bg-[#020617] border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="absolute top-3 right-3 h-11 w-11 flex items-center justify-center rounded-full cursor-pointer transition disabled:opacity-60"
                title="Send"
              >
                {loading ? (
                  <span className="animate-spin text-indigo-500">⟳</span>
                ) : (
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                )}
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Toast */}
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
