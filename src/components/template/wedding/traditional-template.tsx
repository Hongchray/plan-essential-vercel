export default function TraditionalCeremony({ data }) {
  const ceremonies = [
    {
      name: 'ពិធីកាត់សក់',
      nameEn: 'Hair Cutting Ceremony',
      time: '6:00 AM - 7:00 AM',
      description: 'ការកាត់សក់ជារបៀបប្រពៃណីខ្មែរ ដើម្បីសម្អាតខ្លួន'
    },
    {
      name: 'ពិធីសែនដៃ',
      nameEn: 'Sen Dey Ceremony',
      time: '7:00 AM - 8:00 AM',
      description: 'ការចងខ្សែសាមក្កីដៃ ដើម្បីនាំយកសុភមង្គល'
    },
    {
      name: 'ពិធីបាយបេន',
      nameEn: 'Bay Ben Ceremony',
      time: '8:00 AM - 10:00 AM',
      description: 'ការបង្វែរកូនស្រីឱ្យទៅកាន់ផ្ទះកូនប្រុស'
    },
    {
      name: 'ពិធីសំពះ',
      nameEn: 'Sompeah Ceremony',
      time: '10:00 AM - 11:00 AM',
      description: 'ការបង្គំទៅកាន់ឪពុកម្ដាយទាំងពីរខាង'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className=" text-4xl font-bold text-center text-red-700 mb-8">
          ពិធីប្រពៃណីខ្មែរ
        </h2>
        <p className="text-center text-xl text-gray-600 mb-8">Traditional Khmer Wedding Ceremony</p>
        
        <div className="grid gap-6">
          {ceremonies.map((ceremony, index) => (
            <div key={index} className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-6 border-l-4 border-red-500">
              <div className="flex items-start space-x-4">
                <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="khmer-font text-2xl font-bold text-red-700">{ceremony.name}</h3>
                  <p className="text-lg text-gray-700 font-semibold">{ceremony.nameEn}</p>
                  <p className="text-yellow-700 font-medium mb-2">{ceremony.time}</p>
                  <p className="khmer-font text-gray-600">{ceremony.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-red-100 rounded-2xl p-6 text-center">
          <h3 className="khmer-font text-2xl font-bold text-red-800 mb-4">ការណែនាំសម្រាប់ភ្ញៀវ</h3>
          <p className="text-lg text-gray-700 mb-2">Guidelines for Guests</p>
          <ul className="text-left max-w-2xl mx-auto space-y-2">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>សូមស្លៀកពាក់ឱ្យបានសមរម្យ តាមប្រពៃណី (Please dress modestly and traditionally)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>សូមទទួលទានអាហារ និងភេសជ្ជៈដែលបានរៀបចំ (Please enjoy the food and drinks provided)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>ការថតរូប នឹងអនុញ្ញាតក្នុងសមយុទ្ធផល (Photography allowed at appropriate times)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}