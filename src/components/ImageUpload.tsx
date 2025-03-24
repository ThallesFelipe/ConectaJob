
import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  initialImage?: string;
  onImageUpload: (base64Image: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ initialImage, onImageUpload, className }) => {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setPreview(undefined);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-lg" 
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-70 hover:opacity-100"
            onClick={handleClearImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div 
          className="w-full h-64 border-2 border-dashed border-conecta-green/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-conecta-green/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-2 text-conecta-green/70" />
          <p className="text-muted-foreground text-sm">Click to upload an image</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
