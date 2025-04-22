
// Update the Zora API key initialization
let ZORA_API_KEY = "";

// Initialize API key from localStorage
try {
  ZORA_API_KEY = localStorage.getItem("VITE_ZORA_API_KEY") || "";
} catch (error) {
  console.error("Error accessing localStorage for Zora API key:", error);
}
