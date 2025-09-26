import ImageUpload from "@/components/composable/upload/upload-image";
import React, { useState } from "react";
import { TemplateEditorProps } from "@/interfaces/comon/template-editor-prop";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SimpleTemplateEditor({
  config,
  setConfig,
}: TemplateEditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"kh" | "en">("kh");
  const { t } = useTranslation("common");

  // Helper function to update top-level config properties
  const updateConfig = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to update invitation properties for specific language
  const updateInvitation = (field: string, value: string) => {
    const invitationKey =
      currentLanguage === "kh" ? "invitation_kh" : "invitation_en";
    setConfig((prev: any) => ({
      ...prev,
      [invitationKey]: {
        ...prev[invitationKey],
        [field]: value,
      },
    }));
  };

  const updatePhotoGallery = (photoField: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      photo_gallary: {
        ...prev.photo_gallary,
        [photoField]: value,
      },
    }));
  };

  // Get current invitation data based on selected language
  const currentInvitation =
    currentLanguage === "kh" ? config?.invitation_kh : config?.invitation_en;

  // Safety check for config
  if (!config) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Loading editor configuration...</p>
      </div>
    );
  }

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "kh" ? "en" : "kh"));
  };

  const langLabel =
    currentLanguage === "kh"
      ? t("template_editor.khmer")
      : t("template_editor.english");

  return (
    <div className="space-y-6">
      {/* Language Switch */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {t("template_editor.editing_language")}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                currentLanguage === "kh" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {t("template_editor.khmer")}
            </span>
            <button
              onClick={toggleLanguage}
              className="relative w-12 h-6 bg-gray-200 rounded-full transition-colors duration-200"
              style={{
                backgroundColor:
                  currentLanguage === "en" ? "#3B82F6" : "#E5E7EB",
              }}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  currentLanguage === "en"
                    ? "transform translate-x-6"
                    : "transform translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                currentLanguage === "en" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {t("template_editor.english")}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {t("template_editor.currently_editing", { lang: langLabel })}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          {t("template_editor.theme_settings")}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.primary_color")}
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={config.primaryColor || "#ffffff"}
                onChange={(e) => updateConfig("primaryColor", e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={config.primaryColor || "#ffffff"}
                onChange={(e) => updateConfig("primaryColor", e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.text_color")}
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={config.textColor || "#eea62b"}
                onChange={(e) => updateConfig("textColor", e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={config.textColor || "#eea62b"}
                onChange={(e) => updateConfig("textColor", e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="#eea62b"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          {t("template_editor.main_header", { lang: langLabel })}
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.main_title")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.main_title || ""}
              onChange={(e) => updateInvitation("main_title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                currentLanguage === "kh"
                  ? "សិរីមង្គលអាពាហ៍ពិពាហ៍"
                  : "Wedding Invitation"
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.subtitle")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.subtitle || ""}
              onChange={(e) => updateInvitation("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                currentLanguage === "kh"
                  ? "សូមគោរពអញ្ជើញ"
                  : "You are cordially invited"
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.date_time")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.date_time || ""}
              onChange={(e) => updateInvitation("date_time", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Wedding date and time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.location")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.location || ""}
              onChange={(e) => updateInvitation("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Wedding venue location"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.ceremony_date")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.ceremony_date || ""}
              onChange={(e) =>
                updateInvitation("ceremony_date", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("template_editor.ceremony_date")}
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.main_background_image")}
            </label>
            <ImageUpload
              label="Photo"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("main_background", e.target.value)}
              value={config?.main_background || ""}
            />
          </div>
        </div>
      </div>

      {/* Invitation Message */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          {t("template_editor.invitation_message", { lang: langLabel })}
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.message_title")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.invitation_title || ""}
              onChange={(e) =>
                updateInvitation("invitation_title", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Invitation title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.invitation_message_content")}
            </label>
            <Textarea
              value={currentInvitation?.invitation_message || ""}
              onChange={(e) =>
                updateInvitation("invitation_message", e.target.value)
              }
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
          {t("template_editor.event_details", { lang: langLabel })}
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.details_title")}
            </label>
            <Input
              type="text"
              value={currentInvitation?.details_title || ""}
              onChange={(e) =>
                updateInvitation("details_title", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event details title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Location
            </label>
            <ImageUpload
              label="Event Map"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("event_location", e.target.value)}
              value={config?.event_location || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps URL
            </label>
            <Input
              type="url"
              value={config?.map_url || ""}
              onChange={(e) => updateConfig("map_url", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("template_editor.details_background_image")}
            </label>
            <ImageUpload
              label="Photo"
              folder="/event/template/assets"
              onChange={(e) =>
                updateConfig("details_background", e.target.value)
              }
              value={config?.details_background || ""}
            />
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
          Photo Gallery ({langLabel})
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo 1
            </label>
            <ImageUpload
              label="Photo 1"
              folder="/event/template/assets"
              onChange={(e) => updatePhotoGallery("photo1", e.target.value)}
              value={config?.photo_gallary?.photo1 || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo 2
            </label>
            <ImageUpload
              label="Photo 2"
              folder="/event/template/assets"
              onChange={(e) => updatePhotoGallery("photo2", e.target.value)}
              value={config?.photo_gallary?.photo2 || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo 3
            </label>
            <ImageUpload
              label="Photo 3"
              folder="/event/template/assets"
              onChange={(e) => updatePhotoGallery("photo3", e.target.value)}
              value={config?.photo_gallary?.photo3 || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo 4
            </label>
            <ImageUpload
              label="Photo 4"
              folder="/event/template/assets"
              onChange={(e) => updatePhotoGallery("photo4", e.target.value)}
              value={config?.photo_gallary?.photo4 || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
