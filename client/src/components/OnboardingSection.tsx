import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

interface OnboardingSectionProps {
  onConnect: () => void;
  onLearnMore: () => void;
  onDemoMode?: () => void;
}

const OnboardingSection: React.FC<OnboardingSectionProps> = ({ onConnect, onLearnMore, onDemoMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col md:flex-row gap-8 md:gap-16 items-center py-12 px-6">
      {/* Left Content - Hero Text */}
      <div className="flex-1 max-w-2xl">
        {/* Language Selector */}
        <div className="mb-8">
          <LanguageSelector variant="prominent" className="mb-4" />
        </div>
      
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
          {t('onboarding.welcome')}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {t('app.slogan')}
        </p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="material-icons text-primary">verified</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">{t('onboarding.step1Title')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <span className="material-icons text-green-600">sync</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">{t('onboarding.step2Title')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <span className="material-icons text-amber-600">palette</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">{t('onboarding.step3Title')}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={onConnect}
            size="lg"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium rounded-lg"
          >
            <span className="material-icons">account_balance_wallet</span>
            <span>{t('onboarding.connectWallet')}</span>
          </Button>
          
          {onDemoMode && (
            <Button 
              onClick={onDemoMode}
              size="lg"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white font-medium rounded-lg"
            >
              <span className="material-icons">visibility</span>
              <span>{t('onboarding.demoMode')}</span>
            </Button>
          )}
          
          <Button 
            onClick={onLearnMore}
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
          >
            <span className="material-icons">info</span>
            <span>{t('home.learnMore')}</span>
          </Button>
        </div>
      </div>
      
      {/* Right Content - 3D Card Animation */}
      <div className="flex-1 relative max-w-md">
        <div className="absolute w-full h-full bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl filter blur-3xl"></div>
        
        {/* Carte de visite avec format rectangulaire et animation flip */}
        <div className="business-card cursor-pointer mx-auto relative" onClick={() => {
          // Trouver l'élément avec la classe .card-flipper et ajouter/enlever la classe .is-flipped
          const cardEl = document.querySelector('.card-flipper');
          if (cardEl) {
            cardEl.classList.toggle('is-flipped');
          }
        }}>
          <div className="card-flipper">
            {/* FRONT SIDE */}
            <div className="card-front bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary to-purple-600 text-white p-2 px-4 rounded-bl-xl">
                NFT
              </div>
              
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600"></div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">AZIZ LAGHZAOUI</h3>
                    <p className="text-gray-600 dark:text-gray-400">Chairman</p>
                  </div>
                </div>
                
                <div className="space-y-2 flex-1">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Concept4.crypto</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Leader dans l'innovation blockchain et la finance décentralisée.
                  </p>
                </div>
                
                {/* Flip indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-gray-100 dark:text-gray-200 text-[10px] flex items-center opacity-80 hover:opacity-100 z-10 bg-primary/70 dark:bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all shadow-md hover:shadow-lg">
                  <span className="material-icons text-xs mr-1">touch_app</span>
                  <span>Tap to flip</span>
                </div>
              </div>
            </div>
            
            {/* BACK SIDE */}
            <div className="card-back bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Company header */}
              <div className="bg-gradient-to-r from-primary to-purple-600 h-[20%] w-full flex items-center justify-center relative">
                <h2 className="text-white font-bold text-lg">
                  Concept4.crypto
                </h2>
              </div>
              
              <div className="h-[80%] p-6 flex justify-between">
                {/* Contact Information */}
                <div className="w-[65%] flex flex-col justify-center space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="material-icons text-sm mr-2 text-primary dark:text-primary/80">mail</span>
                    <span className="truncate">aziz.laghzaoui@concept4.crypto</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="material-icons text-sm mr-2 text-primary dark:text-primary/80">phone</span>
                    <span>+212 687654321</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="material-icons text-sm mr-2 text-primary dark:text-primary/80">language</span>
                    <span className="truncate">concept4.crypto</span>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="w-[35%] flex items-center justify-center">
                  <div className="p-1 bg-white rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-gray-600 text-2xl">qr_code</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Flip indicator */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-gray-100 dark:text-gray-200 text-[10px] flex items-center opacity-80 hover:opacity-100 z-10 bg-primary/70 dark:bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all shadow-md hover:shadow-lg">
                <span className="material-icons text-xs mr-1">touch_app</span>
                <span>Tap to flip</span>
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
