import React, { useState } from "react";
import { X, Calendar, MapPin, CreditCard, Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BookingPage = ({ event, onClose, isOpen, onBookingSuccess }) => {
    if (!isOpen || !event) return null;

    const [ticketCount, setTicketCount] = useState(1);
    const [isBooking, setIsBooking] = useState(false);

    const handleDecrement = () => {
        if (ticketCount > 1) {
          setTicketCount(prev => prev - 1);
        }
    };
    
    const handleIncrement = () => {
        if (ticketCount < Math.min(10, event.available_tickets)) {
          setTicketCount(prev => prev + 1);
        }
    };

    const subtotal = event.price * ticketCount;
    const bookingFee = subtotal * 0.02;
    const total = subtotal + bookingFee;

    const confirmBooking = async () => {
        setIsBooking(true);
        const customer = JSON.parse(localStorage.getItem("user"));
        const customerId = customer?.id;

        try {
          const response = await fetch("http://localhost:5000/book-event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customerId, 
              event_id: event.id,
              event_name: event.event_name,
              category: event.category,
              event_date: event.date,
              event_time: event.time,
              location: event.venue,
              price: event.price,
              ticketsToBook: ticketCount,
            }),
          });
      
          if (response.ok) {
            toast.success("Event booked successfully!");
            if (onBookingSuccess) {
              onBookingSuccess(event.id, ticketCount);
            }
            console.log("Closing popup...")
            onClose();
          } else {
            const data = await response.json();
            toast.warning(data.response?.data?.message || "Booking failed. Please try again.");
          }
        } catch (error) {
          console.error("🚫 Booking error:", error);
          toast.error(error.response?.data?.message || "Booking failed. Please try again.");
        } finally {
          setIsBooking(false);
        }
    };
      
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Booking</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isBooking}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <img
                src={event.image_url}
                alt={event.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{event.event_name}</h3>
                <div className="flex items-center text-gray-600 mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()} - {event.time}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="font-medium text-sm text-green-600">
                    {event.available_tickets} tickets available
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDecrement}
                  className={`p-2 rounded-full ${
                    ticketCount <= 1 || isBooking
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  disabled={ticketCount <= 1 || isBooking}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{ticketCount}</span>
                <button
                  onClick={handleIncrement}
                  className={`p-2 rounded-full ${
                    ticketCount >= Math.min(10, event.available_tickets) || isBooking
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  disabled={ticketCount >= Math.min(10, event.available_tickets) || isBooking}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">(Max 10 tickets per booking)</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Ticket Price (x{ticketCount})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Booking Fee (2%)</span>
                <span>${bookingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span className="text-[#1A73E8]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isBooking}
            >
              Cancel
            </button>
            <button
              onClick={confirmBooking}
              className={`flex-1 px-4 py-2 ${
                isBooking ? 'bg-blue-400' : 'bg-[#1A73E8] hover:bg-blue-700'
              } text-white rounded-lg transition-colors`}
              disabled={isBooking}
            >
              {isBooking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;