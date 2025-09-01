'use client'
import { useState } from "react";
import { columns } from "./guest-table/columns";
import { DataTable } from "./guest-table/data-table";

export default function TabGuest({guests, setGuests}: {guests: any[], setGuests: (guests: any[]) => void}) {
  // Guest Component
  const [newGuest, setNewGuest] = useState({ name: '', email: '', group: '', tags: '' });
    const [filterGroup, setFilterGroup] = useState('all');

    const groups = ["Groom's side", "Bride's side"];

    const addGuest = () => {
      if (newGuest.name && newGuest.email && newGuest.group) {
        const tags = newGuest.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        setGuests([...guests, {
          id: guests.length + 1,
          name: newGuest.name,
          email: newGuest.email,
          group: newGuest.group,
          tags: tags,
          status: 'pending',
          gift: { received: false, item: '', value: 0 }
        }]);
        setNewGuest({ name: '', email: '', group: '', tags: '' });
      }
    };

    const removeGuest = (id) => {
      setGuests(guests.filter(guest => guest.id !== id));
    };

    const updateStatus = (id, status) => {
      setGuests(guests.map(guest => 
        guest.id === id ? { ...guest, status } : guest
      ));
    };

    const filteredGuests = guests.filter(guest => 
      filterGroup === 'all' || guest.group === filterGroup
    );

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Guest Management</h3>
        
        {/* <div className="bg-slate-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-3">Add New Guest</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Guest name"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email address"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <select
              value={newGuest.group}
              onChange={(e) => setNewGuest({ ...newGuest, group: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Group</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newGuest.tags}
              onChange={(e) => setNewGuest({ ...newGuest, tags: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addGuest}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Guest
          </button>
        </div> */}

        <div className="space-y-3">  
           
            {/* Table guests */}
            <DataTable data={guests} columns={columns} />
        </div>
      </div>
    );

}