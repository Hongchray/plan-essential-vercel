"use client";

import { useEffect, useState } from "react";
import { Event } from "@/interfaces/event";
import { useLanguage } from "@/hooks/LanguageContext";
import Image from "next/image";
import AOS from "aos";
import { formatDateCustom } from "@/utils/date";
import { Guest } from "@/interfaces/guest";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { GuestStatus } from "@/enums/guests";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ScrollNavigationBar from "../scroll-navigation-bar";
import ScrollNavigationBarInPage from "../scroll-navigation-bar-in-page";
export default function SpecialTemplate({
  config,
  data,
}: {
  config: any;
  data: Event;
}) {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guest, setGuest] = useState<Guest>();
  const searchParams = useSearchParams();
  const guestId = searchParams.get("guest");

  const currentInvitation =
    currentLanguage === "kh"
      ? config?.invitation_kh || config?.invitation
      : config?.invitation_en || config?.invitation;

  const handleWelcomeClose = () => {
    setIsWelcomeOpen(false);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);
  // Play music when isOpen becomes true
  useEffect(() => {
    if (isOpen && !musicStarted) {
      const music = document.getElementById(
        "welcome-music"
      ) as HTMLAudioElement;
      if (music) {
        music.play().catch((err) => console.log("Audio play failed:", err));
        setMusicStarted(true);
      }
    }
  }, [isOpen, musicStarted]);

  // Handle welcome video close by detect video end
  useEffect(() => {
    const video = document.getElementById("welcome-video") as HTMLVideoElement;
    if (video) {
      video.addEventListener("ended", handleWelcomeClose);
    }
    return () => {
      if (video) {
        video.removeEventListener("ended", handleWelcomeClose);
      }
    };
  }, [handleWelcomeClose]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set your target date here (example: 7 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGuest = async (guestId: string, eventId: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/guest/${guestId}`);

      if (res.ok) {
        const data = await res.json();
        setGuest(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (guestId) {
      getGuest(guestId, data.id);
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/admin/event/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestId: guestId,
          name: data.name,
          message: data.message,
          number_guest: data.number_guest,
          status: data.status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      const result = await res.json();
      getMessage();
      toast.success("អ្នកបានផ្ញើសារជូនពរដោយជោគជ័យ");
    } catch (error) {
      toast.error("អ្នកបានផ្ញើសារជូនពបរាជ័យ");
    }
  };
  const getMessage = async () => {
    try {
      const res = await fetch(
        `/api/admin/event/preview/message?eventId=${data.id}`
      );
      if (!res.ok) {
        throw new Error("Failed to get message");
      }
      const response = await res.json();
      setGuests(response);
    } catch (error) {
      console.error("Error getting message:", error);
      return "";
    }
  };
  useEffect(() => {
    if (data.id) {
      getMessage();
    }
  }, [data]);

  const formSchema = z.object({
    name: z.string().optional(),
    message: z.string().min(1, "ត្រូវការសារជូនពរ"),
    number_guest: z.coerce.number().min(1, "ចំនួនភ្ញៀវ"),
    status: z.string().min(1, "ប្រាប់ពីការចូលរួម"),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      number_guest: 1,
      status: GuestStatus.CONFIRMED,
    },
  });
  return (
    <div className="relative min-h-screen max-w-xl mx-auto ">
      {/* Background music */}
      {isOpen && (
        <audio id="welcome-music" loop src="/template/audios/music1.mp3" />
      )}

      {/* Front evelop */}
      {!isOpen && (
        <div className="front-evelop h-screen">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover "
          >
            <source src="/template/videos/background1.webm" type="video/webm" />
          </video>

          {/* Overlay content */}
          <div className="relative z-10 flex items-center justify-around h-full flex-col gap-4 ">
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                src="/template/arts/tgt.png"
                alt="logo"
                width={200}
                height={200}
                className="animate-fade-up"
              />
              <h1
                className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent p-2 animate-fade-up-delay-100"
                style={{ fontFamily: "moul" }}
              >
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h1>

              <h2
                className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent p-1 animate-fade-up-delay-200"
                style={{ fontFamily: "moul" }}
              >
                សូមគោរពអញ្ជើញ
              </h2>
              <div
                className="mt-5 text-[16px] text-center min-w-[250px] md:min-w-[320px] min-h-[100px] max-h-[100px]  max-w-[600px] truncate inline-flex items-center justify-center px-3 hover:scale-105 transition-transform duration-300 animate-fade-up-delay-300"
                style={{
                  fontFamily: "moul",
                  backgroundImage: "url('/template/arts/bar-kbach.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  className="pt-3  min-w-[250px] md:min-w-[320px]  min-h-[80px] max-h-[100px]  max-w-[600px] truncate mx-8"
                  style={{
                    color: "white",
                    fontFamily: "moul",
                  }}
                >
                  លោក មករា​ និងភរិយា
                </span>
              </div>
            </div>

            <div className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] animate-fade-up-delay-400 mb-8">
              <button
                onClick={() => setIsOpen(true)}
                className="animate-zoom-in-out cursor-pointer transform md:text-[14px] text-center w-[200px] md:w-[280px] md:h-[50px] inline-block px-3 py-2 hover:scale-110 transition-all duration-300"
                style={{
                  color: "white",
                  fontFamily: "moul",
                  backgroundImage: "url('/template/arts/button-kbach.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                }}
              >
                {currentLanguage === "kh"
                  ? "សូមចុចដើម្បីបើកសំបុត្រ"
                  : "Please click to open"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome video */}
      {isOpen && isWelcomeOpen && (
        <div className="welcome-video h-screen">
          {/* Background video */}
          <video
            id="welcome-video"
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/template/videos/unboxing1.webm" type="video/webm" />
          </video>
        </div>
      )}

      {/* Main content */}
      {isOpen && !isWelcomeOpen && (
        <div className="front-evelop h-screen relative overflow-hidden">
          <ScrollNavigationBarInPage />

          {/* Background video - stays in place within container */}
          <div className="absolute top-0 left-0 w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="/template/videos/background2.webm"
                type="video/webm"
              />
            </video>
          </div>

          {/* Scrollable content overlay */}
          <div
            className="relative z-10 h-full overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col items-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div id="main" className="flex flex-col items-center">
              {/* Groom and Bride Name */}
              <div className="flex flex-col items-center justify-center gap-4 animate-fade-up  mt-8">
                <Image
                  src="/template/contents/txt0.png"
                  alt="image"
                  width={600}
                  height={200}
                />
              </div>

              <div className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] animate-fade-up-delay-100 mb-8">
                <button
                  onClick={() => setIsOpen(true)}
                  className="animate-zoom-in-out cursor-pointer transform md:text-[14px] text-center w-[200px] md:w-[280px] md:h-[50px] inline-block px-3 py-2 hover:scale-110 transition-all duration-300"
                  style={{
                    color: "white",
                    fontFamily: "moul",
                    backgroundImage: "url('/template/arts/button-kbach.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "8px",
                  }}
                >
                  {currentLanguage === "kh"
                    ? "ដាក់ក្នុងប្រតិទិន"
                    : "Add to the calendar"}
                </button>
              </div>
            </div>
            {/* Invitation */}
            <div
              id="invitation"
              className="animate-fade-up-delay-200 fade-scroll"
            >
              <Image
                src="/template/contents/txt01.png"
                alt="image"
                width={600}
                height={200}
              />
            </div>
            {/* Countdown Event  */}
            <div className="w-full max-w-2xl mx-auto animate-fade-up-delay-300">
              <div className="relative w-full">
                <img
                  src="/template/contents/pre-wedding.jpg"
                  alt="Event countdown"
                  className="w-full h-auto object-cover rounded"
                />
                {/* Countdown */}
                <div className="absolute inset-0 flex items-start justify-center  bg-opacity-10 rounded pb-">
                  <div className="text-center text-white px-4 pt-8">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 tracking-wide">
                      ចំនួនថ្ងៃរាប់ថយក្រោយ
                    </h2>
                    <h3 className="text-lg md:text-xl font-semibold mb-6 text-white">
                      Event Countdown
                    </h3>

                    {/* Countdown Timer */}
                    <div className="flex gap-4 md:gap-6 justify-center">
                      <div className="flex flex-col items-center bg-[#A5AE79]/70 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px]">
                        <span className="text-3xl md:text-3xl font-bold">
                          {timeLeft.days}
                        </span>
                        <span
                          className="text-xs md:text-sm uppercase mt-1"
                          style={{ fontFamily: "moul" }}
                        >
                          ថ្ងៃ
                        </span>
                      </div>

                      <div className="flex flex-col items-center bg-[#A5AE79]/70 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px]">
                        <span className="text-2xl md:text-3xl font-bold">
                          {timeLeft.hours}
                        </span>
                        <span
                          className="text-xs md:text-sm uppercase mt-1"
                          style={{ fontFamily: "moul" }}
                        >
                          ម៉ោង
                        </span>
                      </div>

                      <div className="flex flex-col items-center bg-[#A5AE79]/70 bg-opacity-20 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px]">
                        <span className="text-2xl md:text-3xl font-bold">
                          {timeLeft.minutes}
                        </span>
                        <span
                          className="text-xs md:text-sm uppercase mt-1"
                          style={{ fontFamily: "moul" }}
                        >
                          នាទី
                        </span>
                      </div>

                      <div className="flex flex-col items-center bg-[#A5AE79]/70 bg-opacity-20 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px]">
                        <span className="text-2xl md:text-3xl font-bold">
                          {timeLeft.seconds}
                        </span>
                        <span
                          className="text-xs md:text-sm uppercase mt-1"
                          style={{ fontFamily: "moul" }}
                        >
                          វិនាទី
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Event Agenda */}
            <div id="schedule" className="py-5">
              <h2
                className="text-2xl font-semibold text-center  animate-slide-down py-2"
                style={{ color: "#dfab24", fontFamily: "moul" }}
              >
                {currentInvitation?.details_title ||
                  (currentLanguage === "kh"
                    ? "របៀបវារៈកម្មវិធី"
                    : "EVENT AGENDA")}
              </h2>
              <div className="animate-fade-up-delay-400">
                <Image
                  src="/template/contents/txt02.png"
                  alt="image"
                  width={600}
                  height={200}
                />
              </div>
              <div className="animate-fade-up-delay-500">
                <Image
                  src="/template/contents/txt02.1.png"
                  alt="image"
                  width={600}
                  height={200}
                />
              </div>
            </div>

            {/* Location */}
            <div
              id="location"
              className="animate-fade-up flex flex-col items-center"
            >
              <h2
                className="text-2xl font-semibold text-center  animate-slide-down py-2"
                style={{ color: "#dfab24", fontFamily: "moul" }}
              >
                {currentInvitation?.details_title ||
                  (currentLanguage === "kh"
                    ? "ទីតាំងប្រារព្ធកម្មវិធី"
                    : "EVENT LOCATION")}
              </h2>
              <Image
                src="/template/contents/txt3.png"
                alt="image"
                width={600}
                height={200}
              />

              <div className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] animate-fade-up-delay-100 mb-8">
                <button
                  onClick={() => setIsOpen(true)}
                  className="animate-zoom-in-out cursor-pointer transform md:text-[14px] text-center w-[200px] md:w-[280px] md:h-[50px] inline-block px-3 py-2 hover:scale-110 transition-all duration-300"
                  style={{
                    color: "white",
                    fontFamily: "moul",
                    backgroundImage: "url('/template/arts/button-kbach.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "8px",
                  }}
                >
                  {currentLanguage === "kh"
                    ? "បើកមើលក្នុង Google Map"
                    : "Google Map"}
                </button>
              </div>
            </div>
            {/* Gallery */}
            <div id="gallery">
              <h2
                className="text-2xl font-semibold text-center  animate-slide-down py-2"
                style={{ color: "#dfab24", fontFamily: "moul" }}
              >
                {currentInvitation?.details_title ||
                  (currentLanguage === "kh" ? "វិចិត្រសាល" : "GALLERY")}
              </h2>
              <div className="grid grid-cols-2 gap-4 p-2">
                <div data-aos="fade-up">
                  <Image
                    src="/template/groom_bride/Frame-Photo 1.png"
                    data-aos="fade-up"
                    data-aos-anchor-placement="center-center"
                    alt="image"
                    width={280}
                    height={200}
                  />
                </div>
                <div className="animate-fade-up-delay-200">
                  <Image
                    src="/template/groom_bride/Frame-Photo 2.png"
                    alt="image"
                    width={280}
                    height={200}
                  />
                </div>
                <div className="animate-fade-up-delay-300">
                  <Image
                    src="/template/groom_bride/Frame-Photo 1.png"
                    alt="image"
                    width={280}
                    height={200}
                  />
                </div>
                <div className="animate-fade-up-delay-400">
                  <Image
                    src="/template/groom_bride/Frame-Photo 2.png"
                    alt="image"
                    width={280}
                    height={200}
                  />
                </div>
              </div>
            </div>
            {/* Messages */}

            <div className="animate-fade-up">
              <Image
                src="/template/contents/txt5.png"
                alt="image"
                width={600}
                height={200}
              />
            </div>
            {/* wishing comments */}
            {/* Greeting Messages */}
            <div
              id="messages"
              className="mt-5 mx-auto w-full md:px-5 flex flex-col items-center animate-fade-in-up animation-delay-1600"
            >
              <h2
                className="text-2xl font-semibold text-center  animate-slide-down py-2"
                style={{ color: "#dfab24", fontFamily: "moul" }}
              >
                {currentInvitation?.details_title ||
                  (currentLanguage === "kh" ? "សារជូនពរ" : "GREETING MESSAGE")}
              </h2>

              {/* Form Send */}
              {guestId && (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3 sm:space-y-4 py-5 w-full px-5 flex flex-col items-center animate-fade-in animation-delay-300"
                >
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[#A5AE79]/30 border-0 focus-visible:ring-0 rounded-lg text-[#A5AE79] placeholder:text-[#A5AE79] w-full hover:bg-[#A5AE79]/40 focus:scale-105 transition-all duration-300">
                          <SelectValue
                            className="text-[#A5AE79] placeholder:text-[#A5AE79]"
                            placeholder={
                              currentLanguage === "kh"
                                ? "តើអ្នកចូលរួមអត់?"
                                : "Will you attend?"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={GuestStatus.CONFIRMED}>
                            {currentLanguage === "kh" ? "ចូលរួម" : "Attending"}
                          </SelectItem>
                          <SelectItem value={GuestStatus.REJECTED}>
                            {currentLanguage === "kh"
                              ? "បដិសេធ"
                              : "Cannot attend"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    {...form.register("number_guest")}
                    placeholder={
                      currentLanguage === "kh"
                        ? "ចំនួនភ្ញៀវចូលរួម"
                        : "Number of guests"
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
                  <div className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] animate-fade-up-delay-100 mb-8">
                    <button
                      type="submit"
                      className="animate-zoom-in-out cursor-pointer transform md:text-[14px] text-center w-[200px] md:w-[280px] md:h-[50px] inline-block px-3 py-2 hover:scale-110 transition-all duration-300"
                      style={{
                        color: "white",
                        fontFamily: "moul",
                        backgroundImage:
                          "url('/template/arts/button-kbach.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                      }}
                    >
                      {currentLanguage === "kh" ? "ផ្ញើរ" : "Send"}
                    </button>
                  </div>
                </form>
              )}

              <div className="p-5 w-full flex flex-col gap-2 animate-fade-in animation-delay-500">
                {guests &&
                  guests.map((guest, key) => {
                    return (
                      <div
                        key={key}
                        className="bg-[#A5AE79]/30 p-5 rounded-lg hover:bg-[#A5AE79]/40 hover:scale-105 transition-all duration-300 animate-slide-in-left"
                      >
                        <div className="text-[#A5AE79] text-lg">
                          {guest?.name}
                        </div>
                        <div className="border-b-2 border-[#A5AE79]/80"></div>
                        <div className="text-center text-[#A5AE79] pt-5 text-lg">
                          "{guest?.wishing_note}"
                        </div>
                        <div className="text-center text-[#A5AE79] pt-5 text-xs">
                          {formatDateCustom(
                            guest?.sentAt ?? "",
                            "DD-MM-YYYY | HH:mmA"
                          )}
                        </div>
                      </div>
                    );
                  })}
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
          </div>
        </div>
      )}
    </div>
  );
}
