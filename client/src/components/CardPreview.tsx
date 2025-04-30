import React, { useEffect, useState } from "react";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import BusinessCard from "./BusinessCard";
import { CARD_TEMPLATES, COLOR_SCHEMES } from "@/lib/constants";

interface CardPreviewProps {
  card: BusinessCardType;
  templateId: string;
  colorSchemeId: string;
  onChange?: (changes: any) => void;
  className?: string;
}

/**
 * Composant dédié à l'aperçu des cartes de visite qui garantit une mise à jour lors des changements
 */
const CardPreview: React.FC<CardPreviewProps> = ({ 
  card,
  templateId,
  colorSchemeId,
  onChange,
  className = ""
}) => {
  // État interne pour force un rafraîchissement à chaque changement de props
  const [key, setKey] = useState(Date.now());
  
  // Met à jour la clé à chaque changement de template ou de couleur
  useEffect(() => {
    setKey(Date.now());
    
    if (onChange) {
      onChange({
        template: templateId,
        colorScheme: colorSchemeId
      });
    }
  }, [templateId, colorSchemeId]);
  
  // Crée une carte avec les valeurs de template et couleur actuelles
  const previewCard = {
    ...card,
    template: templateId,
    colorScheme: colorSchemeId
  };
  
  return (
    <div className={`bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 shadow-md ${className}`}>
      <h3 className="font-medium text-lg text-gray-800 dark:text-white mb-2 flex items-center">
        <span className="material-icons mr-2 text-primary">preview</span>
        Card Preview
      </h3>
      
      <div className="w-full max-w-sm mx-auto">
        <BusinessCard key={key} card={previewCard} isPreview={true} />
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
          Template: <span className="text-primary">{CARD_TEMPLATES.find(t => t.id === templateId)?.name}</span>
        </h4>
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
          Color: <span className="text-primary">{COLOR_SCHEMES.find(c => c.id === colorSchemeId)?.name}</span>
        </h4>
      </div>
    </div>
  );
};

export default CardPreview;