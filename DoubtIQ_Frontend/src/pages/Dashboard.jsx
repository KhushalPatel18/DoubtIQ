import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Get API base from env variable; fallback to localhost for dev
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
    setTimeout(() => navigate("/"), 1000);
  };

  // Ask Doubt
  const handleAskDoubt = async (e) => {
    e.preventDefault();
    setAnswer("");

    if (!question.trim()) {
      toast.warning("Please enter your doubt");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${API_BASE}/doubt/ask`,
        { question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(data.answer || "No answer received");
      toast.success("Answer received!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to get answer";
      toast.error(errorMsg);
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
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
        >
          Logout
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-6">

          {/* Ask Doubt */}
          <form onSubmit={handleAskDoubt} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">
              Ask Your Doubt
            </h2>

            <textarea
              rows="5"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your doubt here..."
              className="w-full p-4 rounded-lg bg-[#020617] border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition disabled:opacity-60"
            >
              {loading ? "Thinking..." : "Ask Doubt"}
            </button>
          </form>

          {/* Answer */}
          {answer && (
            <div className="bg-[#020617] border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">AI Answer</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {answer}
              </p>
            </div>
          )}

        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Dashboard;
