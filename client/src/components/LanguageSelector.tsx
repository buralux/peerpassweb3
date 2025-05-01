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
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
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
        <div className="flex justify-center mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 rounded-full hover:bg-primary/10 transition-all duration-300"
              >
                <span className="material-icons">language</span>
                <span className="text-sm font-medium">{t('common.language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
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
        </div>
      </div>
    );
  }

  // Rendu pour la version compacte (menu standard) - juste l'icône
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full p-2 hover:bg-primary/10 ${className}`}
          title={t('common.language')}
        >
          <span className="material-icons">language</span>
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