import React from "react";
import { Button } from "@/components/ui/button";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import BusinessCard from "./BusinessCard";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface CardSectionProps {
  cards: BusinessCardType[];
  title: string;
  emptyStateMessage?: string;
  showCreateButton?: boolean;
  onCreateCard?: () => void;
  onShare?: (card: BusinessCardType) => void;
}

const CardSection: React.FC<CardSectionProps> = ({
  cards,
  title,
  emptyStateMessage = "No cards to display",
  showCreateButton = false,
  onCreateCard,
  onShare,
}) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-xl text-gray-800 dark:text-white">{title}</h2>
        
        {showCreateButton && (
          <Button
            variant="ghost"
            className="text-primary dark:text-secondary font-medium text-sm flex items-center"
            onClick={onCreateCard}
          >
            <span className="material-icons text-sm mr-1">add_circle</span>
            {t('cards.createNew')}
          </Button>
        )}
      </div>
      
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.id} href={`/card/${card.id}`}>
              <a className="block cursor-pointer">
                <BusinessCard 
                  card={card} 
                  onShare={onShare ? () => onShare(card) : undefined}
                />
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyStateMessage}</p>
          
          {showCreateButton && (
            <Button
              className="mt-4 bg-primary hover:bg-primary/90 text-white"
              onClick={onCreateCard}
            >
              <span className="material-icons mr-2">add_circle</span>
              {t('cards.createYourFirstCard')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardSection;
