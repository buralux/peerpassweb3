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
import BusinessCard from "./BusinessCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";

// Extend the schema for the form
const createCardFormSchema = createBusinessCardSchema.extend({
  // Add any custom form validation here if needed
});

type CreateCardFormData = z.infer<typeof createCardFormSchema>;

const CreateCardSection: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      company: "",
      bio: "",
      email: "",
      phone: "",
      website: "",
      template: "professional",
      colorScheme: "blue-violet",
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
    setSelectedTemplate(templateId as any);
    form.setValue("template", templateId as any);
  };
  
  // Color scheme selection
  const [selectedColorScheme, setSelectedColorScheme] = useState(COLOR_SCHEMES[0].id);
  const handleColorSchemeChange = (schemeId: string) => {
    setSelectedColorScheme(schemeId as any);
    form.setValue("colorScheme", schemeId as any);
  };
  
  // Generate a preview card based on form values
  const previewCard = {
    id: 0,
    tokenId: null,
    owner: wallet?.address || "",
    name: form.watch("name") || "Your Name",
    jobTitle: form.watch("jobTitle") || "Your Job Title",
    company: form.watch("company") || "Company Name",
    bio: form.watch("bio") || "Short bio or company description",
    email: form.watch("email") || "your.email@example.com",
    phone: form.watch("phone") || "Your Phone Number",
    website: form.watch("website") || "",
    template: form.watch("template"),
    colorScheme: form.watch("colorScheme"),
    avatarUrl: form.watch("avatarUrl") || "",
    socialLinks: form.watch("socialLinks") || {},
    metadata: {},
    ipfsHash: null,
    isMinted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return (
    <div className="my-8 bg-white dark:bg-darkSurface rounded-xl overflow-hidden card-shadow">
      <div className="bg-primary dark:bg-primary/80 text-white p-4">
        <h2 className="font-heading font-bold text-xl">Create New Card</h2>
        <p className="text-blue-100 text-sm">Design your professional NFT business card</p>
      </div>
      
      <div className="p-6">
        {!wallet?.address && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to create a business card.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Template Selection */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 dark:text-white mb-3">Select Template</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {CARD_TEMPLATES.map((template) => (
              <div 
                key={template.id}
                className={`border-2 ${
                  selectedTemplate === template.id 
                    ? "border-primary" 
                    : "border-transparent hover:border-primary"
                } rounded-lg p-1 cursor-pointer`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className={`bg-gradient-to-br ${
                  COLOR_SCHEMES.find(c => c.id === (
                    template.id === "professional" ? "blue-violet" :
                    template.id === "creative" ? "teal-emerald" :
                    template.id === "bold" ? "amber-red" :
                    template.id === "modern" ? "purple-pink" :
                    "gray-dark"
                  ))?.colors.join(" ")
                } h-24 rounded-md`}></div>
                <p className="text-center text-xs mt-1 text-gray-700 dark:text-gray-300">{template.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Card Preview */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 dark:text-white mb-3">Preview</h3>
          <div className="mx-auto max-w-sm">
            <BusinessCard card={previewCard} isPreview={true} />
          </div>
        </div>
        
        {/* Card Details Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">Card Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
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
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Your job title" {...field} />
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
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
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
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Short description about you or your company" 
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="URL to your profile image" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Connect Social Accounts
                  </FormLabel>
                  <div className="flex flex-wrap gap-3">
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <Button
                        key={platform.id}
                        type="button"
                        variant="outline"
                        className="flex items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => {
                          const url = window.prompt(`Enter your ${platform.name} URL:`);
                          if (url) {
                            const currentSocialLinks = form.getValues("socialLinks") || {};
                            form.setValue("socialLinks", {
                              ...currentSocialLinks,
                              [platform.id]: url,
                            });
                          }
                        }}
                      >
                        <span className="material-icons">{platform.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300">{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customize Colors
                  </FormLabel>
                  <div className="flex gap-3">
                    {COLOR_SCHEMES.map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${scheme.colors.join(" ")} border-2 ${
                          selectedColorScheme === scheme.id 
                            ? "border-white shadow" 
                            : "border-transparent"
                        }`}
                        onClick={() => handleColorSchemeChange(scheme.id)}
                      ></button>
                    ))}
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center"
                      onClick={() => {
                        alert("Custom color schemes will be available in a future update!");
                      }}
                    >
                      <span className="material-icons text-gray-400 text-lg">add</span>
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
                    disabled={isSubmitting || !wallet?.address}
                  >
                    <span className="material-icons mr-2">generating_tokens</span>
                    Create NFT Card
                  </Button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This will prepare your card for minting as an NFT on BNB Chain Testnet
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCardSection;
