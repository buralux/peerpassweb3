// Global polyfills for browser environment
// This adds support for libraries that expect Node.js globals

// Simplified polyfills - Added for basic compatibility
// We're not implementing full Node.js functionality as it's not needed for this app

// @ts-ignore
window.global = window;

// @ts-ignore
window.process = { env: {} };

export {};