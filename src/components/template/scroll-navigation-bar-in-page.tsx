import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Camera,
  MessageCircle,
  Home,
  ChevronsUp,
  ChevronsDown,
  QrCode,
} from "lucide-react";

const ScrollNavigationBarInPage = () => {
  const [activeSection, setActiveSection] = useState("main");
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Navigation sections with icons
  const sections = [
    { id: "main", label: "Home", icon: Home, labelKh: "ដើម" },
    { id: "schedule", label: "Schedule", icon: Calendar, labelKh: "កម្មវិធី" },
    { id: "location", label: "Location", icon: MapPin, labelKh: "ទីតាំង" },
    { id: "gallery", label: "Photos", icon: Camera, labelKh: "រូបភាព" },
    { id: "khqr", label: "KHQR", icon: QrCode, labelKh: "ចងដៃ" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      labelKh: "សារជូនពរ",
    },
  ];

  // Smooth scroll inside container
  const scrollToSection = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    sectionId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const container = element.closest(".overflow-y-auto");
      if (container) {
        container.scrollTo({
          top: element.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  // Track active section and scroll position
  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-y-auto");

    if (!scrollContainer) return;

    const handleScroll = () => {
      const sectionIds = [
        "main",
        "schedule",
        "location",
        "gallery",
        "khqr",
        "messages",
      ];

      let closestSection = "main";
      let minDistance = Infinity;

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const distance = Math.abs(
            element.offsetTop - scrollContainer.scrollTop
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = sectionId;
          }
        }
      }

      setActiveSection(closestSection);

      // Check if near bottom
      const scrolledToBottom =
        scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight <
        500;
      setShowScrollToTop(scrolledToBottom);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector(".overflow-y-auto");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    const container = document.querySelector(".overflow-y-auto");
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={`
                    relative p-2 rounded-full transition-all duration-300 group
                    ${
                      isActive
                        ? "bg-[#A5AE79] text-white scale-110"
                        : "text-[#A5AE79] hover:bg-[#A5AE79]/20 hover:text-[#A5AE79] hover:scale-105"
                    }
                  `}
                  title={section.label}
                >
                  <Icon size={18} className="md:size-6" />

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#A5AE79] rounded-full border-2 border-white animate-pulse" />
                  )}

                  {/* Tooltip */}
                  <div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#A5AE79] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
                    style={{ fontFamily: "moul" }}
                  >
                    {section.labelKh}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#A5AE79]"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Smart Scroll Button */}
      {showScrollToTop ? (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-50 bg-[#A5AE79] text-white p-3 rounded-full shadow-lg hover:bg-[#A5AE79]/80 hover:scale-110 transform transition-all duration-300 animate-bounce-gentle"
        >
          <ChevronsUp size={18} className="md:size-6" />
        </button>
      ) : (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-4 z-50 bg-[#A5AE79] text-white p-3 rounded-full shadow-lg hover:bg-[#A5AE79]/80 hover:scale-110 transform transition-all duration-300 animate-bounce-gentle"
        >
          <ChevronsDown size={18} className="md:size-6" />
        </button>
      )}

      <style jsx>{`
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ScrollNavigationBarInPage;
