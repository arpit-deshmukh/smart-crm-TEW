import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

const botName = "SmartCRM AI";

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}, your CRM controller.`),
    createChatBotMessage(
      "I can navigate the app for you. What do you need?",
      { widget: "mainOptions" }
    ),
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#0f172a" },
    chatButton: { backgroundColor: "#10b981" },
  },
  widgets: [
    {
      widgetName: "mainOptions",
      widgetFunc: (props) => (
        <div className="flex flex-wrap gap-2 p-2">
          {[
             { label: "👤 Leads", action: "handleLeads" },
            { label: "💰 Deals", action: "handleDeals" },
            { label: "📞 Contacts", action: "handleContacts" },
            { label: "🏢 Companies", action: "handleCompanies" },
            { label: "📅 Follow-ups", action: "handleFollowups" },
            { label: "🚪 Logout", action: "handleLogout" },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => props.actions[btn.action]()}
              className="px-3 py-2 bg-white border-2 border-emerald-500 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-50 shadow-sm"
            >
              {btn.label}
            </button>
          ))}
        </div>
      ),
    },
  ],
};

export default config;