import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Function to send a message
  const sendMessage = () => {
    if (userInput.trim() === '') return;

    const userMessage = userInput.trim();
    const botResponse = getBotResponse(userMessage);

    setMessages([...messages, { sender: 'user', text: userMessage }]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: botResponse },
    ]);

    setUserInput(''); // Clear input field
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Bot response logic (simple predefined responses)
  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('price')) {
      return 'Our prices start at ₹12000 per night. For more details, please contact us.';
    } else if (lowerCaseMessage.includes('location') || lowerCaseMessage.includes('where')) {
      return 'We are located in the beautiful sunny city of Miami!';
    } else if (lowerCaseMessage.includes('offers') || lowerCaseMessage.includes('promotion')) {
      return 'Check out our special offers: 20% off for early bookings and free breakfast included!';
    } else if (lowerCaseMessage.includes('services')) {
      return 'We provide villa bookings, event planning, and customer support.';
    } else if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('reservation')) {
      return 'You can book a villa through our website or by contacting our support team.';
    } else if (lowerCaseMessage.includes('cancellation')) {
      return 'Our cancellation policy allows free cancellation up to 48 hours before check-in.';
    } else if (lowerCaseMessage.includes('check-in') || lowerCaseMessage.includes('check-out')) {
      return 'Check-in is at 3 PM and check-out is at 11 AM.';
    } else if (lowerCaseMessage.includes('amenities')) {
      return 'Our villas include free Wi-Fi, swimming pools, and kitchen facilities.';
    } else if (lowerCaseMessage.includes('benefit')) {
      return 'Listing your villa with us opens the door to a global audience, maximizing your property visibility. Our tailored marketing strategies, streamlined processes, and dedicated support ensure a hassle-free and lucrative hosting experience.';
    } else {
      return "I'm sorry, I didn't understand that. Could you try again? Or contact xx-";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-teal-700 text-white p-4 text-center text-xl font-semibold">
          AI Customer Support
        </div>
        <div className="p-4 space-y-4 h-96 overflow-auto bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block p-3 rounded-lg max-w-xs ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-teal-100 text-black'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex p-4 border-t border-gray-200">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full p-2 rounded-l-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-teal-600 text-white rounded-r-lg hover:bg-teal-500 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
