import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authform");
  };

  // Ask Doubt
  const handleAskDoubt = async (e) => {
    e.preventDefault();
    setError("");
    setAnswer("");

    if (!question.trim()) {
      setError("Please enter your doubt");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/doubt/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setAnswer(data.answer || "No answer received");
    } catch (err) {
      setError(err.message);
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

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

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
    </div>
  );
};

export default Dashboard;
