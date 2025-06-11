import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import RecommendationCard from "./RecommendationCard";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Smile, Mic, Send } from "lucide-react";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [userId, setUserId] = useState(null);
  const bottomRef = useRef(null);
  const hasWelcomed = useRef(false);

  useEffect(() => {
    if (!hasWelcomed.current) {
      addMessage("bot", "🤖 Hey! I'm SecureBot.");
      addMessage("bot", "Ready to get a home security recommendation? Type 'yes' to begin or 'no' to exit.");
      hasWelcomed.current = true;
    }

  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let existingId = localStorage.getItem("userId");
    if (!existingId) {
      existingId = uuidv4(); // Random unique ID
      localStorage.setItem("userId", existingId);
    }
    setUserId(existingId);
  }, []);
  const startQuiz = async () => {
    try {
      const res = await axios.post("https://whatsappquiz-backend.onrender.com/start-quiz", {
        user_id: userId,
      });
      setCurrentQuestion(res.data.question);
      renderQuestion(res.data.question);
      setHasStartedQuiz(true);
    } catch (err) {
      addMessage("bot", "❌ Could not start quiz.");
    }
  };

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const renderQuestion = (question) => {
    if (!question) {
      addMessage("bot", "❌ Invalid question received. Please refresh and try again.");
      return;
    }
    if (typeof question === "string") {
      addMessage("bot", question);
      return;
    }


    let message = question.text;
    if (question.type === "choice" && question.options) {
      message += `\nOptions: ${question.options.join(" / ")}`;
    } else if (question.type === "number") {
      message += `\n(Please enter a number)`;
    }
    addMessage("bot", message);
  };

  const validateInput = (answer) => {
    if (!currentQuestion) return true;
    const { type, options } = currentQuestion;
    if (type === "number") {
      return !isNaN(answer);
    } else if (type === "choice" && options) {
      return options.map(o => o.toLowerCase()).includes(answer.toLowerCase());
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return;

    addMessage("user", input);
    setInput("");

    if (!hasStartedQuiz) {
      if (trimmedInput === "yes") {
        startQuiz();
      } else if (trimmedInput === "no") {
        addMessage("bot", "👍 No problem! You can start anytime by typing 'yes'.");
      } else {
        addMessage("bot", "❌ Please type 'yes' to begin or 'no' to exit.");
      }
      return;
    }

    const isValid = validateInput(trimmedInput);
    if (!isValid) {
      addMessage("bot", "❌ Please enter a valid answer as shown in the options.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("https://whatsappquiz-backend.onrender.com/submit-answer", {
        user_id: userId,
        answer: input,
      });

      if (res.data.result === "completed") {
        setRecommendation(res.data.recommendation);
        addMessage("bot", "✅ Quiz complete! Here's your recommendation below ⬇️");
      } else {
        setCurrentQuestion(res.data.question);
        renderQuestion(res.data.question);
      }
    } catch (err) {
      addMessage("bot", "❌ Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md h-[90vh] bg-[#f0f0f0] rounded-xl shadow-lg flex flex-col border border-gray-300">
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center space-x-3 rounded-t-xl">
        <img src="/bot.png" alt="bot" className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-bold">SecureBot AI</div>
          <div className="text-xs text-gray-200">online</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-hero bg-opacity-100">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
        ))}
        {recommendation && <RecommendationCard recommendation={recommendation} />}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-[#f0f0f0] border-t">
        <Smile className="text-gray-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
          placeholder="Type a message"
        />
        {isLoading ? (
          <div className="text-gray-400 px-2">...</div>
        ) : (
          <button type="submit" className="text-green-500 hover:text-green-700">
            <Send />
          </button>
        )}
        <Mic className="text-gray-400" />
      </form>
    </div>
  );
}

export default ChatBox;