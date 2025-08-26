"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

// Dynamic templates
const DynamicComponents = {
  KhmerWeddingInvite: dynamic(() => import("./wedding/basic-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
  TraditionalCeremony: dynamic(() => import("./wedding/traditional-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
  ModernCeremony: dynamic(() => import("./wedding/style-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-khmer">កំពុងផ្ទុក... (Loading...)</p>
      </div>
    </div>
  )
}

async function getPreviewTemplate(id: string) {
  try {
    const res = await fetch(`/api/admin/template/${id}`)
    if (!res.ok) throw new Error("Failed to fetch template")
    return await res.json()
  } catch {
    toast.error("Error getting template")
    return null
  }
}

export default function Preview({ id }: { id: string }) {
  const [selectedComponent, setSelectedComponent] = useState("modern")
  const [template, setTemplate] = useState<any>(null)

  // Fetch template once
  useEffect(() => {
    if (!id) return
    getPreviewTemplate(id).then((data) => data && setTemplate(data))
  }, [id])

  // Sample data
  const weddingData = useMemo(
    () => ({
      groom: {
        name: "លោក ចន្ទ្រា សុខា",
        nameEn: "Mr. Chantra Sokha",
        parents: "លោក ចន្ទ្រា ភៃឡៃ និង លោកស្រី ម៉ៅ សុភាព",
      },
      bride: {
        name: "កញ្ញា លី សុវណ្ណា",
        nameEn: "Ms. Li Sovanna",
        parents: "លោក លី ចន្ទុល និង លោកស្រី យឹម បូផា",
      },
      ceremony: {
        traditional: {
          date: "ថ្ងៃសុក្រ ១០កើត ខែមាឃ ឆ្នាំរកា ឆស័ក ព.ស.២៥៦៧",
          dateEn: "Friday, February 10th, 2024",
          time: "ម៉ោង ៦:០០ ព្រឹក",
          timeEn: "6:00 AM",
          location: "ផ្ទះកូនប្រុស ភូមិអង្គរក្រុម សង្កាត់ស្លៀក ក្រុងសៀមរាប",
        },
        modern: {
          date: "ថ្ងៃសៅរ៍ ១១កើត ខែមាឃ ឆ្នាំរកា ឆស័ក ព.ស.២៥៦៧",
          dateEn: "Saturday, February 11th, 2024",
          time: "ម៉ោង ៦:០០ ល្ងាច",
          timeEn: "6:00 PM",
          location: "សណ្ឋាគារ សុភាមង្គល សៀមរាប",
        },
      },
    }),
    []
  )

  if (!template) {
    return <div className="p-6 text-gray-500">Loading template...</div>
  }

  const ComponentToRender =
    selectedComponent === "invite"
      ? DynamicComponents.KhmerWeddingInvite
      : selectedComponent === "traditional"
      ? DynamicComponents.TraditionalCeremony
      : DynamicComponents.ModernCeremony

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 ">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 ">
        <div className="max-w-6xl mx-auto px-4 ">
          <div className="flex justify-center space-x-4 py-4">
            {[
              { key: "invite", labelKh: "កាត​អញ្ជើញ", labelEn: "Invitation" },
              { key: "traditional", labelKh: "ពិធីប្រពៃណី", labelEn: "Traditional" },
              { key: "modern", labelKh: "ពិធីសម័យ", labelEn: "Modern" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setSelectedComponent(btn.key)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedComponent === btn.key
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-100"
                }`}
              >
                <span className="khmer-font">{btn.labelKh}</span>
                <br />
                <span className="text-sm">{btn.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Dynamic Content */}
      {/* <main className=" mx-auto "> */}
        <ComponentToRender data={weddingData} />
      {/* </main> */}
    </div>
  )
}
