import React from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lower = message.toLowerCase();

    // 1. GREETINGS & HELP
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return actions.handleGreeting();
    }

    if (lower.includes("help") || lower.includes("options") || lower.includes("menu")) {
      return actions.handleUnknown(); // This triggers the main options widget
    }

    // 2. REVENUE, FINANCIALS & REPORTS
    if (
      lower.includes("revenue") || 
      lower.includes("money") || 
      lower.includes("report") || 
      lower.includes("chart") ||
      lower.includes("deal")
    ) {
      return actions.handleDeals();
    }

    // 3. LEAD MANAGEMENT
    if (lower.includes("lead") || lower.includes("prospect") || lower.includes("customer")) {
      // Check for specific sub-actions first
      if (lower.includes("add") || lower.includes("create") || lower.includes("new")) {
        return actions.handleManualAction("I'm taking you to the Leads page. Look for the 'Add New Lead' button at the top right to start.");
      }
      return actions.handleLeads();
    }

    // 4. ADMIN, USERS & SECURITY
    if (lower.includes("admin") || lower.includes("security") || lower.includes("user") || lower.includes("request")) {
      return actions.handleAdmin();
    }

    // 5. FOLLOWUPS & CALENDAR
    if (lower.includes("follow") || lower.includes("schedule") || lower.includes("meeting") || lower.includes("remind")) {
      return actions.handleFollowups();
    }

    // 6. SESSION CONTROL (NEW)
    if (lower.includes("logout") || lower.includes("sign out") || lower.includes("exit")) {
      return actions.handleLogout();
    }

    // 7. PROFILE
    if (lower.includes("profile") || lower.includes("account") || lower.includes("my info")) {
      return actions.handleManualAction("Redirecting you to your profile settings...");
      // If you have a profile route, you could add actions.handleProfile() in ActionProvider
    }

    // FALLBACK
    return actions.handleUnknown();
  };

  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      parse: parse,
      actions,
    });
  });
};

export default MessageParser;