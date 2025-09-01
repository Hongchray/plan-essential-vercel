"use client"

import { useState } from "react";

export default function TabTemplate({guests, setGuests, expenses, setExpenses}: {guests: any[], setGuests: (guests: any[]) => void, expenses: any[], setExpenses: (expenses: any[]) => void}) {
  // Template Component
  const [selectedTemplate, setSelectedTemplate] = useState('invitation');
    
    const templates = {
      invitation: {
        title: 'Event Invitation',
        content: `You're Invited!

Join us for an amazing celebration that you won't want to miss.

📅 Date: Saturday, September 15th
⏰ Time: 7:00 PM
📍 Location: The Grand Ballroom
🎭 Dress Code: Cocktail Attire

Please RSVP by September 1st.

We can't wait to see you there!`
      },
      reminder: {
        title: 'Event Reminder',
        content: `Don't Forget!

This is a friendly reminder about our upcoming event.

📅 Tomorrow at 7:00 PM
📍 The Grand Ballroom

What to bring:
• Your ticket (digital or printed)
• A positive attitude
• Your dancing shoes!

See you soon!`
      },
      thankyou: {
        title: 'Thank You',
        content: `Thank You!

We wanted to extend our heartfelt gratitude for joining us at our recent event.

Your presence made the evening truly special, and we hope you had as wonderful a time as we did.

Keep an eye out for photos from the event - we'll be sharing them soon!

Until next time,
The Event Team`
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Template:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="invitation">Invitation</option>
            <option value="reminder">Reminder</option>
            <option value="thankyou">Thank You</option>
          </select>
        </div>

        <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <h4 className="text-xl font-bold mb-4 text-slate-900">
              {templates[selectedTemplate].title}
            </h4>
            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
              {templates[selectedTemplate].content}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Edit Template
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors">
            Send Preview
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors">
            Download PDF
          </button>
        </div>
      </div>
    );
}