import React from "react";
import { Button } from "@/components/ui/button";

interface OnboardingSectionProps {
  onConnect: () => void;
  onLearnMore: () => void;
  onDemoMode?: () => void;
}

const OnboardingSection: React.FC<OnboardingSectionProps> = ({ onConnect, onLearnMore, onDemoMode }) => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col md:flex-row gap-8 md:gap-16 items-center py-12 px-6">
      {/* Left Content - Hero Text */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
          Votre identité professionnelle en NFT
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          PeerPass transforme vos cartes de visite traditionnelles en NFTs vérifiables, portables et personnalisables sur la blockchain BNB Chain.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="material-icons text-primary">verified</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Identité vérifiable</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <span className="material-icons text-green-600">sync</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Portable partout</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <span className="material-icons text-amber-600">palette</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Entièrement personnalisable</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={onConnect}
            size="lg"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium rounded-lg"
          >
            <span className="material-icons">account_balance_wallet</span>
            <span>Connecter Wallet</span>
          </Button>
          
          {onDemoMode && (
            <Button 
              onClick={onDemoMode}
              size="lg"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white font-medium rounded-lg"
            >
              <span className="material-icons">visibility</span>
              <span>Mode Démo</span>
            </Button>
          )}
          
          <Button 
            onClick={onLearnMore}
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
          >
            <span className="material-icons">info</span>
            <span>En savoir plus</span>
          </Button>
        </div>
      </div>
      
      {/* Right Content - 3D Card Animation */}
      <div className="flex-1 relative max-w-md">
        <div className="absolute w-full h-full bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl filter blur-3xl"></div>
        <div className="relative w-full aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary to-purple-600 text-white p-2 px-4 rounded-bl-xl">
            NFT
          </div>
          
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600"></div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Marie Dupont</h3>
                <p className="text-gray-600 dark:text-gray-400">UX Designer</p>
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">DesignStudio</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Créative UX/UI designer spécialisée dans les applications mobiles.
              </p>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-3">
                <span className="material-icons text-sm mr-2">mail</span>
                <span>marie@example.com</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <span className="material-icons text-sm mr-2">phone</span>
                <span>+33 6 98 76 54 32</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                  <span className="material-icons text-blue-600 dark:text-blue-200 text-sm">language</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                  <span className="material-icons text-blue-600 dark:text-blue-200 text-sm">linkedin</span>
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="material-icons text-gray-600 dark:text-gray-300">qr_code</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-secondary to-orange-500 rounded-full filter blur-2xl opacity-50"></div>
      </div>
    </div>
  );
};

export default OnboardingSection;
