const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  Heart,
  Calendar,
  MapPin,
  Camera,
  MessageCircle,
  Home,
} from "lucide-react";

const ScrollNavigationBar = () => {
  const [activeSection, setActiveSection] = useState("main");
  const [isVisible, setIsVisible] = useState(true);

  // Navigation sections with icons
  const sections = [
    { id: "main", label: "Home", icon: Home, labelKh: "ដើម" },
    // { id: "invitation", label: "Invitation", icon: Heart, labelKh: "អញ្ជើញ" },
    { id: "schedule", label: "Schedule", icon: Calendar, labelKh: "កម្មវិធី" },
    { id: "location", label: "Location", icon: MapPin, labelKh: "ទីតាំង" },
    { id: "gallery", label: "Photos", icon: Camera, labelKh: "រូបភាព" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      labelKh: "សារជូនពរ",
    },
  ];

  // Show/hide navigation based on scroll position and track active section
  useEffect(() => {
    const handleScroll = () => {
      // Track active section based on scroll position
      const scrollPosition = window.scrollY + 200;

      // Get actual section positions
      const sections = [
        "main",
        // "invitation",
        "schedule",
        "location",
        "gallery",
        "messages",
      ];
      let currentSection = "main";

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;

          if (scrollPosition >= elementTop - 100) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll behavior via CSS
  useEffect(() => {
    // Add smooth scroll behavior to html element
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`
                    relative p-2 rounded-full transition-all duration-300 group block
                    ${
                      isActive
                        ? "bg-rose-500 text-white scale-110"
                        : "text-gray-600 hover:bg-pink-100 hover:text-rose-600 hover:scale-105"
                    }
                  `}
                  title={section.label}
                >
                  <Icon size={18} />

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                  )}

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {section.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <a
        href="#main"
        className="fixed bottom-6 right-4 z-50 bg-rose-500 text-white p-3 rounded-full shadow-lg hover:bg-rose-600 hover:scale-110 transform transition-all duration-300 animate-bounce-gentle block"
      >
        <ChevronUp size={24} />
      </a>

      {/* Khmer Language Version - Alternative Design */}

      {/* Progress Indicator */}
      {/* <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300"
          style={{
            width: `${Math.min(
              100,
              (window.scrollY /
                (document.documentElement.scrollHeight - window.innerHeight)) *
                100
            )}%`,
          }}
        />
      </div> */}

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

export default ScrollNavigationBar;
