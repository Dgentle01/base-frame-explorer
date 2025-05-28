
// Update the Zora and Neynar API key initialization
let ZORA_API_KEY = "";
let NEYNAR_API_KEY = "";

// Initialize API keys from localStorage
try {
  ZORA_API_KEY = localStorage.getItem("VITE_ZORA_API_KEY") || "";
  NEYNAR_API_KEY = localStorage.getItem("VITE_NEYNAR_API_KEY") || "";
} catch (error) {
  console.error("Error accessing localStorage for API keys:", error);
}

export { ZORA_API_KEY, NEYNAR_API_KEY };
