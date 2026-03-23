import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Hide the static LCP placeholder once React has mounted
requestAnimationFrame(() => {
  const placeholder = document.getElementById("lcp-header-placeholder");
  if (placeholder) placeholder.style.display = "none";
});

// Register SW after page is idle — keeps it off the critical path
if ("serviceWorker" in navigator) {
  const registerSW = () => {
    import("virtual:pwa-register").then(({ registerSW }) => {
      registerSW({ immediate: false });
    });
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(registerSW, { timeout: 4000 });
  } else {
    window.addEventListener("load", () => setTimeout(registerSW, 2000), { once: true });
  }
}
