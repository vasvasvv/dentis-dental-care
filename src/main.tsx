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
