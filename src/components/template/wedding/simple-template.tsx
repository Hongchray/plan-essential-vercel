import { useEffect, useState } from "react";
import { Event } from "@/interfaces/event";
import Link from "next/link";
import Image from "next/image";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
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
import { useSearchParams } from "next/navigation";
import { Guest } from "@/interfaces/guest";
import { formatDateCustom, formatDateTime } from "@/utils/date";
import { GuestStatus } from "@/enums/guests";
import { toast } from "sonner";
import ScrollNavigationBar from "../scroll-navigation-bar";
import { useLanguage } from "@/hooks/LanguageContext";
import { Footer } from "../footer";
import PhotoGallery from "@/components/composable/PhotoGallery";
import SingleImagePreview from "@/components/composable/SingleImagePreview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
export default function SimpleTemplate({
  config,
  data,
}: {
  config: any;
  data: Event;
}) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const searchParams = useSearchParams();
  const guestId = searchParams.get("guest");
  const [guest, setGuest] = useState<Guest>();
  const weddingPhotos = [
    config?.photo_gallary?.photo1,
    config?.photo_gallary?.photo2,
    config?.photo_gallary?.photo3,
    config?.photo_gallary?.photo4,
  ].filter(Boolean);
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
  // const [currentLanguage, setCurrentLanguage] = useState<"kh" | "en">("kh");
  const { currentLanguage, toggleLanguage } = useLanguage();

  // Get the current invitation data based on selected language
  const currentInvitation =
    currentLanguage === "kh"
      ? config?.invitation_kh || config?.invitation
      : config?.invitation_en || config?.invitation;

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
      form.reset();
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
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const slideInLeftVariant = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  };
  const fadeUpVariant = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };
  return (
    <div className="relative">
      <ScrollNavigationBar />
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

      <div className="max-w-md mx-auto">
        {/* Main Header Card */}
        <div
          id="main"
          className="relative h-[600px] bg-cover bg-center flex flex-col justify-start items-center text-center px-6  overflow-hidden w-full py-8 animate-fade-in-up"
          style={{
            backgroundImage: `url(${config?.main_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 space-y-2 flex flex-col justify-between h-full">
            <div className="animate-slide-down">
              <h1
                className="text-3xl md:text-3xl drop- pt-5 "
                style={{
                  color: config?.primaryColor,
                  fontFamily: "Great Vibes, Moul, sans-serif",
                  textShadow: "1px 2px 4px #000000",
                }}
              >
                {currentInvitation?.main_title}
              </h1>
              <div className="flex items-center justify-center gap-2 pt-9 animate-fade-in-up animation-delay-300">
                <div
                  className="text-xl drop- hover:scale-110 transition-transform duration-300"
                  style={{
                    color: config?.primaryColor,
                    textShadow: "1px 2px 4px #000000",
                    fontFamily: "Great Vibes, Moul, sans-serif",
                  }}
                >
                  {data.groom}
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
                  className="text-xl drop- hover:scale-110 transition-transform duration-300"
                  style={{
                    color: config?.primaryColor,
                    textShadow: "1px 2px 4px #000000",
                    fontFamily: "Great Vibes, Moul, sans-serif",
                  }}
                >
                  {data.bride}
                </div>
              </div>
            </div>
            <div className="animate-slide-up animation-delay-500">
              <p
                className="text-md  pt-8"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 2px 4px #000000",
                  fontFamily: "Great Vibes, Moul, sans-serif",
                }}
              >
                {currentInvitation?.subtitle}
              </p>

              <div
                className="relative text-[16px] text-center inline-flex items-center justify-center px-3 hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{
                  fontFamily: "moul",
                  backgroundImage:
                    "url('/template/arts/free-0/name-frame-kbach.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  aspectRatio: "4 / 1", // Adjust based on your image ratio (320/80 = 4/1)
                  width: "100%",
                  maxWidth: "420px",
                  minHeight: "90px",
                }}
                role="img"
                aria-label={`Guest name: ${guest?.name || "Unknown"}`}
              >
                <span className="text-[#999999] relative z-10">
                  {guest?.name || "លោក សុខ រតនៈវិសាល និងភរិយា"}
                </span>
              </div>
              <p
                className="text-base drop- animate-fade-in animation-delay-700"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 2px 4px #000000",
                  fontFamily: "Kantumruy Pro, sans-serif",
                }}
              >
                {currentInvitation?.date_time}
              </p>

              <p
                className="text-base drop- animate-fade-in animation-delay-1000"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 2px 4px #000000",
                  fontFamily: "Kantumruy Pro, sans-serif",
                }}
              >
                {currentInvitation?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Invitation Message Card */}
        <div
          id="invitation"
          className="p-6 text-center animate-fade-in-up animation-delay-300 hover: transition-shadow duration-300 flex flex-col items-center"
        >
          <h2
            className="text-lg mb-4 animate-slide-in-left"
            style={{
              color: config?.textColor,
              fontFamily: " Moul, sans-serif",
            }}
          >
            {currentInvitation?.invitation_title}
          </h2>
          <p
            className="text-base leading-relaxed animate-fade-in animation-delay-500"
            style={{
              color: config?.textColor,
              fontFamily: "Kantumruy Pro, sans-serif",
            }}
          >
            {currentInvitation?.invitation_message}
          </p>
          <div className=" animate-fade-in animation-delay-1100 ">
            <Image
              src="/template/arts/underbar kbach 1.png"
              alt=""
              width={200}
              height={150}
              className="hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Event schedule Card */}
        <div
          id="schedule"
          className="relative min-h-[600px] bg-cover bg-center  overflow-hidden animate-fade-in-up animation-delay-700"
          style={{
            backgroundImage: `url(${config?.details_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* <div className="absolute inset-0 bg-opacity-90"></div> */}

          <div className="relative z-10 p-6 bg-black/10 backdrop-blur-[2px] min-h-[600px]">
            <h2
              className="text-lg text-center mb-4 animate-slide-down"
              style={{
                color: config?.textColor,
                fontFamily: " Moul, sans-serif",
                textShadow: "1px 2px 4px #000000",
              }}
            >
              {currentInvitation?.details_title ||
                (currentLanguage === "kh"
                  ? "របៀបវារៈកម្មវិធី"
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
                  <div key={shift.id} className="mb-4 pb-5">
                    {/* Optional: Show shift name/date */}
                    <p
                      className={`pb-4 text-sm text-center mb-2 animate-slide-in-left animation-delay-${
                        (shiftIndex + 1) * 100
                      }`}
                      style={{
                        color: config.textColor,
                        fontFamily: " Moul, sans-serif",
                        textShadow: "1px 2px 4px #000000",
                      }}
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
                            {timelineIndex >= 1 && (
                              <div className="">
                                <Image
                                  src="/template/arts/under-style1.png"
                                  alt=""
                                  width={80}
                                  height={100}
                                  className="hover:rotate-6 transition-transform duration-300"
                                />
                              </div>
                            )}

                            <span
                              className="text-[14px]"
                              style={{
                                color: config.textColor,
                                fontFamily: "moulpali",
                                textShadow: "1px 2px 4px #000000",
                              }}
                            >
                              វេលាម៉ោង {timeline.time}
                            </span>
                            <span
                              className="text-[14px]"
                              style={{
                                color: config.textColor,
                                fontFamily: "moulpali",
                                textShadow: "1px 2px 4px #000000",
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Location */}
      <div
        id="location"
        className="py-5 mx-auto max-w-md flex flex-col items-center animate-fade-in-up animation-delay-1200"
      >
        <h2
          className="text-lg  text-center mb-4 animate-slide-in-left"
          style={{
            color: config?.textColor,
            fontFamily: " Moul, sans-serif",
          }}
        >
          {currentLanguage === "kh" ? "ទីតាំងកម្មវិធី" : "EVENT LOCATION"}
        </h2>
        {config?.event_location && (
          <div className="animate-zoom-in animation-delay-300 pb-2">
            <SingleImagePreview
              src={config?.event_location}
              alt="Event Location Map"
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
      <div
        id="gallery"
        className="py-5 mx-auto max-w-md flex flex-col items-center animate-fade-in-up animation-delay-1400"
      >
        <h2
          className="text-lg text-center mb-4 animate-slide-in-right"
          style={{ color: config?.textColor, fontFamily: "moul, sans-serif" }}
        >
          {currentLanguage === "kh" ? "កម្រងរូបភាព" : "PHOTOS"}
        </h2>

        <div className="my-4">
          <PhotoGallery photos={weddingPhotos} />
        </div>
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
      <div
        id="messages"
        className="mt-5 mx-auto max-w-md flex flex-col items-center animate-fade-in-up animation-delay-1600"
      >
        <h2
          className="text-lg text-center mb-4 animate-slide-in-left"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          {currentLanguage === "kh" ? "សារជូនពរ" : "GREETING MESSAGE"}
        </h2>

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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="text-[#6f7c2b] bg-[#A5AE79]/40 border-0 border-[#A5AE79]/50 focus-visible:ring-2 focus-visible:ring-[#A5AE79] rounded-xl font-medium placeholder:text-[#A5AE79]/70 w-full hover:bg-[#A5AE79]/50 focus:scale-[1.02] transition-all duration-300">
                    <SelectValue
                      className="text-[#2C3E1F]"
                      placeholder={
                        currentLanguage === "kh"
                          ? "តើអ្នកចូលរួមអត់?"
                          : "Will you attend?"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#A5AE79]/30 text-[#6f7c2b] hover:text-[#6f7c2b]">
                    <SelectItem
                      value={GuestStatus.CONFIRMED}
                      className="cursor-pointer hover:bg-[#A5AE79]/20"
                    >
                      {currentLanguage === "kh" ? "ចូលរួម" : "Attending"}
                    </SelectItem>
                    <SelectItem
                      value={GuestStatus.REJECTED}
                      className="cursor-pointer hover:bg-[#A5AE79]/20"
                    >
                      {currentLanguage === "kh" ? "បដិសេធ" : "Cannot attend"}
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
              className=" text-[#6f7c2b] bg-[#A5AE79]/40 border-0 border-[#A5AE79]/50 focus-visible:ring-2 focus-visible:ring-[#A5AE79] rounded-xl  font-medium placeholder:text-[#A5AE79]/70 w-full hover:bg-[#A5AE79]/50 focus:scale-[1.02] transition-all duration-300 "
            />

            <Textarea
              {...form.register("message")}
              placeholder={
                currentLanguage === "kh" ? "សារជូនពរ" : "Greeting message"
              }
              rows={4}
              className="bg-[#A5AE79]/40 border-0 border-[#A5AE79]/50 focus-visible:ring-2 focus-visible:ring-[#A5AE79] rounded-xl text-[#6f7c2b] font-medium placeholder:text-[#A5AE79]/70 w-full hover:bg-[#A5AE79]/50 focus:scale-[1.02] transition-all duration-300 resize-none"
            />

            <div className="w-full flex justify-center mt-6">
              <div className="text-[10px] text-center w-[200px] h-auto animate-fade-in animation-delay-500">
                <button
                  type="submit"
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
                  {currentLanguage === "kh" ? "ផ្ញើរ" : "Send"}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        <div className="w-full mx-auto mt-8">
          <div className="relative">
            {/* Top shadow */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/60 to-transparent z-10 pointer-events-none rounded-t-xl" />

            {/* Bottom shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent z-10 pointer-events-none rounded-b-xl" />

            <ScrollArea className="h-[600px] md:h-[700px] rounded-xl  border-[#A5AE79]/20 bg-white/5 backdrop-blur-sm">
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
                      <div className="text-[#A5AE79] text-base md:text-md font-semibold mb-2">
                        {guest?.name}
                      </div>
                      <div className="border-b-2 border-[#A5AE79]/60 mb-4"></div>
                      <div className="text-[#A5AE79] text-base md:text-lg leading-relaxed mb-4 italic">
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
      </div>
      <Footer />

      <div className="w-full flex items-center justify-center h-[150px]">
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
