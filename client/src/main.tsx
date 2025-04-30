// Import polyfills first
import "./lib/polyfills";

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./providers/ThemeProvider";

// Import material icons
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(linkElement);

// Import Google fonts
const fontsElement = document.createElement("link");
fontsElement.rel = "stylesheet";
fontsElement.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap";
document.head.appendChild(fontsElement);

// Set page title
document.title = "PeerPass - NFT Business Cards";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
