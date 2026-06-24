import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App.tsx";
import "./index.css";

export const createApp = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) {
    // Register SW after page is idle to keep it off the critical path
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
  }
});

export const createRoot = createApp;
