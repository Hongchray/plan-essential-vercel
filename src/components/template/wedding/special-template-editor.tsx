import ImageUpload from "@/components/composable/upload/upload-image";
import VideoUpload from "@/components/composable/upload/upload-video";
import AudioUpload from "@/components/composable/upload/upload-audio";
import React from "react";
import { TemplateEditorProps } from "@/interfaces/comon/template-editor-prop";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Image,
  Video,
  Music,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  Play,
  QrCode,
} from "lucide-react";

export default function SpecialTemplateEditor({
  config,
  setConfig,
}: TemplateEditorProps) {
  const { t } = useTranslation("common");

  const updateConfig = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  if (!config) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Loading editor configuration...</p>
      </div>
    );
  }

  const musics = [
    { label: "Music 1", value: "/template/audios/music1.mp3" },
    { label: "Music 2", value: "/template/audios/music2.mp3" },
    { label: "Music 3", value: "/template/audios/music3.mp3" },
    { label: "Music 4", value: "/template/audios/music4.mp3" },
    { label: "Music 5", value: "/template/audios/music5.mp3" },
    { label: "Music 6", value: "/template/audios/music6.mp3" },
  ];

  return (
    <div className="max-w-4xl mx-auto ">
      <Accordion
        type="multiple"
        defaultValue={["welcome"]}
        className="space-y-3"
      >
        {/* Welcome Section */}
        <AccordionItem value="welcome" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">Welcome Screen</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Welcome Logo</Label>
              <ImageUpload
                label="Logo"
                folder="/event/template/assets"
                onChange={(e) => updateConfig("welcome_logo", e.target.value)}
                value={config?.welcome_logo || ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Background Video</Label>
              <VideoUpload
                label="Welcome Background"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("welcome_background_video", e.target.value)
                }
                value={config?.welcome_background_video || ""}
                acceptedFormats={[".webm", ".mp4"]}
              />
              <p className="text-xs text-gray-500">WEBM format recommended</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Opening/Unboxing Video</Label>
              <VideoUpload
                label="Unboxing Animation"
                folder="/event/template/assets"
                onChange={(e) => updateConfig("unboxing_video", e.target.value)}
                value={config?.unboxing_video || ""}
                acceptedFormats={[".webm", ".mp4"]}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Main Content Section */}
        <AccordionItem value="content" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                <Image className="h-4 w-4 text-green-600" />
              </div>
              <span className="font-medium">Main Content</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Background Video</Label>
              <VideoUpload
                label="Main Background"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("main_background_video", e.target.value)
                }
                value={config?.main_background_video || ""}
                acceptedFormats={[".webm", ".mp4"]}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Background Music</Label>
              <AudioUpload
                label="Background Music"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("background_music", e.target.value)
                }
                value={config?.background_music || ""}
                acceptedFormats={[".mp3", ".wav", ".ogg"]}
              />
              <Select
                value={config?.background_music || ""}
                onValueChange={(val) => updateConfig("background_music", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Or choose preset music" />
                </SelectTrigger>
                <SelectContent>
                  {musics.map((music) => (
                    <SelectItem key={music.value} value={music.value}>
                      {music.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Names & Title Image</Label>
              <ImageUpload
                label="Names Banner"
                folder="/event/template/assets"
                onChange={(e) => updateConfig("names_banner", e.target.value)}
                value={config?.names_banner || ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Invitation Message Image</Label>
              <ImageUpload
                label="Invitation Image"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("invitation_image", e.target.value)
                }
                value={config?.invitation_image || ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Pre-Wedding Photo</Label>
              <ImageUpload
                label="Pre-Wedding Photo"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("prewedding_photo", e.target.value)
                }
                value={config?.prewedding_photo || ""}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Event Schedule Section */}
        <AccordionItem value="schedule" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <span className="font-medium">Event Schedule</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Schedule Image 1</Label>
                <ImageUpload
                  label="Schedule 1"
                  folder="/event/template/assets"
                  onChange={(e) =>
                    updateConfig("schedule_image_1", e.target.value)
                  }
                  value={config?.schedule_image_1 || ""}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Schedule Image 2</Label>
                <ImageUpload
                  label="Schedule 2"
                  folder="/event/template/assets"
                  onChange={(e) =>
                    updateConfig("schedule_image_2", e.target.value)
                  }
                  value={config?.schedule_image_2 || ""}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location Section */}
        <AccordionItem value="location" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="font-medium">Location</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Location Image/Map</Label>
              <ImageUpload
                label="Location Map"
                folder="/event/template/assets"
                onChange={(e) => updateConfig("location_image", e.target.value)}
                value={config?.location_image || ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Google Maps URL</Label>
              <Input
                type="url"
                value={config?.map_url || ""}
                onChange={(e) => updateConfig("map_url", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Photo Gallery Section */}
        <AccordionItem value="gallery" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-pink-50 flex items-center justify-center">
                <Image className="h-4 w-4 text-pink-600" />
              </div>
              <span className="font-medium">Photo Gallery</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-1.5">
                  <Label className="text-sm">Gallery Photo {index + 1}</Label>
                  <ImageUpload
                    label={`Photo ${index + 1}`}
                    folder="/event/template/assets"
                    onChange={(e) => updateGalleryPhoto(index, e.target.value)}
                    value={config?.gallery_photos?.[index] || ""}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Messages Section */}
        <AccordionItem value="messages" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="font-medium">Messages</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Messages Header Image</Label>
              <ImageUpload
                label="Messages Header"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("messages_header_image", e.target.value)
                }
                value={config?.messages_header_image || ""}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* KHQR Section */}
        <AccordionItem value="khqr" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                <QrCode className="h-4 w-4 text-red-600" />
              </div>
              <span className="font-medium">KHQR</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">KHQR Image</Label>
              <ImageUpload
                label="KHQR"
                folder="/event/template/assets"
                onChange={(e) => updateConfig("khqr", e.target.value)}
                value={config?.khqr || ""}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Decorative Elements */}
        <AccordionItem
          value="decorative"
          className="border rounded-lg bg-white"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium">Decorative Elements</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Button Background</Label>
              <ImageUpload
                label="Button Style"
                folder="/event/template/assets"
                onChange={(e) =>
                  updateConfig("button_background", e.target.value)
                }
                value={config?.button_background || ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Name Bar Background</Label>
              <ImageUpload
                label="Name Bar"
                folder="/event/template/assets"
                onChange={(e) => updateConfig("name_bar", e.target.value)}
                value={config?.name_bar || ""}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
