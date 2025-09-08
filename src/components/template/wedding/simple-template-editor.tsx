import ImageUpload from "@/components/composable/upload/upload-image";
import React, { useState } from "react";

interface SimpleTemplateEditorProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

export default function SimpleTemplateEditor({ config, setConfig }: SimpleTemplateEditorProps) {
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

      {/* Theme Settings */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Theme Settings (Global)
        </h4>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.primaryColor || "#000000"}
                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.primaryColor || "#000000"}
                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.textColor || "#000000"}
                onChange={(e) => updateConfig('textColor', e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.textColor || "#000000"}
                onChange={(e) => updateConfig('textColor', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Main Header ({currentLanguage === 'kh' ? 'Khmer' : 'English'})
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Title
            </label>
            <input
              type="text"
              value={currentInvitation?.main_title || ""}
              onChange={(e) => updateInvitation('main_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={currentLanguage === 'kh' ? "សិរីមង្គលអាពាហ៍ពិពាហ៍" : "Wedding Invitation"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Groom Name
              </label>
              <input
                type="text"
                value={currentInvitation?.groom_name || ""}
                onChange={(e) => updateInvitation('groom_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Groom's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bride Name
              </label>
              <input
                type="text"
                value={currentInvitation?.bride_name || ""}
                onChange={(e) => updateInvitation('bride_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bride's name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={currentInvitation?.subtitle || ""}
              onChange={(e) => updateInvitation('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={currentLanguage === 'kh' ? "សូមគោរពអញ្ជើញ" : "You are cordially invited"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <input
              type="text"
              value={currentInvitation?.date_time || ""}
              onChange={(e) => updateInvitation('date_time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Wedding date and time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Background Image URL
            </label>
            <ImageUpload
                label="Photo"
                folder="/event/template/assets"
                onChange={(e) => updateInvitation('main_background', e.target.value)}
                value={currentInvitation?.main_background || ""}
            />

          </div>
        </div>
      </div>

      {/* Invitation Message */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Invitation Message ({currentLanguage === 'kh' ? 'Khmer' : 'English'})
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Title
            </label>
            <input
              type="text"
              value={currentInvitation?.invitation_title || ""}
              onChange={(e) => updateInvitation('invitation_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Invitation title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invitation Message
            </label>
            <textarea
              value={currentInvitation?.invitation_message || ""}
              onChange={(e) => updateInvitation('invitation_message', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Enter your invitation message..."
            />
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
          Event Details ({currentLanguage === 'kh' ? 'Khmer' : 'English'})
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details Title
            </label>
            <input
              type="text"
              value={currentInvitation?.details_title || ""}
              onChange={(e) => updateInvitation('details_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event details title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ceremony Date
            </label>
            <input
              type="text"
              value={currentInvitation?.ceremony_date || ""}
              onChange={(e) => updateInvitation('ceremony_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ceremony date"
            />
          </div>

          {/* Ceremony Times */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Ceremony Schedule</h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Morning Time</label>
                <input
                  type="text"
                  value={currentInvitation?.ceremony_times?.morning || ""}
                  onChange={(e) => updateCeremonyTime('morning', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder={currentLanguage === 'kh' ? "ម៉ោង ៦:០០ ព្រឹក" : "09:00 AM"}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Morning Description</label>
                <input
                  type="text"
                  value={currentInvitation?.ceremony_times?.morning_desc || ""}
                  onChange={(e) => updateCeremonyTime('morning_desc', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Morning ceremony"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Afternoon Time</label>
                <input
                  type="text"
                  value={currentInvitation?.ceremony_times?.afternoon || ""}
                  onChange={(e) => updateCeremonyTime('afternoon', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder={currentLanguage === 'kh' ? "ម៉ោង ៤:០០ រសៀល" : "02:00 PM"}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Afternoon Description</label>
                <input
                  type="text"
                  value={currentInvitation?.ceremony_times?.afternoon_desc || ""}
                  onChange={(e) => updateCeremonyTime('afternoon_desc', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Afternoon ceremony"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Evening Time</label>
                <input
                  type="text"
                  value={currentInvitation?.ceremony_times?.evening || ""}
                  onChange={(e) => updateCeremonyTime('evening', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder={currentLanguage === 'kh' ? "ម៉ោង ៧:០០ ល្ងាច" : "07:00 PM"}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Evening Description</label>
                <input
                  type="text"
                  value={currentInvitation?.ceremony_times?.evening_desc || ""}
                  onChange={(e) => updateCeremonyTime('evening_desc', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Evening ceremony"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={currentInvitation?.location || ""}
              onChange={(e) => updateInvitation('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Wedding venue location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details Background Image URL
            </label>
            <ImageUpload
                label="Photo"
                folder="/event/template/assets"
                onChange={(e) => updateInvitation('details_background', e.target.value)}
                value={currentInvitation?.details_background || ""}
            />
          </div>
        </div>
      </div>

    </div>
  );
}