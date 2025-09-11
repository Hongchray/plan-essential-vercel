import { useEffect, useState } from "react";
import { Event } from "@/interfaces/event";
export default function SpecialTemplate({ config, data }: { config: any, data: Event }) {
 const [currentLanguage, setCurrentLanguage] = useState('kh');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get the current invitation data based on selected language
  const currentInvitation = currentLanguage === 'kh' 
    ? config?.invitation_kh || config?.invitation 
    : config?.invitation_en || config?.invitation;

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'kh' ? 'en' : 'kh');
  };

  // Calculate scroll-based transforms
  const parallaxOffset = scrollY * 0.5;
  const fadeOpacity = Math.max(1 - scrollY / 300, 0);
  const scaleEffect = Math.max(1 - scrollY / 1000, 0.8);

  return (
    <div className="relative">
      {/* Custom Tailwind animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
      `}</style>

      {/* Language Switch Button - Fixed position */}
      <div className={`fixed top-4 right-4 z-50 ${isVisible ? 'animate-fadeInDown animation-delay-800' : 'opacity-0'}`}>
        <button
          onClick={toggleLanguage}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg hover:bg-white/95 transition-all duration-200 flex items-center gap-2"
        >
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${currentLanguage === 'kh' ? 'opacity-100' : 'opacity-50'}`}>
              ខ្មែរ
            </span>
            <div className="relative w-8 h-4 bg-gray-200 rounded-full">
              <div 
                className={`absolute top-0.5 w-3 h-3 bg-current rounded-full transition-transform duration-200 ${
                  currentLanguage === 'en' ? 'transform translate-x-4' : 'transform translate-x-0.5'
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${currentLanguage === 'en' ? 'opacity-100' : 'opacity-50'}`}>
              EN
            </span>
          </div>
        </button>
      </div>

      {/* Main Content with Scroll Effects */}
      <div className="min-h-[200vh]">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Main Header Card with Parallax */}
          <div 
            className="relative bg-cover flex flex-col justify-start items-center text-center  w-full h-[100vh] shadow top-0"
            style={{
              transform: `translateY(${parallaxOffset}px) scale(${scaleEffect})`,
              opacity: fadeOpacity,
              backgroundImage: 'url(/template/arts/bg-02.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Top decorative elements */}
            <div 
              className={`flex justify-between w-full transition-all duration-700 ease-out ${isVisible ? 'animate-fadeInDown' : 'opacity-0'}`}
              style={{
                transform: `translateY(${-scrollY * 0.3}px)`,
                opacity: Math.max(1 - scrollY / 400, 0)
              }}
            >
              <img
                src="/template/arts/asset_3.png"
                className="w-[80px] rotate-90"
                alt="Frame 1"
              />
              <img
                src="/template/arts/asset_1.png"
                className="w-auto h-[40px] rotate-180"
                alt="Frame 1"
              />
              <img
                src="/template/arts/asset_3.png"
                className="w-[80px] rotate-180"
                alt="Frame 1"
              />
            </div>

            {/* Main content with staggered animations */}
            <div className="relative z-10 space-y-2 flex flex-col justify-around h-full">
              {/* Title section */}
              <div
                className="transition-all duration-1000 ease-out"
                style={{
                  transform: `translateY(${scrollY * 0.2}px)`,
                  opacity: Math.max(1 - scrollY / 350, 0)
                }}
              >
                <h1 
                  className={`text-3xl font-bold drop-shadow-lg pt-8 transition-all duration-500 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                  style={{ 
                    color: '#99762C',
                    fontFamily: 'Great Vibes, Moul, sans-serif',
                    transform: `scale(${Math.max(1 - scrollY / 800, 0.9)})`
                  }}
                >
                  {currentInvitation?.main_title}
                </h1>

                {/* Names section */}
                <div 
                  className="flex items-center justify-center gap-2 pt-6 transition-all duration-700 ease-out"
                  style={{
                    transform: `translateY(${scrollY * 0.15}px)`,
                    opacity: Math.max(1 - scrollY / 300, 0)
                  }}
                >
                  <div 
                    className={`text-6xl font-semibold drop-shadow-lg transition-transform duration-500 hover:scale-110 ${isVisible ? 'animate-slideInLeft animation-delay-200' : 'opacity-0'}`}
                    style={{
                      color: '#99762C',
                      fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    }}
                  >
                    {data.groom}
                  </div>
                  <div 
                    className={`text-lg ${isVisible ? 'animate-fadeInUp animation-delay-400' : 'opacity-0'}`}
                    style={{
                      color: '#99762C',
                      fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    }}
                  >
                    <span className="text-md" style={{fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif'}}>
                      {currentLanguage === 'kh' ? 'ជាគូនឹង' : '&'}
                    </span>
                  </div>
                  <div 
                    className={`text-6xl font-semibold drop-shadow-lg transition-transform duration-500 hover:scale-110 ${isVisible ? 'animate-slideInRight animation-delay-200' : 'opacity-0'}`}
                    style={{
                      color: '#99762C',
                      fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    }}
                  >
                    {data.bride}
                  </div>
                </div>
              </div>

              {/* Center image and details */}
              <div 
                className="transition-all duration-900 ease-out"
                style={{
                  transform: `translateY(${scrollY * 0.1}px) scale(${Math.max(1 - scrollY / 1200, 0.95)})`,
                  opacity: Math.max(1 - scrollY / 250, 0)
                }}
              >
                <img
                  src="/template/groom_bride/IMG_0864.PNG"
                  className={`max-w-[150px] mx-auto transition-all duration-500 hover:scale-105 ${isVisible ? 'animate-fadeInUp animation-delay-600' : 'opacity-0'}`}
                  alt="Frame 1"
                />
                
                <p 
                  className={`text-lg drop-shadow-lg pt-8 transition-all duration-500 ${isVisible ? 'animate-fadeInUp animation-delay-800' : 'opacity-0'}`}
                  style={{
                    color: '#99762C',
                    fontFamily: 'Great Vibes, Moul, sans-serif',
                    transform: `translateY(${scrollY * 0.05}px)`
                  }}
                >
                  {currentInvitation?.subtitle}
                </p>

                <img
                  src="/template/arts/frame_name_1.png"
                  className={`h-[40px] mx-auto text-blend-overlay text-[#99762C] transition-all duration-500 ${isVisible ? 'animate-fadeInUp animation-delay-800' : 'opacity-0'}`}
                  alt="Frame 1"
                  style={{
                    transform: `rotate(${scrollY * 0.1}deg)`
                  }}
                />

                <p 
                  className={`text-base drop-shadow-lg transition-all duration-500 ${isVisible ? 'animate-fadeInUp animation-delay-800' : 'opacity-0'}`}
                  style={{
                    color: '#99762C',
                    fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    transform: `translateY(${scrollY * 0.03}px)`
                  }}
                >
                  {currentInvitation?.date_time}
                </p>
                
                <p 
                  className={`text-base drop-shadow-lg transition-all duration-500 ${isVisible ? 'animate-fadeInUp animation-delay-800' : 'opacity-0'}`}
                  style={{
                    color: '#99762C',
                    fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    transform: `translateY(${scrollY * 0.02}px)`
                  }}
                >
                  {currentInvitation?.location}
                </p>
              </div>
            </div>

            {/* Bottom decorative elements */}
            <div 
              className={`flex justify-between w-full transition-all duration-700 ease-out ${isVisible ? 'animate-fadeInUp animation-delay-400' : 'opacity-0'}`}
              style={{
                transform: `translateY(${scrollY * 0.4}px)`,
                opacity: Math.max(1 - scrollY / 500, 0)
              }}
            >
              <img
                src="/template/arts/asset_3.png"
                className="w-[80px] rotate-0"
                alt="Frame 1"
              />
              <img
                src="/template/arts/asset_3.png"
                className="w-[80px] rotate-270"
                alt="Frame 1"
              />
            </div>
          </div>
        </div>

        {/* Additional content section for scroll effect */}
        <div 
          className="h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-amber-50/30"
          style={{
            transform: `translateY(${-scrollY * 0.1}px)`,
            opacity: Math.max((scrollY - 200) / 300, 0)
          }}
        >
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <div
              className={`transition-all duration-1000 ease-out ${scrollY > 300 ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{
                transform: `translateY(${Math.max(50 - scrollY * 0.1, 0)}px)`,
                opacity: Math.max((scrollY - 300) / 200, 0)
              }}
            >
              <h2 
                className="text-2xl font-semibold mb-4"
                style={{
                  color: '#99762C',
                  fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif'
                }}
              >
                {currentLanguage === 'kh' ? 'សូមអរគុណ' : 'Thank You'}
              </h2>
              <p 
                className="text-base leading-relaxed"
                style={{
                  color: '#99762C',
                  fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif'
                }}
              >
                {currentLanguage === 'kh' 
                  ? 'សូមអរគុណចំពោះការចូលរួមក្នុងថ្ងៃសំខាន់របស់យើង' 
                  : 'Thank you for joining us on our special day'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}