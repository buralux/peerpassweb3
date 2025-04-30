import React from "react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      className="fixed bottom-20 right-6 bg-primary dark:bg-secondary text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center w-12 h-12"
      aria-label="Scan QR Code"
    >
      <span className="material-icons">qr_code_scanner</span>
    </Button>
  );
};

export default FloatingActionButton;
