import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { Bot, MessageCircle, X } from "lucide-react";

import config from "../../chatbot/config.jsx";
import MessageParser from "../../chatbot/MessageParser";
import ActionProvider from "../../chatbot/ActionProvider";

// Custom CSS to override the default library styles
const botStyles = `
  .react-chatbot-kit-chat-container {
    width: 350px;
    border-radius: 24px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }
  .react-chatbot-kit-chat-header {
    background: linear-gradient(to right, #059669, #10b981);
    color: white;
    padding: 1rem;
    font-weight: 800;
    font-family: inherit;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .react-chatbot-kit-chat-input-container {
    padding: 12px;
    background: #f8fafc;
  }
  .react-chatbot-kit-chat-input {
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 10px 15px;
  }
  .react-chatbot-kit-chat-btn-send {
    background-color: #10b981;
    border-radius: 12px;
  }
  .react-chatbot-kit-user-chat-message {
    background-color: #10b981;
    border-radius: 15px 15px 0 15px;
  }
`;

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Inject custom styles */}
      <style>{botStyles}</style>

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative">
            {/* Close Button on top of bot */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-emerald-100 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <Chatbot
              config={config}
              messageParser={MessageParser}
              // CRITICAL: Pass navigate to ActionProvider here
              actionProvider={(props) => (
                <ActionProvider {...props} navigate={navigate} />
              )}
            />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen 
          ? "bg-slate-800 text-white" 
          : "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white"
        }`}
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <div className="relative">
                <Bot size={28} />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                </span>
            </div>
            {/* <span className="font-bold pr-1 text-sm md:text-base">AI</span> */}
          </>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;