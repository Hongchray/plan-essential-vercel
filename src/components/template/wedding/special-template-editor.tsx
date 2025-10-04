import ImageUpload from "@/components/composable/upload/upload-image";
import VideoUpload from "@/components/composable/upload/upload-video";
import AudioUpload from "@/components/composable/upload/upload-audio";
import React from "react";
import { TemplateEditorProps } from "@/interfaces/comon/template-editor-prop";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

export default function SpecialTemplateEditor({
  config,
  setConfig,
}: TemplateEditorProps) {
  const { t } = useTranslation("common");

  // Helper function to update top-level config properties
  const updateConfig = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to update gallery photos
  const updateGalleryPhoto = (index: number, value: string) => {
    setConfig((prev: any) => {
      const currentGallery = prev.gallery_photos || [];
      const updatedGallery = [...currentGallery];
      updatedGallery[index] = value;
      return {
        ...prev,
        gallery_photos: updatedGallery,
      };
    });
  };

  // Safety check for config
  if (!config) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Loading editor configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Welcome Screen Media
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Welcome Logo
            </label>
            <ImageUpload
              label="Logo"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("welcome_logo", e.target.value)}
              value={config?.welcome_logo || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Video (Welcome)
            </label>
            <VideoUpload
              label="Welcome Background"
              folder="/event/template/assets"
              onChange={(e) =>
                updateConfig("welcome_background_video", e.target.value)
              }
              value={config?.welcome_background_video || ""}
              acceptedFormats={[".webm", ".mp4"]}
            />
            <p className="text-xs text-gray-500 mt-1">
              WEBM format recommended for better compatibility
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening/Unboxing Video
            </label>
            <VideoUpload
              label="Unboxing Animation"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("unboxing_video", e.target.value)}
              value={config?.unboxing_video || ""}
              acceptedFormats={[".webm", ".mp4"]}
            />
            <p className="text-xs text-gray-500 mt-1">
              Video that plays when opening the invitation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Main Content Media
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Video (Main)
            </label>
            <VideoUpload
              label="Main Background"
              folder="/event/template/assets"
              onChange={(e) =>
                updateConfig("main_background_video", e.target.value)
              }
              value={config?.main_background_video || ""}
              acceptedFormats={[".webm", ".mp4"]}
            />
            <p className="text-xs text-gray-500 mt-1">
              Background video for main content
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Music
            </label>
            <AudioUpload
              label="Background Music"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("background_music", e.target.value)}
              value={config?.background_music || ""}
              acceptedFormats={[".mp3", ".wav", ".ogg"]}
            />
            <p className="text-xs text-gray-500 mt-1">
              Music that plays throughout the invitation
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Names & Title Image
            </label>
            <ImageUpload
              label="Names Banner"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("names_banner", e.target.value)}
              value={config?.names_banner || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invitation Message Image
            </label>
            <ImageUpload
              label="Invitation Image"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("invitation_image", e.target.value)}
              value={config?.invitation_image || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pre-Wedding Photo (Countdown Background)
            </label>
            <ImageUpload
              label="Pre-Wedding Photo"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("prewedding_photo", e.target.value)}
              value={config?.prewedding_photo || ""}
            />
          </div>
        </div>
      </div>

      {/* Event Schedule Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
          Event Schedule Images
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Image 1
            </label>
            <ImageUpload
              label="Schedule 1"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("schedule_image_1", e.target.value)}
              value={config?.schedule_image_1 || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Image 2
            </label>
            <ImageUpload
              label="Schedule 2"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("schedule_image_2", e.target.value)}
              value={config?.schedule_image_2 || ""}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Location
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Image/Map
            </label>
            <ImageUpload
              label="Location Map"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("location_image", e.target.value)}
              value={config?.location_image || ""}
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
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
          Photo Gallery
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gallery Photo {index + 1}
              </label>
              <ImageUpload
                label={`Photo ${index + 1}`}
                folder="/event/template/assets"
                onChange={(e) => updateGalleryPhoto(index, e.target.value)}
                value={config?.gallery_photos?.[index] || ""}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Messages Section */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          Messages Section
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Messages Header Image
            </label>
            <ImageUpload
              label="Messages Header"
              folder="/event/template/assets"
              onChange={(e) =>
                updateConfig("messages_header_image", e.target.value)
              }
              value={config?.messages_header_image || ""}
            />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="font-semibold text-base flex items-center">
          <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
          Decorative Elements
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Background
            </label>
            <ImageUpload
              label="Button Style"
              folder="/event/template/assets"
              onChange={(e) =>
                updateConfig("button_background", e.target.value)
              }
              value={config?.button_background || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name Bar Background
            </label>
            <ImageUpload
              label="Name Bar"
              folder="/event/template/assets"
              onChange={(e) => updateConfig("name_bar", e.target.value)}
              value={config?.name_bar || ""}
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Template Notes:</h5>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>This template uses videos and animations</li>
          <li>Videos should be in WEBM format for best compatibility</li>
          <li>Music should be in MP3 format</li>
          <li>All decorative images use traditional Khmer art styles</li>
          <li>Gallery supports 4 framed photos</li>
        </ul>
      </div>
    </div>
  );
}
