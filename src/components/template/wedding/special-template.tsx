import { useEffect, useState } from "react";
import { Event } from "@/interfaces/event";
import { useLanguage } from "@/hooks/LanguageContext";
import Image from "next/image";

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

  return (
    <div className="relative h-screen max-w-xl mx-auto">
      {/* Background music */}
      {isOpen && (
        <audio id="welcome-music" loop src="/template/audios/music1.mp3" />
      )}

      {/* Front evelop */}
      {!isOpen && (
        <div className="front-evelop h-full">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
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
              />
              <h1
                className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent p-2"
                style={{ fontFamily: "moul" }}
              >
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h1>

              <h2
                className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent p-1"
                style={{ fontFamily: "moul" }}
              >
                សូមគោរពអញ្ជើញ
              </h2>
              <div
                className="mt-5 text-[16px] text-center min-w-[250px] md:min-w-[320px] min-h-[100px] max-h-[100px]  max-w-[600px] truncate inline-flex items-center justify-center px-3 hover:scale-105 transition-transform duration-300 animate-fade-in"
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

            <div className="text-[10px] text-center w-[200px] md:w-[280px] md:h-[50px] animate-fade-in animation-delay-500 mb-8">
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
        <div className="welcome-video h-full">
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
    </div>
  );
}
