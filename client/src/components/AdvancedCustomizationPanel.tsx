import React, { useState } from "react";
import { CardCustomization, FontFamily, fontFamilies } from "@shared/schema";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { HexColorPicker } from "react-colorful";

interface AdvancedCustomizationPanelProps {
  customization: CardCustomization;
  onChange: (customization: CardCustomization) => void;
}

const AdvancedCustomizationPanel: React.FC<AdvancedCustomizationPanelProps> = ({
  customization,
  onChange
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('typography');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  // Helper function to update a specific property
  const updateProperty = (property: keyof CardCustomization, value: any) => {
    onChange({
      ...customization,
      [property]: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary to-purple-600 text-white">
        <h3 className="font-bold text-lg">
          {t('customize.advancedOptions')}
        </h3>
        <p className="text-sm text-blue-100">
          {t('customize.fineTuneAppearance')}
        </p>
      </div>

      <Tabs 
        defaultValue="typography" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="p-4"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="typography">{t('customize.typography')}</TabsTrigger>
          <TabsTrigger value="effects">{t('customize.effects')}</TabsTrigger>
          <TabsTrigger value="layout">{t('customize.layout')}</TabsTrigger>
        </TabsList>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="font-family">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.fontFamily')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <Select
                  value={customization.fontFamily || 'system-ui'}
                  onValueChange={(value: FontFamily) => updateProperty('fontFamily', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('customize.selectFont')} />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p 
                    className="text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: customization.fontFamily || 'system-ui' }}
                  >
                    {t('customize.fontPreview')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="font-sizes">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.fontSize')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('customize.nameSize')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[parseInt(customization.nameFontSize?.replace('px', '') || '24')]} 
                      min={12} 
                      max={48} 
                      step={1}
                      onValueChange={(values) => updateProperty('nameFontSize', `${values[0]}px`)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.nameFontSize || '24px'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('customize.titleSize')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[parseInt(customization.titleFontSize?.replace('px', '') || '16')]} 
                      min={10} 
                      max={24} 
                      step={1}
                      onValueChange={(values) => updateProperty('titleFontSize', `${values[0]}px`)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.titleFontSize || '16px'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('customize.textSize')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[parseInt(customization.textFontSize?.replace('px', '') || '14')]} 
                      min={8} 
                      max={20} 
                      step={1}
                      onValueChange={(values) => updateProperty('textFontSize', `${values[0]}px`)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.textFontSize || '14px'}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="font-weight">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.fontWeight')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <Select
                  value={customization.fontWeight || 'normal'}
                  onValueChange={(value: 'normal' | 'medium' | 'semibold' | 'bold') => 
                    updateProperty('fontWeight', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('customize.selectWeight')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semi-Bold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shadows">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.shadows')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <Select
                  value={customization.shadowIntensity || 'medium'}
                  onValueChange={(value: 'none' | 'light' | 'medium' | 'strong') => 
                    updateProperty('shadowIntensity', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('customize.selectShadow')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('customize.shadows.none')}</SelectItem>
                    <SelectItem value="light">{t('customize.shadows.light')}</SelectItem>
                    <SelectItem value="medium">{t('customize.shadows.medium')}</SelectItem>
                    <SelectItem value="strong">{t('customize.shadows.strong')}</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="glow">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.glowEffect')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={customization.glowEffect || false}
                    onCheckedChange={(checked) => updateProperty('glowEffect', checked)}
                  />
                  <Label>{t('customize.enableGlow')}</Label>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="opacity">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.transparency')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>{t('customize.backgroundOpacity')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[customization.opacity || 100]} 
                      min={20} 
                      max={100} 
                      step={5}
                      onValueChange={(values) => updateProperty('opacity', values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.opacity || 100}%
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="blur">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.blur')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>{t('customize.blurIntensity')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[customization.blur || 0]} 
                      min={0} 
                      max={10} 
                      step={0.5}
                      onValueChange={(values) => updateProperty('blur', values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.blur || 0}px
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="borders">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.borders')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('customize.borderRadius')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[customization.borderRadius || 8]} 
                      min={0} 
                      max={24} 
                      step={1}
                      onValueChange={(values) => updateProperty('borderRadius', values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.borderRadius || 8}px
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('customize.borderWidth')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[customization.borderWidth || 0]} 
                      min={0} 
                      max={5} 
                      step={1}
                      onValueChange={(values) => updateProperty('borderWidth', values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.borderWidth || 0}px
                    </span>
                  </div>
                </div>

                {customization.borderWidth && customization.borderWidth > 0 && (
                  <div className="space-y-2">
                    <Label>{t('customize.borderColor')}</Label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border cursor-pointer"
                        style={{ backgroundColor: customization.borderColor || '#000000' }}
                        onClick={() => setShowColorPicker('borderColor')}
                      />
                      <Input 
                        value={customization.borderColor || '#000000'} 
                        onChange={(e) => updateProperty('borderColor', e.target.value)}
                        className="flex-1"
                      />
                      {showColorPicker === 'borderColor' && (
                        <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{t('customize.pickColor')}</span>
                            <button 
                              onClick={() => setShowColorPicker(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                          <HexColorPicker 
                            color={customization.borderColor || '#000000'} 
                            onChange={(color) => updateProperty('borderColor', color)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="alignment">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.contentAlignment')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <Select
                  value={customization.contentAlignment || 'center'}
                  onValueChange={(value: 'left' | 'center' | 'right') => 
                    updateProperty('contentAlignment', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('customize.selectAlignment')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">{t('customize.alignment.left')}</SelectItem>
                    <SelectItem value="center">{t('customize.alignment.center')}</SelectItem>
                    <SelectItem value="right">{t('customize.alignment.right')}</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="avatar">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.avatarSettings')}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>{t('customize.avatarSize')}</Label>
                  <Select
                    value={customization.avatarSize || 'medium'}
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      updateProperty('avatarSize', value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('customize.selectSize')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t('customize.size.small')}</SelectItem>
                      <SelectItem value="medium">{t('customize.size.medium')}</SelectItem>
                      <SelectItem value="large">{t('customize.size.large')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('customize.avatarBorder')}</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[customization.avatarBorderWidth || 0]} 
                      min={0} 
                      max={10} 
                      step={1}
                      onValueChange={(values) => updateProperty('avatarBorderWidth', values[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {customization.avatarBorderWidth || 0}px
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="colors">
              <AccordionTrigger className="text-base font-medium py-2">
                {t('customize.customColors')}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('customize.primaryColor')}</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border cursor-pointer"
                      style={{ backgroundColor: customization.primaryColor || '#3b82f6' }}
                      onClick={() => setShowColorPicker('primaryColor')}
                    />
                    <Input 
                      value={customization.primaryColor || '#3b82f6'} 
                      onChange={(e) => updateProperty('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                    {showColorPicker === 'primaryColor' && (
                      <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{t('customize.pickColor')}</span>
                          <button 
                            onClick={() => setShowColorPicker(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                        <HexColorPicker 
                          color={customization.primaryColor || '#3b82f6'} 
                          onChange={(color) => updateProperty('primaryColor', color)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('customize.secondaryColor')}</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border cursor-pointer"
                      style={{ backgroundColor: customization.secondaryColor || '#8b5cf6' }}
                      onClick={() => setShowColorPicker('secondaryColor')}
                    />
                    <Input 
                      value={customization.secondaryColor || '#8b5cf6'} 
                      onChange={(e) => updateProperty('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                    {showColorPicker === 'secondaryColor' && (
                      <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{t('customize.pickColor')}</span>
                          <button 
                            onClick={() => setShowColorPicker(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                        <HexColorPicker 
                          color={customization.secondaryColor || '#8b5cf6'} 
                          onChange={(color) => updateProperty('secondaryColor', color)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('customize.textColor')}</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border cursor-pointer"
                      style={{ backgroundColor: customization.textColor || '#ffffff' }}
                      onClick={() => setShowColorPicker('textColor')}
                    />
                    <Input 
                      value={customization.textColor || '#ffffff'} 
                      onChange={(e) => updateProperty('textColor', e.target.value)}
                      className="flex-1"
                    />
                    {showColorPicker === 'textColor' && (
                      <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{t('customize.pickColor')}</span>
                          <button 
                            onClick={() => setShowColorPicker(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                        <HexColorPicker 
                          color={customization.textColor || '#ffffff'} 
                          onChange={(color) => updateProperty('textColor', color)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-2">
        <button
          type="button"
          onClick={() => onChange({})}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          {t('customize.resetToDefaults')}
        </button>
      </div>
    </div>
  );
};

export default AdvancedCustomizationPanel;