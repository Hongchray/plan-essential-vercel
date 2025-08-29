import { useState } from 'react'
import Image from 'next/image'

export default function KhmerWeddingInvite({ data }) {
  const [showRSVP, setShowRSVP] = useState(false)
  const [rsvpData, setRsvpData] = useState({
    name: '',
    attending: '',
    guests: 1,
    phone: ''
  })

  const handleRSVPSubmit = (e) => {
    e.preventDefault()
    // Handle RSVP submission
    alert('RSVP បានបញ្ជូនដោយជោគជ័យ! (RSVP sent successfully!)')
    setShowRSVP(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Khmer:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        .khmer-font {
          font-family: 'Noto Serif Khmer', serif;
        }
        
        .traditional-border {
          border-image: linear-gradient(45deg, #dc2626, #facc15, #dc2626) 1;
          border-style: solid;
          border-width: 3px;
        }
        
        .lotus-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      {/* Main Invitation Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden lotus-bg">
        {/* Header with Traditional Pattern */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-yellow-600 text-white text-center py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20l-8-8h16l-8 8zm0 0l8-8v16l-8-8zm0 0l8 8H4l8-8zm0 0l-8 8V4l8 8z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E\")"
            }}></div>
          </div>
          <div className="relative z-10">
            <h1 className="khmer-font text-4xl font-bold mb-4">កាតអញ្ជើញមង្គលការ</h1>
            <p className="text-xl opacity-90">Wedding Invitation</p>
            <div className="mt-6 text-6xl">💐 🕯️ 💐</div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Couple Names */}
          <div className="text-center mb-12">
            <div className="khmer-font text-3xl md:text-4xl font-bold text-red-700 mb-2">
              {data.groom.name}
            </div>
            <div className="text-xl text-gray-600 mb-4">{data.groom.nameEn}</div>
            
            <div className="my-8 flex items-center justify-center">
              <div className="h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent flex-1 max-w-32"></div>
              <span className="mx-4 text-4xl text-yellow-600">❤️</span>
              <div className="h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent flex-1 max-w-32"></div>
            </div>
            
            <div className="khmer-font text-3xl md:text-4xl font-bold text-red-700 mb-2">
              {data.bride.name}
            </div>
            <div className="text-xl text-gray-600">{data.bride.nameEn}</div>
          </div>

          {/* Parents */}
          <div className="bg-red-50 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="khmer-font text-xl font-semibold text-red-700 mb-2">ឪពុកម្ដាយកូនប្រុស</h3>
                <p className="text-sm text-gray-600 mb-2">Parents of the Groom</p>
                <p className="khmer-font text-lg">{data.groom.parents}</p>
              </div>
              <div className="text-center">
                <h3 className="khmer-font text-xl font-semibold text-red-700 mb-2">ឪពុកម្ដាយកូនស្រី</h3>
                <p className="text-sm text-gray-600 mb-2">Parents of the Bride</p>
                <p className="khmer-font text-lg">{data.bride.parents}</p>
              </div>
            </div>
          </div>

          {/* Invitation Text */}
          <div className="text-center mb-8 bg-yellow-50 rounded-2xl p-6">
            <p className="khmer-font text-xl leading-relaxed text-gray-800 mb-4">
              សូមអញ្ជើញញាតិមិត្តជាទីស្នេហា មកចូលរួមក្នុងពិធីមង្គលការ 
              របស់យើងខ្ញុំ ដើម្បីធ្វើសាក្សីនៃការចាប់ផ្តើមជីវិតថ្មី
              ក្នុងស្នេហានិងសុភមង្គល
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We cordially invite you to witness and celebrate 
              our wedding ceremony as we begin our new journey 
              together in love and happiness.
            </p>
          </div>

          {/* Ceremony Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Traditional Ceremony */}
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-6 traditional-border">
              <h3 className="khmer-font text-2xl font-bold text-red-800 mb-4 text-center">
                ពិធីប្រពៃណីខ្មែរ
              </h3>
              <p className="text-center text-gray-700 font-semibold mb-4">Traditional Khmer Ceremony</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="khmer-font font-semibold">{data.ceremony.traditional.date}</p>
                    <p className="text-sm text-gray-600">{data.ceremony.traditional.dateEn}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  <div>
                    <p className="khmer-font font-semibold">{data.ceremony.traditional.time}</p>
                    <p className="text-sm text-gray-600">{data.ceremony.traditional.timeEn}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">📍</span>
                  <div>
                    <p className="khmer-font">{data.ceremony.traditional.location}</p>
                    <p className="text-sm text-gray-600">Groom's Family Home</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Ceremony */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 traditional-border">
              <h3 className="khmer-font text-2xl font-bold text-yellow-800 mb-4 text-center">
                ពិធីសម័យ
              </h3>
              <p className="text-center text-gray-700 font-semibold mb-4">Modern Reception</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="khmer-font font-semibold">{data.ceremony.modern.date}</p>
                    <p className="text-sm text-gray-600">{data.ceremony.modern.dateEn}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  <div>
                    <p className="khmer-font font-semibold">{data.ceremony.modern.time}</p>
                    <p className="text-sm text-gray-600">{data.ceremony.modern.timeEn}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">🏨</span>
                  <div>
                    <p className="khmer-font">{data.ceremony.modern.location}</p>
                    <p className="text-sm text-gray-600">Sophea Mongkol Hotel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="text-center">
            <button
              onClick={() => setShowRSVP(!showRSVP)}
              className="bg-gradient-to-r from-red-600 to-yellow-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-700 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <span className="khmer-font">សូមឆ្លើយតប</span> | RSVP
            </button>

            {showRSVP && (
              <div className="mt-6 bg-gray-50 rounded-2xl p-6">
                <form onSubmit={handleRSVPSubmit} className="max-w-md mx-auto">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="ឈ្មោះរបស់អ្នក / Your Name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={rsvpData.name}
                      onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                      required
                    />
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={rsvpData.attending}
                      onChange={(e) => setRsvpData({...rsvpData, attending: e.target.value})}
                      required
                    >
                      <option value="">មកចូលរួម? / Will you attend?</option>
                      <option value="yes">បាទ/ចាស មកចូលរួម / Yes, I will attend</option>
                      <option value="no">សុំទោស មិនអាចមកបាន / Sorry, cannot attend</option>
                    </select>
                    <input
                      type="number"
                      placeholder="ចំនួនភ្ញៀវ / Number of Guests"
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={rsvpData.guests}
                      onChange={(e) => setRsvpData({...rsvpData, guests: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="លេខទូរស័ព្ទ / Phone Number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={rsvpData.phone}
                      onChange={(e) => setRsvpData({...rsvpData, phone: e.target.value})}
                    />
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <span className="khmer-font">បញ្ជូន</span> | Send RSVP
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-center bg-gradient-to-r from-red-50 via-white to-yellow-50 rounded-2xl p-6">
            <p className="khmer-font text-lg text-gray-700 mb-2">
              ការមានវត្តមានរបស់លោកអ្នក គឺជាអំណោយដ៏មានតម្លៃបំផុតសម្រាប់យើងខ្ញុំ
            </p>
            <p className="text-gray-600">
              Your presence is the greatest gift we could ask for
            </p>
            <div className="mt-4 text-3xl">
              🙏 ❤️ 🙏
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}