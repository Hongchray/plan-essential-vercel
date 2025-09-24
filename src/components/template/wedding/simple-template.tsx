import { useState } from "react";
import { Event } from "@/interfaces/event";
import Link from "next/link";
import Image from "next/image";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SimpleTemplate({
  config,
  data,
}: {
  config: any;
  data: Event;
}) {
  const [currentLanguage, setCurrentLanguage] = useState<"kh" | "en">("kh");

  // Get the current invitation data based on selected language
  const currentInvitation =
    currentLanguage === "kh"
      ? config?.invitation_kh || config?.invitation
      : config?.invitation_en || config?.invitation;

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "kh" ? "en" : "kh"));
  };

  const onSubmit = async (data: FormData) => {};

  const formSchema = z.object({
    name: z.string().min(1, "ត្រូវការឈ្មោះ"),
    message: z.string().min(1, "ត្រូវការសារជូនពរ"),
    number_guest: z.number().min(1, "ចំនួនភ្ញៀវ"),
    status: z.string().min(1, "ប្រាប់ពីការចូលរួម"),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      number_guest: 1,
      status: "confirmed",
    },
  });

  return (
    <div className="relative">
      {/* Language Switch Button - Fixed position with animation */}
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <button
          onClick={toggleLanguage}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2  hover:bg-white/95 hover:scale-105 transform transition-all duration-300 flex items-center gap-2"
        >
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-medium transition-opacity duration-300 ${
                currentLanguage === "kh" ? "opacity-100" : "opacity-50"
              }`}
            >
              ខ្មែរ
            </span>
            <div className="relative w-8 h-4 bg-gray-200 rounded-full">
              <div
                className={`absolute top-0.5 w-3 h-3 bg-current rounded-full transition-transform duration-300 ease-in-out ${
                  currentLanguage === "en"
                    ? "transform translate-x-4"
                    : "transform translate-x-0.5"
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium transition-opacity duration-300 ${
                currentLanguage === "en" ? "opacity-100" : "opacity-50"
              }`}
            >
              EN
            </span>
          </div>
        </button>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Main Header Card */}
        <div
          className="relative h-[600px] bg-cover bg-center flex flex-col justify-start items-center text-center px-6  overflow-hidden w-full py-8 animate-fade-in-up"
          style={{
            backgroundImage: `url(${currentInvitation?.main_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 space-y-2 flex flex-col justify-between h-full">
            <div className="animate-slide-down">
              <h1
                className="text-xl md:text-3xl font-bold drop- "
                style={{
                  color: config?.primaryColor,
                  fontFamily: "Great Vibes, Moul, sans-serif",
                  textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
                }}
              >
                {currentInvitation?.main_title}
              </h1>
              <div className="flex items-center justify-center gap-2 pt-9 animate-fade-in-up animation-delay-300">
                <div
                  className="text-xl font-semibold drop- hover:scale-110 transition-transform duration-300"
                  style={{
                    color: config?.primaryColor,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    fontFamily: "Great Vibes, Moul, sans-serif",
                  }}
                >
                  {currentInvitation?.groom_name || data.groom}
                </div>
                <div
                  className="text-lg "
                  style={{
                    color: config?.primaryColor,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  }}
                >
                  <span
                    className="text-md"
                    style={{
                      fontFamily: "Great Vibes, Kantumruy Pro, sans-serif",
                    }}
                  >
                    {currentLanguage === "kh" ? "ជាគូនឹង" : "&"}
                  </span>
                </div>
                <div
                  className="text-xl font-semibold drop- hover:scale-110 transition-transform duration-300"
                  style={{
                    color: config?.primaryColor,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    fontFamily: "Great Vibes, Moul, sans-serif",
                  }}
                >
                  {currentInvitation?.bride_name || data.bride}
                </div>
              </div>
            </div>
            <div className="animate-slide-up animation-delay-500">
              <p
                className="text-[12px] drop- pt-8"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontFamily: "Great Vibes, Moul, sans-serif",
                }}
              >
                {currentInvitation?.subtitle}
              </p>

              <div
                className="text-[16px] text-center w-[280px] h-[80px] inline-flex items-center justify-center px-3 hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{
                  fontFamily: "moul",
                  backgroundImage: "url('/template/arts/bar-kbach.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.7)",
                }}
              >
                <span className="pb-4 text-white">លោក ហុង</span>
              </div>
              <p
                className="text-[12px] drop- animate-fade-in animation-delay-700"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontFamily: "Great Vibes, Kantumruy Pro, sans-serif",
                }}
              >
                {currentInvitation?.date_time}
              </p>

              <p
                className="text-[12px] drop- animate-fade-in animation-delay-1000"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontFamily: "Great Vibes, Kantumruy Pro, sans-serif",
                }}
              >
                {currentInvitation?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Invitation Message Card */}
        <div className="p-6 text-center animate-fade-in-up animation-delay-300 hover: transition-shadow duration-300">
          <h2
            className="text-lg font-semibold mb-4 animate-slide-in-left"
            style={{ color: config?.textColor, fontFamily: "moul" }}
          >
            {currentInvitation?.invitation_title}
          </h2>
          <p
            className="leading-relaxed animate-fade-in animation-delay-500"
            style={{ color: config?.textColor }}
          >
            {currentInvitation?.invitation_message}
          </p>
        </div>

        {/* Event Details Card */}
        <div
          className="relative min-h-[600px] bg-cover bg-center  overflow-hidden animate-fade-in-up animation-delay-700"
          style={{
            backgroundImage: `url(${currentInvitation?.details_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-opacity-90"></div>

          <div className="relative z-10 p-6 bg-black/10 backdrop-blur-[2px]">
            <h2
              className="text-lg font-semibold text-center mb-4 animate-slide-down"
              style={{ color: config?.textColor, fontFamily: "moul" }}
            >
              {currentInvitation?.details_title ||
                (currentLanguage === "kh"
                  ? "របៀបវីរៈកម្មវិធី"
                  : "EVENT AGENDA")}
            </h2>

            {data?.schedules?.map((schedule: any, scheduleIndex: number) => (
              <div
                key={schedule.id}
                className={`mb-6 p-4 flex flex-col items-center animate-fade-in-up animation-delay-${
                  (scheduleIndex + 1) * 200
                }`}
              >
                {/* Shifts */}
                {schedule.shifts?.map((shift: any, shiftIndex: number) => (
                  <div key={shift.id} className="mb-4">
                    {/* Optional: Show shift name/date */}
                    <p
                      className={`text-xs text-center mb-2 animate-slide-in-left animation-delay-${
                        (shiftIndex + 1) * 100
                      }`}
                      style={{ color: config.textColor, fontFamily: "moul" }}
                    >
                      {shift.name}
                    </p>

                    <div className="space-y-3 text-sm">
                      {shift.timeLine?.map(
                        (timeline: any, timelineIndex: number) => (
                          <div
                            key={timeline.id}
                            className={`flex flex-col text-[10px] text-center gap-2 items-center hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-${
                              (timelineIndex + 1) * 150
                            }`}
                          >
                            <div className="">
                              <Image
                                src="/template/arts/under-style1.png"
                                alt=""
                                width={80}
                                height={100}
                                className="hover:rotate-6 transition-transform duration-300"
                              />
                            </div>

                            <span
                              className="animate-pulse-soft"
                              style={{
                                color: config.textColor,
                                fontFamily: "moulpali",
                              }}
                            >
                              វេលាម៉ោង {timeline.time}
                            </span>
                            <span
                              style={{
                                color: config.textColor,
                                fontFamily: "moulpali",
                              }}
                            >
                              {timeline.name}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
                <div className="mx-auto animate-fade-in-up animation-delay-1000">
                  <Image
                    src="/template/arts/underbar kbach 1.png"
                    alt=""
                    width={200}
                    height={150}
                    className="hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Location */}
      <div className="mt-5 mx-auto max-w-md flex flex-col items-center animate-fade-in-up animation-delay-1200">
        <h2
          className="text-lg font-semibold text-center mb-4 animate-slide-in-left"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          {currentLanguage === "kh" ? "ទីតាំងកម្មវិធី" : "EVENT LOCATION"}
        </h2>
        {config?.event_location && (
          <div className="animate-zoom-in animation-delay-300">
            <Image
              src={config?.event_location}
              alt="map"
              width={500}
              height={450}
              className="hover:scale-105 transition-transform duration-300  rounded-lg"
            />
          </div>
        )}

        <div className="text-[10px] text-center w-[200px] h-auto animate-fade-in animation-delay-500">
          <Link
            href={config?.map_url || ""}
            target="_blank"
            className="text-[12px] text-center w-[200px] h-auto inline-block px-3 py-2 hover:scale-110 hover: transform transition-all duration-300"
            style={{
              color: "white",
              fontFamily: "moul",
              backgroundImage: "url('/template/arts/button-kbach.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "inline-block",
              borderRadius: "8px",
            }}
          >
            {currentLanguage === "kh"
              ? "មើលក្នុង Google Map"
              : "View in Google Map"}
          </Link>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="mt-5 mx-auto max-w-md flex flex-col items-center animate-fade-in-up animation-delay-1400">
        <h2
          className="text-lg font-semibold text-center mb-4 animate-slide-in-right"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          {currentLanguage === "kh" ? "កម្រងរូបភាព" : "PHOTOS"}
        </h2>

        {/* Display photos from config if available, otherwise use default */}
        {config?.photo_gallary?.photo1 && (
          <div className="py-2 animate-fade-in-up animation-delay-300">
            <Image
              src={config.photo_gallary.photo1}
              alt="Photo 1"
              width={200}
              height={150}
              className="hover:scale-110 hover:rotate-2 transition-all duration-300  rounded-lg"
            />
          </div>
        )}

        {config?.photo_gallary?.photo2 && (
          <div className="py-2 animate-fade-in-up animation-delay-500">
            <Image
              src={config.photo_gallary.photo2}
              alt="Photo 2"
              width={200}
              height={150}
              className="hover:scale-110 hover:-rotate-2 transition-all duration-300  rounded-lg"
            />
          </div>
        )}

        {config?.photo_gallary?.photo3 && (
          <div className="py-2 animate-fade-in-up animation-delay-700">
            <Image
              src={config.photo_gallary.photo3}
              alt="Photo 3"
              width={200}
              height={150}
              className="hover:scale-110 hover:rotate-1 transition-all duration-300  rounded-lg"
            />
          </div>
        )}

        {config?.photo_gallary?.photo4 && (
          <div className="py-2 animate-fade-in-up animation-delay-900">
            <Image
              src={config.photo_gallary.photo4}
              alt="Photo 4"
              width={200}
              height={150}
              className="hover:scale-110 hover:-rotate-1 transition-all duration-300  rounded-lg"
            />
          </div>
        )}

        <div className="py-2 animate-fade-in animation-delay-1100">
          <Image
            src="/template/arts/underbar kbach 1.png"
            alt=""
            width={200}
            height={150}
            className="hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Greeting Messages */}
      <div className="mt-5 mx-auto max-w-md flex flex-col items-center animate-fade-in-up animation-delay-1600">
        <h2
          className="text-lg font-semibold text-center mb-4 animate-slide-in-left"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          {currentLanguage === "kh" ? "សារជូនពរ" : "GREETING MESSAGE"}
        </h2>

        {/* Form Send */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4 py-5 w-full px-5 flex flex-col items-center animate-fade-in animation-delay-300"
        >
          <Input
            {...form.register("name")}
            placeholder={currentLanguage === "kh" ? "ឈ្មោះ" : "Name"}
            className="bg-[#A5AE79]/30 border-0 focus-visible:ring-0 rounded-lg text-[#A5AE79] placeholder:text-[#A5AE79] w-full hover:bg-[#A5AE79]/40 focus:scale-105 transition-all duration-300"
          />
          <Select {...form.register("status")}>
            <SelectTrigger className="bg-[#A5AE79]/30 border-0 focus-visible:ring-0 rounded-lg text-[#A5AE79] placeholder:text-[#A5AE79] w-full hover:bg-[#A5AE79]/40 focus:scale-105 transition-all duration-300">
              <SelectValue
                placeholder={
                  currentLanguage === "kh"
                    ? "តើអ្នកចូលរួមអត់?"
                    : "Will you attend?"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">
                {currentLanguage === "kh" ? "ចូលរួម" : "Attending"}
              </SelectItem>
              <SelectItem value="rejected">
                {currentLanguage === "kh" ? "បដិសេធ" : "Cannot attend"}
              </SelectItem>
            </SelectContent>
          </Select>
          <Input
            {...form.register("number_guest")}
            placeholder={
              currentLanguage === "kh" ? "ចំនួនភ្ញៀវចូលរួម" : "Number of guests"
            }
            type="number"
            className="bg-[#A5AE79]/30 border-0 focus-visible:ring-0 rounded-lg text-[#A5AE79] placeholder:text-[#A5AE79] w-full hover:bg-[#A5AE79]/40 focus:scale-105 transition-all duration-300"
          />
          <Textarea
            {...form.register("message")}
            placeholder={
              currentLanguage === "kh" ? "សារជូនពរ" : "Greeting message"
            }
            className="bg-[#A5AE79]/30 border-0 focus-visible:ring-0 rounded-lg text-[#A5AE79] placeholder:text-[#A5AE79] w-full hover:bg-[#A5AE79]/40 focus:scale-105 transition-all duration-300"
          />
          <div className="text-[10px] text-center w-[200px] h-auto">
            <button
              type="submit"
              className="text-[12px] text-center w-[200px] h-auto inline-block px-3 py-2 hover:scale-110 transform transition-all duration-300 active:scale-95"
              style={{
                color: "white",
                fontFamily: "moul",
                backgroundImage: "url('/template/arts/button-kbach.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "inline-block",
                borderRadius: "8px",
              }}
            >
              {currentLanguage === "kh" ? "ផ្ញើរ" : "Send"}
            </button>
          </div>
        </form>

        <div className="p-5 w-full flex flex-col gap-2 animate-fade-in animation-delay-500">
          <div className="bg-[#A5AE79]/30 p-5 rounded-lg hover:bg-[#A5AE79]/40 hover:scale-105 transition-all duration-300 animate-slide-in-left">
            <div className="text-[#A5AE79]">Mafixnsa</div>
            <div className="border-b border-[#A5AE79]"></div>
            <div className="text-center text-[#A5AE79] pt-5">
              "Congratulations to you Sophat and Vouch 🤵‍♂️👰💍 May your journey
              together be filled with endless love, laughter, and happiness.
              Wishing you both a lifetime of shared dreams, cherished moments,
              and unwavering support for one another. Here's to a beautiful
              beginning and a future filled with joy!"
            </div>
            <div className="text-center text-[#A5AE79] pt-5 text-xs">
              18-09-2025 | 01:03PM
            </div>
          </div>
          <div className="bg-[#A5AE79]/30 p-5 rounded-lg hover:bg-[#A5AE79]/40 hover:scale-105 transition-all duration-300 animate-slide-in-right animation-delay-300">
            <div className="text-[#A5AE79]">បរមី</div>
            <div className="border-b border-[#A5AE79]"></div>
            <div className="text-center text-[#A5AE79] pt-5">"អបអរសាទរ"</div>
            <div className="text-center text-[#A5AE79] pt-5 text-xs">
              18-09-2025 | 01:03PM
            </div>
          </div>
        </div>

        <div className="py-2 animate-fade-in animation-delay-800">
          <Image
            src="/template/arts/underbar kbach 1.png"
            alt=""
            width={200}
            height={150}
            className="hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoom-in 1s ease-out forwards;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
        .animation-delay-1400 {
          animation-delay: 1.4s;
        }
        .animation-delay-1600 {
          animation-delay: 1.6s;
        }

        /* Initially hide animated elements */
        .animate-fade-in,
        .animate-fade-in-up,
        .animate-slide-down,
        .animate-slide-up,
        .animate-slide-in-left,
        .animate-slide-in-right,
        .animate-zoom-in {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
