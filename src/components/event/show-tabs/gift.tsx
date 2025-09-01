"use client";
import { SetStateAction, useState } from "react";

export default function TabGift({
  guests,
  setGuests,
  expenses,
  setExpenses,
}: {
  guests: any[];
  setGuests: (guests: any[]) => void;
  expenses: any[];
  setExpenses: (expenses: any[]) => void;
}) {
  // Gift Component
  const [editingGift, setEditingGift] = useState(null);
  const [giftForm, setGiftForm] = useState({ item: "", value: "" });

  const updateGift = (
    guestId: any,
    giftData: { item: string; value: number; received: boolean }
  ) => {
    setGuests(
      guests.map((guest) =>
        guest.id === guestId
          ? { ...guest, gift: { ...guest.gift, ...giftData } }
          : guest
      )
    );
    setEditingGift(null);
    setGiftForm({ item: "", value: "" });
  };

  const startEditing = (guest: {
    id: SetStateAction<null>;
    gift: { item: any; value: any };
  }) => {
    setEditingGift(guest.id);
    setGiftForm({
      item: guest.gift.item || "",
      value: guest.gift.value || "",
    });
  };

  const toggleReceived = (guestId: any) => {
    setGuests(
      guests.map((guest) =>
        guest.id === guestId
          ? {
              ...guest,
              gift: { ...guest.gift, received: !guest.gift.received },
            }
          : guest
      )
    );
  };

  const totalGiftValue = guests
    .filter((guest) => guest.gift.received)
    .reduce((sum, guest) => sum + (guest.gift.value || 0), 0);

  const receivedGifts = guests.filter((guest) => guest.gift.received).length;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Gifts</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {receivedGifts}
          </div>
          <div className="text-sm text-green-800">Gifts Received</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ${totalGiftValue.toFixed(2)}
          </div>
          <div className="text-sm text-purple-800">Total Value</div>
        </div>
      </div>

      <div className="space-y-3">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="flex items-start justify-between p-4 border border-slate-200 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium mb-1">{guest.name}</div>

              {editingGift === guest.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Gift item"
                    value={giftForm.item}
                    onChange={(e) =>
                      setGiftForm({ ...giftForm, item: e.target.value })
                    }
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Value ($)"
                    value={giftForm.value}
                    onChange={(e) =>
                      setGiftForm({
                        ...giftForm,
                        value: e.target.value,
                      })
                    }
                    className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() =>
                      updateGift(guest.id, {
                        item: giftForm.item,
                        value: parseFloat(giftForm.value) || 0,
                        received: true,
                      })
                    }
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingGift(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  {guest.gift.received ? (
                    <div>
                      <span className="font-medium">Gift: </span>
                      {guest.gift.item || "Not specified"}
                      {guest.gift.value > 0 &&
                        ` ($${guest.gift.value.toFixed(2)})`}
                    </div>
                  ) : (
                    <span className="text-gray-500">No gift recorded</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => toggleReceived(guest.id)}
                className={`px-3 py-1 text-xs rounded-full ${
                  guest.gift.received
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {guest.gift.received ? "Received" : "Not Received"}
              </button>
              <button
                onClick={() => startEditing(guest)}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
              >
                {guest.gift.received ? "Edit" : "Add Gift"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
