import React from "react";

function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 text-sm rounded-xl shadow-sm whitespace-pre-wrap leading-relaxed ${
          isUser ? "bg-[#dcf8c6] text-black rounded-br-none" : "bg-white text-black rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default MessageBubble;