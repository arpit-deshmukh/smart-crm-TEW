import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children, navigate }) => {
  
  const addMessageToState = (message) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  // --- NAVIGATION OPERATIONS ---

  const handleLeads = () => {
    const message = createChatBotMessage("Navigating to the Leads Module. Here you can manage your prospects.");
    addMessageToState(message);
    if (navigate) navigate("/user/leads");
  };

  const handleDeals = () => {
    const message = createChatBotMessage("Opening your Revenue and Deals dashboard.");
    addMessageToState(message);
    if (navigate) navigate("/user/deals");
  };

  const handleContacts = () => {
    const message = createChatBotMessage("Navigating to your Contacts list.");
    addMessageToState(message);
    if (navigate) navigate("/user/contacts");
  };

  const handleCompanies = () => {
    const message = createChatBotMessage("Opening the Companies directory.");
    addMessageToState(message);
    if (navigate) navigate("/user/companies");
  };

  const handleFollowups = () => {
    const message = createChatBotMessage("Opening your Follow-ups and Reminders calendar.");
    addMessageToState(message);
    if (navigate) navigate("/user/followups");
  };

  const handleLogout = () => {
    const message = createChatBotMessage("Logging you out. Clearing session...");
    addMessageToState(message);
    setTimeout(() => {
      localStorage.clear();
      if (navigate) navigate("/login");
    }, 1500);
  };

  // --- INFORMATION HANDLERS ---

  const handleGreeting = () => {
    const message = createChatBotMessage("Hello! I'm SmartCRM AI. I can navigate the project for you. Where should we go?");
    addMessageToState(message);
  };

  const handleUnknown = () => {
    const message = createChatBotMessage(
      "I'm not quite sure about that. Try using the quick options below:",
      { widget: "mainOptions" }
    );
    addMessageToState(message);
  };

  const handleManualAction = (text) => {
    const message = createChatBotMessage(text);
    addMessageToState(message);
  };

  // --- EXPORTING ACTIONS ---
  // Ensure every key here matches the 'action' string in your config.jsx widgets
  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      actions: {
        handleGreeting,
        handleLeads,
        handleDeals,
        handleContacts,
        handleCompanies,
        handleFollowups,
        handleLogout,
        handleUnknown,
        handleManualAction
      },
    });
  });
};

export default ActionProvider;