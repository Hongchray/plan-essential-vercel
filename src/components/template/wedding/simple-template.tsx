import { useState } from "react";
import { Event } from "@/interfaces/event";
import Link from "next/link";
import Image from "next/image";
export default function SimpleTemplate({
  config,
  data,
}: {
  config: any;
  data: Event;
}) {
  const [currentLanguage, setCurrentLanguage] = useState<"kh" | "en">("kh");
  console.log(data);

  // Get the current invitation data based on selected language
  const currentInvitation =
    currentLanguage === "kh"
      ? config?.invitation_kh || config?.invitation
      : config?.invitation_en || config?.invitation;

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "kh" ? "en" : "kh"));
  };

  return (
    <div className="relative">
      {/* Language Switch Button - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleLanguage}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg hover:bg-white/95 transition-all duration-200 flex items-center gap-2"
        >
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-medium ${
                currentLanguage === "kh" ? "opacity-100" : "opacity-50"
              }`}
            >
              ខ្មែរ
            </span>
            <div className="relative w-8 h-4 bg-gray-200 rounded-full">
              <div
                className={`absolute top-0.5 w-3 h-3 bg-current rounded-full transition-transform duration-200 ${
                  currentLanguage === "en"
                    ? "transform translate-x-4"
                    : "transform translate-x-0.5"
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium ${
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
          className="relative h-[600px] bg-cover bg-center flex flex-col justify-start items-center text-center px-6 shadow-lg overflow-hidden w-full py-8"
          style={{
            backgroundImage: `url(${currentInvitation?.main_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 space-y-2 flex flex-col justify-between h-full">
            <div>
              <h1
                className="text-3xl font-bold drop-shadow-lg"
                style={{
                  color: config?.primaryColor,
                  fontFamily: "Great Vibes, Moul, sans-serif",
                  textShadow: "8px 8px 5px rgba(0,0,0,0.8)",
                }}
              >
                {currentInvitation?.main_title}
              </h1>
              <div className="flex items-center justify-center gap-2 pt-6">
                <div
                  className="text-2xl font-semibold drop-shadow-lg"
                  style={{
                    color: config?.primaryColor,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    fontFamily: "Great Vibes, Kantumruy Pro, sans-serif",
                  }}
                >
                  {data.groom}
                </div>
                <div
                  className="text-lg"
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
                  className="text-2xl font-semibold drop-shadow-lg"
                  style={{
                    color: config?.primaryColor,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    fontFamily: "Great Vibes, Kantumruy Pro, sans-serif",
                  }}
                >
                  {data.bride}
                </div>
              </div>
            </div>
            <div className="">
              <p
                className="text-[12px] drop-shadow-lg pt-8"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontFamily: "Great Vibes, Moul, sans-serif",
                }}
              >
                {currentInvitation?.subtitle}
              </p>

              <div
                className="text-[16px] text-center w-[280px] h-[80px] inline-flex items-center justify-center px-3 text-white"
                style={{
                  fontFamily: "moul",
                  backgroundImage: "url('/template/arts/bar-kbach.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.7)",
                }}
              >
                <span className="pb-4">លោក ហុង</span>
              </div>
              <p
                className="text-[12px] drop-shadow-lg"
                style={{
                  color: config?.primaryColor,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontFamily: "Great Vibes, Kantumruy Pro, sans-serif",
                }}
              >
                {currentInvitation?.date_time}
              </p>

              <p
                className="text-[12px] drop-shadow-lg"
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
        <div className="bg-white p-6 text-center">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: config?.textColor }}
          >
            {currentInvitation?.invitation_title}
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: config?.textColor }}
          >
            {currentInvitation?.invitation_message}
          </p>
        </div>

        {/* Event Details Card */}
        <div
          className="relative min-h-[600px] bg-cover bg-center shadow-lg overflow-hidden"
          style={{
            backgroundImage: `url(${currentInvitation?.details_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-opacity-90"></div>

          <div className="relative z-10 p-6">
            <h2
              className="text-lg font-semibold text-center mb-4"
              style={{ color: config?.textColor, fontFamily: "moul" }}
            >
              {/* {currentInvitation?.details_title} */}
              របៀបវីរៈកម្មវិធី / EVENT AGENDA
            </h2>

            <div className="text-center mb-4">
              <p
                className="text-[10px]"
                style={{ color: config?.textColor, fontFamily: "moul" }}
              >
                កម្មវិធីថ្ងៃទី ១​ : ថ្ងៃអាទិត្យ ទី២១ ខែកញ្ញា ឆ្នាំ២០២៥
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[10px] text-left">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ១ៈ០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  សែនក្រុងពិលី
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ២ៈ០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ២ៈ០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  ពិធីជាវខាន់ស្លា
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ៥:០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  ពិធីចាក់ទឹកតែ
                </span>
              </div>
            </div>

            <div className="text-center my-4">
              <p
                className="text-[10px]"
                style={{ color: config?.textColor, fontFamily: "moul" }}
              >
                កម្មវិធីថ្ងៃទី ១​ : ថ្ងៃអាទិត្យ ទី២១ ខែកញ្ញា ឆ្នាំ២០២៥
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[10px] text-left">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ១ៈ០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  សែនក្រុងពិលី
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ២ៈ០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ២ៈ០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  ពិធីជាវខាន់ស្លា
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  វេលាម៉ោង ៥:០០ រសៀល
                </span>
                <span
                  style={{ color: config?.textColor, fontFamily: "moulpali" }}
                >
                  ពិធីចាក់ទឹកតែ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 mx-auto max-w-md flex flex-col items-center">
        <h2
          className="text-lg font-semibold text-center mb-4"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          ទីតាំងកម្មវិធី / EVENT LOCATION
        </h2>
        <div className="text-[10px] text-center w-[200px] h-auto">
          <Link
            href="https://maps.app.goo.gl/cXh1rNEqDUm721Ve6"
            target="_blank"
            className="text-[12px] text-center w-[200px] h-auto inline-block px-3 py-2"
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
            មើលក្នុង Google Map
          </Link>
        </div>
      </div>
      {/* កម្រងរូបភាព / PHOTOS */}
      <div className="mt-5 mx-auto max-w-md flex flex-col items-center">
        <h2
          className="text-lg font-semibold text-center mb-4"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          កម្រងរូបភាព / PHOTOS
        </h2>
        <div className="py-2">
          <Image
            src="/template/groom_bride/Frame-Photo 1.png"
            alt=""
            width={200}
            height={150}
          ></Image>
        </div>
        <div className="py-2">
          <Image
            src="/template/groom_bride/Frame-Photo 2.png"
            alt=""
            width={200}
            height={150}
          ></Image>
        </div>
        <div className="py-2">
          <Image
            src="/template/groom_bride/Frame-Photo 1.png"
            alt=""
            width={200}
            height={150}
          ></Image>
        </div>
        <div className="py-2">
          <Image
            src="/template/groom_bride/Frame-Photo 2.png"
            alt=""
            width={200}
            height={150}
          ></Image>
        </div>
        <div className="py-2">
          <Image
            src="/template/arts/underbar kbach 1.png"
            alt=""
            width={200}
            height={150}
          ></Image>
        </div>
      </div>
      {/* កម្រងរូបភាព / PHOTOS */}
      <div className="mt-5 mx-auto max-w-md flex flex-col items-center">
        <h2
          className="text-lg font-semibold text-center mb-4"
          style={{ color: config?.textColor, fontFamily: "moul" }}
        >
          សារជូនពរ / GREETING MESSAGE
        </h2>
      </div>
    </div>
  );
}
