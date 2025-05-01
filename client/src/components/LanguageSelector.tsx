import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Structure des langues disponibles
interface Language {
  code: string;
  name: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

// Définition des langues disponibles
const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

interface LanguageSelectorProps {
  variant?: 'default' | 'prominent';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  const { i18n, t } = useTranslation();
  
  // Trouver la langue actuelle
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  // Changer de langue
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    
    // Si la langue est l'arabe, définir la direction du document à 'rtl', sinon à 'ltr'
    const dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
  };

  // Rendu pour la version proéminente (page d'accueil)
  if (variant === 'prominent') {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <h3 className="text-lg font-medium text-center mb-2">{t('common.language')}</h3>
        <div className="flex gap-3 justify-center">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={lang.code === i18n.language ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${lang.code === i18n.language ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Rendu pour la version compacte (menu standard)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-2 px-2 ${className}`}
        >
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center gap-2 ${lang.code === i18n.language ? 'bg-muted' : ''}`}
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;