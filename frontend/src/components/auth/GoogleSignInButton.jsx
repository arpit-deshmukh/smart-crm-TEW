import { useEffect, useRef } from "react";
import { googleAuth } from "../../services/authService";

const GoogleSignInButton = ({ onSuccess, onError, text = "continue_with" }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById("google-gsi-script")) {
        initializeGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-gsi-script";
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    };

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const data = await googleAuth(response.credential);
            onSuccess?.(data);
          } catch (err) {
            onError?.(
              err?.response?.data?.message || "Google sign-in failed"
            );
          }
        },
      });

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text,
        width: 320,
      });
    };

    loadGoogleScript();
  }, [onSuccess, onError, text]);

  return <div ref={buttonRef}></div>;
};

export default GoogleSignInButton;