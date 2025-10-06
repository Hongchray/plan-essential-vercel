"use client";

import { useEffect, useMemo, useState } from "react";
import { Event } from "@/interfaces/event";
import { useLanguage } from "@/hooks/LanguageContext";
import Image from "next/image";
import { formatDateCustom } from "@/utils/date";
import { Guest } from "@/interfaces/guest";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { GuestStatus } from "@/enums/guests";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ScrollNavigationBarInPage from "../scroll-navigation-bar-in-page";
import { Footer } from "../footer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQRCode } from "next-qrcode";
import { Label } from "@/components/ui/label";

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
  const { Image: QRCodeImage } = useQRCode();
  const currentInvitation =
    currentLanguage === "kh"
      ? config?.invitation_kh || config?.invitation
      : config?.invitation_en || config?.invitation;

  const handleWelcomeClose = () => {
    setIsWelcomeOpen(false);
  };

  // Play music when isOpen becomes true
  useEffect(() => {
    if (isOpen && !musicStarted) {
      const music = document.getElementById(
        "welcome-music"
      ) as HTMLAudioElement;
      if (music) {
        // iOS requires user gesture, retry with delay
        const playAudio = async () => {
          try {
            await music.play();
            setMusicStarted(true);
          } catch (err) {
            console.log("Audio play failed, retrying...", err);
            // Retry after user has interacted
            setTimeout(() => {
              music.play().catch((e) => console.log("Audio retry failed:", e));
            }, 500);
          }
        };
        playAudio();
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

  useEffect(() => {
    // Preload critical assets
    if (config?.background_music) {
      const audio = new Audio(config.background_music);
      audio.preload = "auto";
    }

    if (config?.welcome_background_video) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = config.welcome_background_video;
    }
  }, [config]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!data?.startTime) return;

    const targetDate = new Date(data.startTime);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
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
  }, [data?.startTime]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  useEffect(() => {
    // Check if critical media is loaded
    const checkMediaLoaded = () => {
      const video = document.querySelector("video");
      const images = document.querySelectorAll("img");

      if (
        video &&
        video.readyState >= 3 &&
        Array.from(images).every((img) => img.complete)
      ) {
        setIsMediaLoading(false);
      }
    };

    const timer = setTimeout(checkMediaLoaded, 1000);
    return () => clearTimeout(timer);
  }, [config]);

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
      form.reset();
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

  // Animation variants for reusable animations
  const fadeUpVariant = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const scaleInVariant = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  };

  const slideInLeftVariant = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  };

  const slideInRightVariant = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const googleCalendarUrl = useMemo(() => {
    const formatDate = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d+/g, "");

    const startTime = formatDate(new Date(data.startTime));
    const endTime = formatDate(new Date(data.endTime));

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      data.name
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      data.description || ""
    )}&location=${encodeURIComponent(data.location || "")}`;
  }, [data]);

  return (
    <div className="relative min-h-screen max-w-xl mx-auto">
      {/* Background music */}
      {isOpen && config?.background_music && (
        <audio
          id="welcome-music"
          loop
          preload="auto"
          playsInline
          crossOrigin="anonymous"
        >
          <source src={config.background_music} type="audio/mpeg" />
          <source src={config.background_music} type="audio/mp3" />
        </audio>
      )}

      {/* Front envelope */}
      {!isOpen && (
        <div className="front-evelop h-screen">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src={config?.welcome_background_video} type="video/webm" />
            <source
              src={config?.welcome_background_video?.replace(".webm", ".mp4")}
              type="video/mp4"
            />
          </video>

          {/* Overlay content */}
          <div className="relative z-10 flex items-center justify-around h-full flex-col gap-4">
            <motion.div
              className="flex flex-col items-center justify-center gap-4"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeUpVariant}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src={config?.welcome_logo}
                  alt="logo"
                  width={200}
                  height={200}
                  className="drop-shadow-2xl"
                  priority
                  loading="eager"
                />
              </motion.div>

              <motion.h1
                className="text-3xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent p-2"
                style={{ fontFamily: "moul" }}
                variants={fadeUpVariant}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </motion.h1>

              <motion.h2
                className="text-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent p-1"
                style={{ fontFamily: "moul" }}
                variants={fadeUpVariant}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                សូមគោរពអញ្ជើញ
              </motion.h2>

              <motion.div
                className="mt-5 text-[16px] text-center min-w-[250px] md:min-w-[320px] min-h-[100px] max-h-[100px] max-w-[600px] truncate inline-flex items-center justify-center px-3"
                style={{
                  fontFamily: "moul",
                  backgroundImage: `url('${config?.name_bar}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
                }}
                variants={fadeUpVariant}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className="pt-3 min-w-[250px] md:min-w-[320px] min-h-[80px] max-h-[100px] max-w-[600px] truncate mx-8"
                  style={{
                    color: "white",
                    fontFamily: "moul",
                  }}
                >
                  {guest?.name}
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-[10px] text-center w-[250px] md:w-[280px] md:h-[50px] mb-8"
              variants={fadeUpVariant}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <motion.button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer transform md:text-[14px] text-center w-[250px] md:w-[280px] h-[50px] md:h-[50px] inline-block px-3 py-2"
                style={{
                  color: "white",
                  fontFamily: "moul",
                  backgroundImage: `url('${config?.button_background}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {currentLanguage === "kh"
                  ? "សូមចុចដើម្បីបើកសំបុត្រ"
                  : "Please click to open"}
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {/* Welcome video */}
        {isOpen && isWelcomeOpen && (
          <motion.div
            key="welcome-video"
            className="welcome-video h-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <video
              id="welcome-video"
              autoPlay
              playsInline
              muted={false}
              preload="auto"
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              <source src={config?.unboxing_video} type="video/webm" />
              <source
                src={config?.unboxing_video?.replace(".webm", ".mp4")}
                type="video/mp4"
              />
            </video>
          </motion.div>
        )}

        {/* Main content */}

        {isOpen && !isWelcomeOpen && (
          <motion.div
            className="front-evelop h-screen relative overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <ScrollNavigationBarInPage />

            {/* Background video */}
            <div className="absolute top-0 left-0 w-full h-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              >
                <source src={config?.main_background_video} type="video/webm" />
                <source
                  src={config?.main_background_video?.replace(".webm", ".mp4")}
                  type="video/mp4"
                />
              </video>
            </div>

            {/* Scrollable content overlay */}
            <div
              id="scroll-container"
              className="relative z-10 h-full overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col items-center"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <motion.div
                id="main"
                className="flex flex-col items-center w-full"
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, margin: "-50px" }}
                variants={staggerContainer}
              >
                {/* Groom and Bride Name */}
                <motion.div
                  className="flex flex-col items-center justify-center gap-4 mt-8"
                  variants={fadeUpVariant}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={config?.names_banner}
                    alt="image"
                    width={600}
                    height={200}
                    priority={true}
                  />
                </motion.div>

                <motion.div
                  className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] mb-8"
                  variants={fadeUpVariant}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.button
                    className="cursor-pointer transform md:text-[14px] text-center w-[200px] md:w-[280px] md:h-[50px] inline-block px-3 py-2"
                    style={{
                      color: "white",
                      fontFamily: "moul",
                      backgroundImage: `url('${config?.button_background}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",

                      borderRadius: "8px",
                    }}
                    onClick={() => window.open(googleCalendarUrl, "_blank")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentLanguage === "kh"
                      ? "ដាក់ក្នុងប្រតិទិន"
                      : "Add to the calendar"}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Invitation */}
              <motion.div
                id="invitation"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src={config?.invitation_image}
                  alt="image"
                  width={600}
                  height={200}
                  loading="lazy"
                />
              </motion.div>

              {/* Countdown Event */}
              <motion.div
                className="w-full max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="relative w-full">
                  <motion.img
                    src={config?.prewedding_photo}
                    alt="Event countdown"
                    className="w-full h-auto object-cover rounded"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Countdown */}
                  <div className="absolute inset-0 flex items-start justify-center bg-opacity-10 rounded">
                    <div className="text-center text-white px-4 pt-8">
                      <motion.h2
                        className="text-2xl md:text-4xl font-bold mb-2 tracking-wide"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6 }}
                      >
                        ចំនួនថ្ងៃរាប់ថយក្រោយ
                      </motion.h2>
                      <motion.h3
                        className="text-lg md:text-xl font-semibold mb-6 text-white"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        Event Countdown
                      </motion.h3>

                      {/* Countdown Timer */}
                      <motion.div
                        className="flex gap-4 md:gap-6 justify-center"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: false }}
                      >
                        {[
                          { value: timeLeft.days, label: "ថ្ងៃ" },
                          { value: timeLeft.hours, label: "ម៉ោង" },
                          { value: timeLeft.minutes, label: "នាទី" },
                          { value: timeLeft.seconds, label: "វិនាទី" },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex flex-col items-center bg-[#A5AE79]/70 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px]"
                            variants={scaleInVariant}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                          >
                            <span className="text-3xl md:text-3xl font-bold">
                              {item.value}
                            </span>
                            <span
                              className="text-xs md:text-sm uppercase mt-1"
                              style={{ fontFamily: "moul" }}
                            >
                              {item.label}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Event Agenda */}
              <motion.div
                id="schedule"
                className="py-5 w-full"
                initial="initial"
                whileInView="animate"
                viewport={{ once: false }}
                variants={staggerContainer}
              >
                <motion.h2
                  className="text-2xl  text-center py-2"
                  style={{ color: "#dfab24", fontFamily: "moul" }}
                  variants={fadeUpVariant}
                >
                  {currentInvitation?.details_title ||
                    (currentLanguage === "kh"
                      ? "របៀបវារៈកម្មវិធី"
                      : "EVENT AGENDA")}
                </motion.h2>

                <motion.div variants={slideInLeftVariant}>
                  <Image
                    src={config?.schedule_image_1}
                    alt="image"
                    width={600}
                    height={200}
                  />
                </motion.div>

                <motion.div variants={slideInRightVariant}>
                  <Image
                    src={config?.schedule_image_2}
                    alt="image"
                    width={600}
                    height={200}
                  />
                </motion.div>
              </motion.div>

              {/* Location */}
              <motion.div
                id="location"
                className="flex flex-col items-center w-full"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2
                  className="text-2xl  text-center py-2"
                  style={{ color: "#dfab24", fontFamily: "moul" }}
                >
                  {currentInvitation?.details_title ||
                    (currentLanguage === "kh"
                      ? "ទីតាំងប្រារព្ធកម្មវិធី"
                      : "EVENT LOCATION")}
                </motion.h2>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="py-5 px-5 "
                >
                  <Image
                    src={config?.location_image}
                    alt="image"
                    className="rounded-lg  overflow-hidden"
                    width={600}
                    height={200}
                  />
                </motion.div>

                <motion.div className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] mb-8">
                  <motion.button
                    onClick={() => window.open(config?.map_url, "_blank")}
                    className="cursor-pointer transform md:text-[14px] text-center w-[200px] md:w-[280px] md:h-[50px] inline-block px-3 py-2"
                    style={{
                      color: "white",
                      fontFamily: "moul",
                      backgroundImage: `url('${config?.button_background}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "8px",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentLanguage === "kh"
                      ? "បើកមើលក្នុង Google Map"
                      : "Google Map"}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Gallery */}
              <motion.div
                id="gallery"
                className="w-full"
                initial="initial"
                whileInView="animate"
                viewport={{ once: false }}
              >
                <motion.h2
                  className="text-2xl  text-center py-2"
                  style={{ color: "#dfab24", fontFamily: "moul" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6 }}
                >
                  {currentInvitation?.details_title ||
                    (currentLanguage === "kh" ? "វិចិត្រសាល" : "GALLERY")}
                </motion.h2>

                <motion.div
                  className="grid grid-cols-2 gap-4 p-2"
                  variants={staggerContainer}
                >
                  {(config?.gallery_photos || []).map(
                    (src: string, index: number) => (
                      <motion.div
                        key={index}
                        variants={scaleInVariant}
                        whileHover={{
                          scale: 1.05,
                          rotate: index % 2 === 0 ? -1 : 1,
                          transition: { duration: 0.3 },
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={src}
                          alt={`Gallery image ${index + 1}`}
                          width={280}
                          height={200}
                          className="rounded-lg"
                          loading="lazy"
                          quality={85}
                          sizes="(max-width: 768px) 45vw, 280px"
                        />
                      </motion.div>
                    )
                  )}
                </motion.div>
              </motion.div>

              {/* Messages Header */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={config?.messages_header_image}
                  alt="image"
                  width={600}
                  height={200}
                />
              </motion.div>

              <div id="khqr">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                  className="py-5"
                >
                  <motion.h2
                    className="text-2xl  text-center py-4"
                    style={{ color: "#dfab24", fontFamily: "moul" }}
                  >
                    ចងដៃតាមរយៈ KHQR
                  </motion.h2>
                  <Image
                    src={config?.khqr}
                    alt="image"
                    width={300}
                    height={200}
                  />
                </motion.div>
                {/* QR Code */}
                {guestId && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="py-5"
                  >
                    <motion.h2
                      className="text-2xl  text-center py-4"
                      style={{ color: "#dfab24", fontFamily: "moul" }}
                      variants={fadeUpVariant}
                    >
                      QRCode ភ្ញៀវ
                    </motion.h2>
                    <QRCodeImage
                      text={guestId}
                      options={{
                        type: "image/jpeg",
                        quality: 1,
                        errorCorrectionLevel: "H",
                        margin: 3,
                        scale: 1,
                        width: 300,
                        color: {
                          dark: "#dfab24",
                          light: "#FFFFFF",
                        },
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Greeting Messages */}
              <motion.div
                id="messages"
                className="mt-5 mx-auto w-full md:px-5 flex flex-col items-center"
                initial="initial"
                whileInView="animate"
                viewport={{ once: false }}
                variants={staggerContainer}
              >
                <motion.h2
                  className="text-2xl  text-center py-2"
                  style={{ color: "#dfab24", fontFamily: "moul" }}
                  variants={fadeUpVariant}
                >
                  {currentInvitation?.details_title ||
                    (currentLanguage === "kh"
                      ? "សារជូនពរ"
                      : "GREETING MESSAGE")}
                </motion.h2>

                {/* Form Send */}
                {guestId && (
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-5 py-6 w-full max-w-2xl mx-auto px-6 flex flex-col items-center rounded-xl bg-white/5 backdrop-blur-sm"
                    variants={fadeUpVariant}
                  >
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-[#A5AE79]/40 border-0 border-[#A5AE79]/50 focus-visible:ring-2 focus-visible:ring-[#A5AE79] rounded-xl text-[#2C3E1F] font-medium placeholder:text-[#A5AE79]/70 w-full hover:bg-[#A5AE79]/50 focus:scale-[1.02] transition-all duration-300">
                            <SelectValue
                              className="text-[#2C3E1F]"
                              placeholder={
                                currentLanguage === "kh"
                                  ? "តើអ្នកចូលរួមអត់?"
                                  : "Will you attend?"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#A5AE79]/30">
                            <SelectItem
                              value={GuestStatus.CONFIRMED}
                              className="cursor-pointer hover:bg-[#A5AE79]/20"
                            >
                              {currentLanguage === "kh"
                                ? "ចូលរួម"
                                : "Attending"}
                            </SelectItem>
                            <SelectItem
                              value={GuestStatus.REJECTED}
                              className="cursor-pointer hover:bg-[#A5AE79]/20"
                            >
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
                      min="0"
                      className="bg-[#A5AE79]/40 border-0 border-[#A5AE79]/50 focus-visible:ring-2 focus-visible:ring-[#A5AE79] rounded-xl text-[#2C3E1F] font-medium placeholder:text-[#A5AE79]/70 w-full hover:bg-[#A5AE79]/50 focus:scale-[1.02] transition-all duration-300 "
                    />

                    <Textarea
                      {...form.register("message")}
                      placeholder={
                        currentLanguage === "kh"
                          ? "សារជូនពរ"
                          : "Greeting message"
                      }
                      rows={4}
                      className="bg-[#A5AE79]/40 border-0 border-[#A5AE79]/50 focus-visible:ring-2 focus-visible:ring-[#A5AE79] rounded-xl text-[#2C3E1F] font-medium placeholder:text-[#A5AE79]/70 w-full hover:bg-[#A5AE79]/50 focus:scale-[1.02] transition-all duration-300 resize-none"
                    />

                    <div className="w-full flex justify-center mt-6">
                      <motion.button
                        type="submit"
                        className="cursor-pointer transform text-base md:text-lg text-center w-[220px] md:w-[300px] h-[50px] md:h-[60px] inline-flex items-center justify-center px-6 py-3 "
                        style={{
                          color: "white",
                          fontFamily: "moul",
                          backgroundImage:
                            "url('/template/arts/button-kbach.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "12px",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {currentLanguage === "kh" ? "ផ្ញើរ" : "Send"}
                      </motion.button>
                    </div>
                  </motion.form>
                )}

                {/* Guest Messages Section */}
                <div className="w-full  mx-auto mt-8 ">
                  <div className="relative">
                    <ScrollArea className="h-[600px] md:h-[700px] rounded-xl border border-[#A5AE79]/20 bg-white/5 backdrop-blur-sm">
                      <motion.div
                        className="p-4 md:p-6 w-full flex flex-col gap-4"
                        variants={staggerContainer}
                      >
                        {guests && guests.length > 0 ? (
                          guests.map((guest, key) => (
                            <motion.div
                              key={key}
                              className="bg-[#A5AE79]/30 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-[#A5AE79]/30 hover:bg-[#A5AE79]/40 hover:border-[#A5AE79]/50"
                              variants={slideInLeftVariant}
                              whileHover={{
                                scale: 1.01,
                                y: -3,
                                transition: { duration: 0.2 },
                              }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="text-[#2C3E1F] text-lg md:text-xl font-semibold mb-2">
                                {guest?.name}
                              </div>
                              <div className="border-b-2 border-[#A5AE79]/60 mb-4"></div>
                              <div className="text-[#2C3E1F] text-base md:text-lg leading-relaxed mb-4 italic">
                                "{guest?.wishing_note}"
                              </div>
                              <div className="text-[#A5AE79] text-xs md:text-sm font-medium text-right">
                                {formatDateCustom(
                                  guest?.sentAt ?? "",
                                  "DD-MM-YYYY | HH:mmA"
                                )}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center text-[#A5AE79]/60 py-12 text-base">
                            {currentLanguage === "kh"
                              ? "មិនទាន់មានសារជូនពរ"
                              : "No messages yet"}
                          </div>
                        )}
                      </motion.div>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </div>
                </div>
              </motion.div>
              <Footer />
              <motion.div
                className="py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src="/template/arts/underbar kbach 1.png"
                  alt=""
                  width={200}
                  height={150}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
