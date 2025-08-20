import React, { useState } from "react";

const staticReasons = [
  "Change in Travel Plans",
  "Found a Better Option",
  "Emergency or Personal Issues",
  "Plans Got Postponed"
];


export default function CancelBookingModal({ onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    const finalReason = selectedReason === "Other" ? customReason : selectedReason;
    if (!finalReason.trim()) return alert("Please provide a valid reason");
    onSubmit(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-[95%] max-w-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold text-gray-800">Cancel Booking</h2>
        <p className="text-sm text-gray-600">Please select a reason for cancellation:</p>
        <div className="space-y-2">
          {staticReasons.map((reason) => (
            <label key={reason} className="block">
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
              />
              <span className="ml-2">{reason}</span>
            </label>
          ))}
          <label className="block">
            <input
              type="radio"
              name="reason"
              value="Other"
              checked={selectedReason === "Other"}
              onChange={() => setSelectedReason("Other")}
            />
            <span className="ml-2">Other</span>
          </label>
          {selectedReason === "Other" && (
            <textarea
              className="w-full mt-2 border rounded-md p-2 text-sm"
              placeholder="Write your reason here..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
