import { CardTemplate, ColorScheme } from "@shared/schema";

export const APP_NAME = "PeerPass";
export const APP_SLOGAN = "Your Professional Identity Web3. Vérifiable, Portable, Personnalisable.";

export const CARD_TEMPLATES: { id: CardTemplate; name: string; description: string }[] = [
  { id: "professional", name: "Professional", description: "Classic professional design with blue gradient" },
  { id: "creative", name: "Creative", description: "Modern creative design with teal gradient" },
  { id: "bold", name: "Bold", description: "Stand out with bold amber and red gradient" },
  { id: "modern", name: "Modern", description: "Sleek modern design with purple gradient" },
  { id: "minimal", name: "Minimal", description: "Clean minimal design with gray gradient" },
  { id: "omari", name: "Omari", description: "Luxurious black and gold design for construction" },
];

export const COLOR_SCHEMES: { id: ColorScheme; name: string; colors: string[] }[] = [
  { id: "blue-violet", name: "Blue Violet", colors: ["from-blue-600", "to-violet-600"] },
  { id: "teal-emerald", name: "Teal Emerald", colors: ["from-teal-500", "to-emerald-500"] },
  { id: "amber-red", name: "Amber Red", colors: ["from-amber-500", "to-red-500"] },
  { id: "purple-pink", name: "Purple Pink", colors: ["from-purple-600", "to-pink-500"] },
  { id: "gray-dark", name: "Gray Dark", colors: ["from-gray-700", "to-gray-900"] },
];

export const SOCIAL_PLATFORMS = [
  { id: "website", name: "Website", icon: "language" },
  { id: "linkedin", name: "LinkedIn", icon: "linkedin" },
  { id: "twitter", name: "Twitter", icon: "twitter" },
  { id: "facebook", name: "Facebook", icon: "facebook" },
  { id: "discord", name: "Discord", icon: "discord" },
  { id: "github", name: "GitHub", icon: "code" },
];

export const DEFAULT_AVATAR_URL = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

// Smart contract config
export const CHAIN_CONFIG = {
  testnet: {
    chainId: "0x61", // BSC Testnet
    chainName: "BNB Chain Testnet",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
  mainnet: {
    chainId: "0x38", // BSC Mainnet
    chainName: "BNB Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
};

// Use testnet by default
export const ACTIVE_CHAIN = CHAIN_CONFIG.testnet;
