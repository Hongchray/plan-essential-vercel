import { useState } from "react";
import { Event } from "@/interfaces/event";
export default function SimpleTemplate({ config, data }: { config: any, data: Event }) {
  const [currentLanguage, setCurrentLanguage] = useState<'kh' | 'en'>('kh');
  console.log(data)
  
  // Get the current invitation data based on selected language
  const currentInvitation = currentLanguage === 'kh' 
    ? config?.invitation_kh || config?.invitation 
    : config?.invitation_en || config?.invitation;

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'kh' ? 'en' : 'kh');
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
      <div className="space-y-6 max-w-md mx-auto">
        {/* Main Header Card */}
        <div 
          className="relative h-[600px] bg-cover bg-center flex flex-col justify-start items-center text-center px-6 shadow-lg overflow-hidden w-full"
          style={{ 
            backgroundImage: `url(${currentInvitation?.main_background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 space-y-2 flex flex-col justify-around h-full">
            <div>
              <h1 
                className="text-3xl font-bold drop-shadow-lg"
                style={{ 
                  color: config?.primaryColor,
                  fontFamily: 'Great Vibes, Moul, sans-serif',
                  textShadow: '8px 8px 5px rgba(0,0,0,0.8)'
                }}
              >
                {currentInvitation?.main_title}
              </h1>
              <div className="flex items-center justify-center gap-2 pt-6">
                  <div 
                    className="text-3xl font-semibold drop-shadow-lg"
                    style={{
                      color: config?.primaryColor,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    }}
                  >
                    {data.groom}
                  </div>
                  <div 
                    className="text-lg"
                    style={{
                      color: config?.primaryColor,            
                      textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                    }}
                  >
                    <span className="text-md" style={{fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif'}}>
                      {currentLanguage === 'kh' ? 'ជាគូនឹង' : '&'}
                    </span>
                  </div>
                  <div 
                    className="text-3xl font-semibold drop-shadow-lg"
                    style={{
                      color: config?.primaryColor,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                    }}
                  >
                    {data.bride}
                  </div>
              </div>
            </div>
            <div className="">
              <p 
                className="text-lg drop-shadow-lg pt-8"
                style={{
                  color: config?.primaryColor,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  fontFamily: 'Great Vibes, Moul, sans-serif',

                }}
              >
                {currentInvitation?.subtitle}
              </p>
              <img
                src="https://theapka.com/storage/templates/chhay/images/frame_1.png"
                className="h-[50px] mx-auto"
                alt="Frame 1"
              />
              <p 
                className="text-base drop-shadow-lg"
                style={{
                  color: config?.primaryColor,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
                }}
              >
                {currentInvitation?.date_time}
              </p>
              
              <p 
                className="text-base drop-shadow-lg"
                style={{
                  color: config?.primaryColor,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  fontFamily: 'Great Vibes, Kantumruy Pro, sans-serif',
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
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-opacity-90"></div>
          
          <div className="relative z-10 p-6">
            <h2 
              className="text-lg font-semibold text-center mb-4"
              style={{ color: config?.textColor }}
            >
              {currentInvitation?.details_title}
            </h2>
            
            <div className="text-center mb-4">
              <p 
                className="font-medium"
                style={{ color: config?.textColor }}
              >
                {currentInvitation?.ceremony_date}
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: config?.textColor }}>
                  {currentInvitation?.ceremony_times?.morning}
                </span>      
                <span style={{ color: config?.textColor }}>
                  {currentInvitation?.ceremony_times?.morning_desc}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: config?.textColor }}>
                  {currentInvitation?.ceremony_times?.afternoon}
                </span>
                <span style={{ color: config?.textColor }}>
                  {currentInvitation?.ceremony_times?.afternoon_desc}
                </span>   
              </div>
              <div className="flex justify-between">
                <span style={{ color: config?.textColor }}>
                  {currentInvitation?.ceremony_times?.evening}
                </span>
                <span style={{ color: config?.textColor }}>
                  {currentInvitation?.ceremony_times?.evening_desc}
                </span>   
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p 
                className="font-medium"
                style={{ color: config?.textColor }}
              >
                {currentInvitation?.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}