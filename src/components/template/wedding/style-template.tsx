import { useState, useEffect } from "react";

export default function CleanSinglePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 flex items-center justify-center z-0">
        <div className="max-w-2xl  overflow-hidden shadow-2xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-contain"
          >
            <source
              src="https://ik.imagekit.io/0wwxrqvqhx/SCR0003.mp4?tr=orig"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="absolute inset-0 bg-opacity-20"></div>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        <div className={`transition-all duration-1500 ease-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95'
        }`}>
          {
            !showContent&& (
            <div className=" flex justify-center items-center flex-col text-center space-y-8 max-w-4xl">
                  {/* Title */}
                <div className="z-10">
                  <img 
                    src="https://sambot.online/sophat_vouch/img/title_front.png" 
                    className="w-[300px] " 
                    alt="Title" 
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#c1a368]"> លោក​ មករា</div>
                </div>
                {/* Envelope */}
                <div className="animate-bounce" onClick={() => setShowContent(true)}>
                  <img 
                    src="https://sambot.online/sophat_vouch/img/btnopen.png" 
                    className="w-[200px] animate-bounce" 
                    alt="Envelope" 
                  />
                </div>
            </div>
            )
          }
    
          {showContent && ( <div className="text-center space-y-8 max-w-4xl " >
            <div className="space-y-6">
              <img 
                src="https://sambot.online/sophat_vouch/img/txt0.png" 
                className="w-full max-w-2xl mx-auto animate-fade-in-up" 
                alt="Main content" 
              />
              
              <div className="animate-fade-in-left">
                <img 
                  src="https://sambot.online/sophat_vouch/img/txt01.png" 
                  className="w-full max-w-2xl mx-auto" 
                  alt="Secondary content" 
                />
              </div>
              
              <div className="animate-fade-in-right">
                <img 
                  src="https://sambot.online/sophat_vouch/img/igcountdown.jpg" 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" 
                  alt="Countdown content" 
                />
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 animate-bounce-slow">
              <div className="inline-block px-8 py-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-gray-800 font-medium">Scroll to explore</span>
              </div>
            </div>
          </div>)
         }
        </div>
      </div>
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

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.2s both;
        }

        .animate-fade-in-left {
          animation: fade-in-left 1s ease-out 0.6s both;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out 1s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite 1.4s;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}
      </style>
    </div>
  );
}