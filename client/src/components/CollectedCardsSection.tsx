import React from "react";
import { Button } from "@/components/ui/button";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import BusinessCard from "./BusinessCard";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface CollectedCardsSectionProps {
  cards: BusinessCardType[];
  onFilter?: () => void;
  onContact?: (card: BusinessCardType) => void;
}

const CollectedCardsSection: React.FC<CollectedCardsSectionProps> = ({
  cards,
  onFilter,
  onContact,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-xl text-gray-800 dark:text-white">
          {t('cards.collectedCards')}
        </h2>
        
        {onFilter && (
          <Button
            variant="ghost" 
            className="text-gray-600 dark:text-gray-400 font-medium text-sm flex items-center"
            onClick={onFilter}
          >
            <span className="material-icons text-sm mr-1">filter_list</span>
            {t('cards.filterBy')}
          </Button>
        )}
      </div>
      
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="block">
              <BusinessCard 
                card={card}
                onShare={onContact ? () => onContact(card) : undefined}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t('cards.emptyCollectedState')} 
            {t('scan.instructions')}
          </p>
          
          <Link href="/scan">
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">
              <span className="material-icons mr-2">qr_code_scanner</span>
              {t('scan.title')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CollectedCardsSection;
