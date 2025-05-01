import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBusinessCardSchema } from "@shared/schema";
import { z } from "zod";
import { CARD_TEMPLATES, COLOR_SCHEMES, SOCIAL_PLATFORMS } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CardPreview from "./CardPreview";
import BusinessCard from "./BusinessCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

// Extend the schema for the form
const createCardFormSchema = createBusinessCardSchema.extend({
  // Add any custom form validation here if needed
});

type CreateCardFormData = z.infer<typeof createCardFormSchema>;

const CreateCardSection: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'template' | 'details' | 'social' | 'customize' | 'preview'>('template');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  // Initialize form with default values
  const form = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: {
      name: "AZIZ LAGHZAOUI",
      jobTitle: "Chairman",
      company: "Concept4.crypto",
      bio: "Leader dans l'innovation blockchain et la finance décentralisée. Pionnier des solutions crypto pour les entreprises.",
      email: "aziz.laghzaoui@concept4.crypto",
      phone: "+212 687654321",
      website: "concept4.crypto",
      template: "modern",
      colorScheme: "purple-pink",
      owner: wallet?.address || "",
      socialLinks: {},
      avatarUrl: "",
    },
  });
  
  // Update owner when wallet changes
  React.useEffect(() => {
    if (wallet?.address) {
      form.setValue("owner", wallet.address);
    }
  }, [wallet?.address, form]);
  
  // Form submission handler
  const onSubmit = async (data: CreateCardFormData) => {
    if (!wallet?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a card",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the card
      const response = await apiRequest("POST", "/api/cards", {
        ...data,
        owner: wallet.address,
      });
      
      const newCard = await response.json();
      
      // Invalidate queries to force a refetch
      queryClient.invalidateQueries({ queryKey: [`/api/cards/owner/${wallet.address}`] });
      
      toast({
        title: "Card created",
        description: "Your business card has been created successfully",
      });
      
      // Navigate to the card detail page
      navigate(`/card/${newCard.id}`);
    } catch (error) {
      console.error("Error creating card:", error);
      toast({
        title: "Error creating card",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0].id);
  const handleTemplateChange = (templateId: string) => {
    console.log(`Template change: selectedTemplate=${templateId}`);
    // Utiliser un cast pour garantir la compatibilité des types
    setSelectedTemplate(templateId as any);
    form.setValue("template", templateId as any);
    // Force refresh de l'aperçu
    setForceRefresh(prev => !prev);
    
    // Debug après changement
    setTimeout(() => {
      console.log(`After template change: previewCard.template=${previewCard.template}, selectedTemplate=${selectedTemplate}`);
    }, 100);
  };
  
  // Color scheme selection
  const [selectedColorScheme, setSelectedColorScheme] = useState(COLOR_SCHEMES[0].id);
  const handleColorSchemeChange = (schemeId: string) => {
    setSelectedColorScheme(schemeId as any);
    form.setValue("colorScheme", schemeId as any);
    // Force refresh de l'aperçu
    setForceRefresh(prev => !prev);
  };
  
  // State pour forcer un refresh de l'aperçu
  const [forceRefresh, setForceRefresh] = useState(false);
  
  // Watch form fields for changes
  const name = form.watch("name");
  const jobTitle = form.watch("jobTitle");
  const company = form.watch("company");
  const bio = form.watch("bio");
  const email = form.watch("email");
  const phone = form.watch("phone");
  const website = form.watch("website");
  const avatarUrl = form.watch("avatarUrl");
  const socialLinks = form.watch("socialLinks");
  
  // Generate a preview card based on form values, but also use selectedTemplate and selectedColorScheme
  // This makes the preview react immediately to template and color scheme changes
  const previewCard = {
    id: 0,
    tokenId: null,
    owner: wallet?.address || "",
    name: name || "Your Name",
    jobTitle: jobTitle || "Your Job Title",
    company: company || "Company Name",
    bio: bio || "Short bio or company description",
    email: email || "your.email@example.com",
    phone: phone || "Your Phone Number",
    website: website || "",
    template: selectedTemplate, // Use selectedTemplate instead of form.watch("template")
    colorScheme: selectedColorScheme, // Use selectedColorScheme instead of form.watch("colorScheme")
    avatarUrl: avatarUrl || "",
    socialLinks: socialLinks || {},
    metadata: {},
    customization: {}, // Empty customization object for now
    ipfsHash: null,
    isMinted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep === 'template') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('social');
    else if (currentStep === 'social') setCurrentStep('customize');
    else if (currentStep === 'customize') setCurrentStep('preview');
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    if (currentStep === 'preview') setCurrentStep('customize');
    else if (currentStep === 'customize') setCurrentStep('social');
    else if (currentStep === 'social') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('template');
  };
  
  return (
    <div className="max-w-4xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
        
        <h2 className="font-bold text-2xl relative">{t('create.title')}</h2>
        <p className="text-blue-100 text-sm relative">{t('create.designCard')}</p>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        {!wallet?.address && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to create a business card.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['template', 'details', 'social', 'preview'].map((step, index) => (
              <div key={step}>
                {/* Step circle */}
                <div 
                  className={`flex flex-col items-center cursor-pointer`}
                  onClick={() => setCurrentStep(step as any)}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep === step 
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                  `}>
                    {index + 1}
                  </div>
                  <span className={`mt-2 text-xs ${
                    currentStep === step 
                      ? 'text-primary font-medium' 
                      : 'text-gray-500'
                  }`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
                
                {/* Connector line */}
                {index < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    index < ['template', 'details', 'social', 'preview'].indexOf(currentStep)
                      ? 'bg-primary' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Template Selection Step */}
            {currentStep === 'template' && (
              <div className="space-y-6">
                {/* Utiliser le composant CardPreview qui gère sa propre mise à jour */}
                <div className="md:hidden mb-4">
                  <CardPreview 
                    key={`mobile-preview-${selectedTemplate}-${selectedColorScheme}-${forceRefresh}`}
                    card={previewCard}
                    templateId={selectedTemplate}
                    colorSchemeId={selectedColorScheme}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                      <h3 className="font-medium text-xl text-gray-800 dark:text-white mb-4">{t('create.selectTemplate')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('create.selectTemplateDesc')}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {CARD_TEMPLATES.map((template) => (
                          <div 
                            key={template.id}
                            className={`relative rounded-xl overflow-hidden transition-all cursor-pointer transform hover:scale-105 group ${
                              selectedTemplate === template.id 
                                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800' 
                                : 'ring-1 ring-gray-200 dark:ring-gray-700'
                            }`}
                            onClick={() => handleTemplateChange(template.id)}
                          >
                            {/* Template preview */}
                            <div className={`aspect-[3/4] bg-gradient-to-br ${
                              COLOR_SCHEMES.find(c => c.id === (
                                template.id === "professional" ? "blue-violet" :
                                template.id === "creative" ? "teal-emerald" :
                                template.id === "bold" ? "amber-red" :
                                template.id === "modern" ? "purple-pink" :
                                "gray-dark"
                              ))?.colors.join(" ")
                            }`}>
                              <div className="w-full h-full flex flex-col justify-between p-3">
                                <div className="flex items-center bg-white/20 rounded-lg p-1">
                                  <div className="w-6 h-6 rounded-full bg-white/30 mr-2"></div>
                                  <div className="flex-1">
                                    <div className="h-2 w-12 bg-white/30 rounded-full"></div>
                                    <div className="h-2 w-8 bg-white/30 rounded-full mt-1"></div>
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-white/20 rounded-full"></div>
                                  <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                                  <div className="flex justify-between mt-2">
                                    <div className="h-4 w-4 rounded-full bg-white/20"></div>
                                    <div className="h-4 w-4 rounded-full bg-white/20"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Selected overlay */}
                            {selectedTemplate === template.id && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="bg-white rounded-full p-1">
                                  <span className="material-icons text-primary">check</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Title */}
                            <div className="p-2 bg-white dark:bg-gray-800 text-center">
                              <p className="font-medium text-sm text-gray-800 dark:text-white">{template.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mt-6">
                      <h3 className="font-medium text-xl text-gray-800 dark:text-white mb-4">{t('create.selectColorScheme')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('create.selectColorDesc')}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {COLOR_SCHEMES.map((scheme) => (
                          <button
                            key={scheme.id}
                            type="button"
                            onClick={() => handleColorSchemeChange(scheme.id)}
                            className={`relative rounded-xl overflow-hidden transition-all cursor-pointer transform hover:scale-105 ${
                              selectedColorScheme === scheme.id 
                                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800' 
                                : 'ring-1 ring-gray-200 dark:ring-gray-700'
                            }`}
                          >
                            <div className={`h-24 bg-gradient-to-br ${scheme.colors.join(" ")}`}></div>
                            <div className="p-2 bg-white dark:bg-gray-800 text-center">
                              <p className="font-medium text-sm text-gray-800 dark:text-white">{scheme.name}</p>
                            </div>
                            
                            {selectedColorScheme === scheme.id && (
                              <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                                <span className="material-icons text-primary text-sm">check</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Aperçu de la carte en temps réel - avec 'position: sticky' sur desktop uniquement */}
                  <div className="hidden md:block sticky top-4">
                    <CardPreview 
                      key={`desktop-preview-${selectedTemplate}-${selectedColorScheme}-${forceRefresh}`}
                      card={previewCard}
                      templateId={selectedTemplate}
                      colorSchemeId={selectedColorScheme}
                      className="h-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg"
                  >
                    {t('common.nextStep')}
                    <span className="material-icons ml-2">arrow_forward</span>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Personal Details Step */}
            {currentStep === 'details' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                  <h3 className="font-medium text-xl text-gray-800 dark:text-white mb-4">{t('create.personalInfo.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t('create.personalInfo.subtitle')}</p>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.personalInfo.fullName')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <span className="material-icons text-sm">person</span>
                                </span>
                                <Input 
                                  placeholder="Your full name" 
                                  className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.personalInfo.jobTitle')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <span className="material-icons text-sm">work</span>
                                </span>
                                <Input 
                                  placeholder="Your job title" 
                                  className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.personalInfo.company')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="material-icons text-sm">business</span>
                              </span>
                              <Input 
                                placeholder="Your company name" 
                                className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.personalInfo.bio')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">
                                <span className="material-icons text-sm">description</span>
                              </span>
                              <Textarea 
                                placeholder="Short description about you or your company" 
                                rows={3}
                                className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.personalInfo.email')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <span className="material-icons text-sm">mail</span>
                                </span>
                                <Input 
                                  type="email" 
                                  placeholder="your.email@example.com" 
                                  className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.personalInfo.phone')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                  <span className="material-icons text-sm">phone</span>
                                </span>
                                <Input 
                                  type="tel" 
                                  placeholder="Your phone number" 
                                  className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
                    className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    <span className="material-icons mr-2">arrow_back</span>
                    {t("common.prevStep")}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    {t("common.nextStep")}
                    <span className="material-icons ml-2">arrow_forward</span>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Social Links Step */}
            {currentStep === 'social' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                  <h3 className="font-medium text-xl text-gray-800 dark:text-white mb-4">{t('create.socialInfo.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t('create.socialInfo.subtitle')}</p>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.socialInfo.avatarUrl')}</FormLabel>
                          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 shadow-md flex-shrink-0">
                              {field.value ? (
                                <img 
                                  src={field.value} 
                                  alt="Avatar preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <span className="material-icons text-3xl">person</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <span className="material-icons text-sm">photo</span>
                                  </span>
                                  <Input 
                                    placeholder="URL to your profile image" 
                                    className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {t('create.socialInfo.avatarHelp')}
                              </p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">{t('create.socialInfo.website')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="material-icons text-sm">language</span>
                              </span>
                              <Input 
                                placeholder="https://yourwebsite.com" 
                                className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                  <h3 className="font-medium text-xl text-gray-800 dark:text-white mb-4">{t('create.socialNetworks.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t('create.socialNetworks.subtitle')}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SOCIAL_PLATFORMS.map((platform) => {
                      const socialLinks = form.watch("socialLinks") || {};
                      const isConnected = socialLinks[platform.id];
                      
                      return (
                        <div 
                          key={platform.id}
                          className={`rounded-xl border ${isConnected 
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                          } p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all`}
                          onClick={() => {
                            const url = window.prompt(`Enter your ${platform.name} URL:`);
                            if (url) {
                              const currentSocialLinks = form.getValues("socialLinks") || {};
                              form.setValue("socialLinks", {
                                ...currentSocialLinks,
                                [platform.id]: url,
                              });
                            } else if (url === "") {
                              // Remove if empty string
                              const currentSocialLinks = form.getValues("socialLinks") || {};
                              const newSocialLinks = { ...currentSocialLinks };
                              delete newSocialLinks[platform.id];
                              form.setValue("socialLinks", newSocialLinks);
                            }
                          }}
                        >
                          <div className={`w-12 h-12 rounded-full ${isConnected 
                            ? 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          } flex items-center justify-center mb-2`}>
                            <span className="material-icons text-2xl">{platform.icon}</span>
                          </div>
                          
                          <p className={`font-medium ${isConnected 
                            ? 'text-green-700 dark:text-green-400' 
                            : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {platform.name}
                          </p>
                          
                          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            {isConnected ? t('create.socialNetworks.connected') : t('create.socialNetworks.notConnected')}
                          </p>
                          
                          {isConnected && (
                            <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                              <span className="material-icons text-xs mr-1">check_circle</span>
                              <span>{t('create.socialNetworks.added')}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
                    className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    <span className="material-icons mr-2">arrow_back</span>
                    {t("common.prevStep")}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    {t("common.nextStep")}
                    <span className="material-icons ml-2">arrow_forward</span>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Preview & Submit Step */}
            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                  <h3 className="font-medium text-xl text-gray-800 dark:text-white mb-4">{t('create.preview.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t('create.preview.subtitle')}</p>
                  
                  <div className="mx-auto max-w-sm">
                    <CardPreview 
                      key={`final-preview-${selectedTemplate}-${selectedColorScheme}-${forceRefresh}`}
                      card={previewCard}
                      templateId={selectedTemplate}
                      colorSchemeId={selectedColorScheme}
                      className="h-full"
                    />
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-medium text-xl text-primary mb-4 flex items-center">
                    <span className="material-icons mr-2">generating_tokens</span>
                    {t('create.nftOnChain')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('create.blockchainInfo')}
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="material-icons text-primary mr-2">token</span>
                        <span className="font-medium">{t('create.nftOnChain')}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('create.uniqueToken')}
                      </p>
                    </div>
                    
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="material-icons text-primary mr-2">database</span>
                        <span className="font-medium">{t('create.ipfsStored')}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('create.ipfsDescription')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between mt-8 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPrevStep}
                      className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg flex items-center"
                    >
                      <span className="material-icons mr-2">arrow_back</span>
                      {t("common.prevStep")}
                    </Button>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Demo Mode Button */}
                      <Button
                        type="button"
                        className="bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          // Simulation de création en mode démo
                          setIsSubmitting(true);
                          setTimeout(() => {
                            toast({
                              title: t('create.demoCardCreated'),
                              description: t('create.demoCardCreatedSuccess'),
                            });
                            setIsSubmitting(false);
                            // Redirection vers la page d'accueil
                            navigate('/');
                          }, 1500);
                        }}
                      >
                        <span className="material-icons">visibility</span>
                        <span>{t('create.createInDemoMode')}</span>
                      </Button>
                      
                      {/* Real Creation Button */}
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2"
                        disabled={isSubmitting || !wallet?.address}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{t('common.creating')}</span>
                          </>
                        ) : (
                          <>
                            <span className="material-icons">generating_tokens</span>
                            <span>{t('create.createNFTCard')}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {!wallet?.address && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="material-icons text-amber-500">info</span>
                        <div>
                          <p className="text-amber-800 dark:text-amber-300 font-medium">{t('create.testModeActive')}</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            {t('create.walletDisabledInfo')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCardSection;
