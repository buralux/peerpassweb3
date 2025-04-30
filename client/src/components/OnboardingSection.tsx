import React from "react";
import { Button } from "@/components/ui/button";

interface OnboardingSectionProps {
  onConnect: () => void;
  onLearnMore: () => void;
}

const OnboardingSection: React.FC<OnboardingSectionProps> = ({ onConnect, onLearnMore }) => {
  return (
    <div className="my-6 p-6 bg-white dark:bg-darkSurface rounded-xl card-shadow text-center">
      <h2 className="font-heading font-bold text-2xl mb-3 text-gray-800 dark:text-white">
        Welcome to PeerPass
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Your professional identity on Web3. Create, customize, and share your business cards as NFTs.
      </p>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <Button 
          onClick={onConnect}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg"
        >
          <span className="material-icons">add_circle</span>
          <span>Connect Wallet</span>
        </Button>
        
        <Button 
          onClick={onLearnMore}
          variant="outline"
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg"
        >
          <span className="material-icons">info</span>
          <span>Learn More</span>
        </Button>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="rounded-lg w-full overflow-hidden">
          <svg 
            className="w-full h-auto" 
            viewBox="0 0 800 500" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="800" height="500" fill="#f0f4f8" />
            <g transform="translate(400, 250)">
              <g>
                <path d="M-100,-50 L100,-50 L100,50 L-100,50 Z" fill="#3949AB" />
                <path d="M-90,-40 L90,-40 L90,40 L-90,40 Z" fill="#5C6BC0" />
                <path d="M-80,-30 L80,-30 L80,30 L-80,30 Z" fill="#7986CB" />
                <path d="M-70,-20 L70,-20 L70,20 L-70,20 Z" fill="#9FA8DA" />
              </g>
              <g transform="translate(0, -120)">
                <circle cx="0" cy="0" r="50" fill="#FF9800" />
                <circle cx="0" cy="0" r="40" fill="#FFA726" />
                <circle cx="0" cy="0" r="30" fill="#FFB74D" />
                <circle cx="0" cy="0" r="20" fill="#FFCC80" />
              </g>
              <g transform="translate(-150, 100)">
                <rect x="-30" y="-30" width="60" height="60" fill="#00BCD4" />
                <rect x="-20" y="-20" width="40" height="40" fill="#26C6DA" />
                <rect x="-10" y="-10" width="20" height="20" fill="#4DD0E1" />
              </g>
              <g transform="translate(150, 100)">
                <polygon points="0,-40 35,20 -35,20" fill="#4CAF50" />
                <polygon points="0,-30 25,15 -25,15" fill="#66BB6A" />
                <polygon points="0,-20 15,10 -15,10" fill="#81C784" />
              </g>
              <g transform="translate(0, 0)">
                <text 
                  x="0" 
                  y="0" 
                  fontFamily="Arial" 
                  fontSize="24" 
                  fill="#263238" 
                  textAnchor="middle"
                >
                  Web3 Business Cards
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSection;
