import ImageUpload from "@/components/composable/upload/upload-image";
import React, { useState } from "react";
import { TemplateEditorProps } from "@/interfaces/comon/template-editor-prop";

export default function SpecialTemplateEditor({ config, setConfig }: TemplateEditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'kh' | 'en'>('kh');

  // Helper function to update top-level config properties
  const updateConfig = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Helper function to update invitation properties for specific language
  const updateInvitation = (field: string, value: string) => {
    const invitationKey = currentLanguage === 'kh' ? 'invitation_kh' : 'invitation_en';
    setConfig((prev: any) => ({  
      ...prev,
      [invitationKey]: {
        ...prev[invitationKey],
        [field]: value
      }
    }));
  };  

  // Helper function to update ceremony times for specific language
  const updateCeremonyTime = (timeField: string, value: string) => {
    const invitationKey = currentLanguage === 'kh' ? 'invitation_kh' : 'invitation_en';
    setConfig((prev: any) => ({
      ...prev,
      [invitationKey]: {
        ...prev[invitationKey],
        ceremony_times: {
          ...prev[invitationKey]?.ceremony_times,
          [timeField]: value
        }
      }
    }));
  };

  // Get current invitation data based on selected language
  const currentInvitation = currentLanguage === 'kh' 
    ? config?.invitation_kh 
    : config?.invitation_en;

  // Safety check for config
  if (!config) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Loading editor configuration...</p>
      </div>
    );
  }

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'kh' ? 'en' : 'kh');
  };

  return (
    <div className="space-y-6">
      {/* Language Switch */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Editing Language:</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${currentLanguage === 'kh' ? 'text-blue-600' : 'text-gray-400'}`}>
              ភាសាខ្មែរ
            </span>
            <button
              onClick={toggleLanguage}
              className="relative w-12 h-6 bg-gray-200 rounded-full transition-colors duration-200"
              style={{ backgroundColor: currentLanguage === 'en' ? '#3B82F6' : '#E5E7EB' }}
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  currentLanguage === 'en' ? 'transform translate-x-6' : 'transform translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${currentLanguage === 'en' ? 'text-blue-600' : 'text-gray-400'}`}>
              English
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Currently editing: {currentLanguage === 'kh' ? 'Khmer' : 'English'} version
        </div>
      </div>
 </div>
  )
}
