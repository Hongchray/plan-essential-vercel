import { useState, useEffect, useRef } from "react";

export default function StyleTemplate() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionIndex = parseInt(entry.target.dataset.section);
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, sectionIndex]));
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

      return (
    <div className="relative w-full min-h-screen mx-auto">
      {/* Fixed Centered Video Background */}
      <div className="fixed inset-0 flex items-center justify-center z-0">
        <div className="w-[700px] overflow-hidden rounded-lg shadow-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://ik.imagekit.io/0wwxrqvqhx/SCR0003.mp4?tr=orig"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      {/* Scrollable Content with Scroll-Triggered Fade Animations */}
      <div className="relative z-10">
        <section 
          className="h-screen flex items-center justify-center"
          ref={(el) => (sectionRefs.current[0] = el)}
          data-section="0"
        >
          <div className={`transition-all duration-1000 transform ${
            visibleSections.has(0) 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}>
            <img 
              src="https://sambot.online/sophat_vouch/img/txt0.png" 
              className="w-[700px]" 
              alt="" 
            />
          </div>
        </section>

        <section 
          className="h-screen flex items-center justify-center"
          ref={(el) => (sectionRefs.current[1] = el)}
          data-section="1"
        >
          <div className={`transition-all duration-1200 transform delay-200 ${
            visibleSections.has(1) 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}>
            <img 
              src="https://sambot.online/sophat_vouch/img/txt01.png" 
              className="w-[700px]" 
              alt="" 
            />
          </div>
        </section>

        <section 
          className="h-screen flex items-center justify-center"
          ref={(el) => (sectionRefs.current[2] = el)}
          data-section="2"
        >
          <div className={`transition-all duration-1400 transform delay-400 ${
            visibleSections.has(2) 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}>
            <img 
              src="https://sambot.online/sophat_vouch/img/igcountdown.jpg" 
              className="w-[700px]" 
              alt="" 
            />
          </div>
        </section>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 1s ease-out 0.3s both;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out 0.6s both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}