import React, { useEffect, useState }  from 'react';
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";


// // Temporary mock data for booked events
// const bookedEvents = [
//   {
//     id: 1,
//     name: "Tech Summit 2024",
//     category: "Business",
//     date: "March 15, 2024",
//     time: "09:00 AM",
//     location: "Silicon Valley Convention Center",
//     price: 299,
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
//     bookingDate: "2024-02-15",
//     status: "Confirmed"
//   },
//   {
//     id: 3,
//     name: "Classical Music Night",
//     category: "Cultural",
//     date: "May 5, 2024",
//     time: "07:00 PM",
//     location: "Grand Opera House",
//     price: 149,
//     image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
//     bookingDate: "2024-02-10",
//     status: "Confirmed"
//   },
//   {
//     id: 4,
//     name: "Tech Summit 2024",
//     category: "Business",
//     date: "March 15, 2024",
//     time: "09:00 AM",
//     location: "Silicon Valley Convention Center",
//     price: 299,
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
//     bookingDate: "2024-02-15",
//     status: "Confirmed"
//   },

//   {
//     id: 5,
//     name: "Tech Summit 2024",
//     category: "Business",
//     date: "March 15, 2024",
//     time: "09:00 AM",
//     location: "Silicon Valley Convention Center",
//     price: 299,
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
//     bookingDate: "2024-02-15",
//     status: "Confirmed"
//   },
// ];






const BookedEventCard = ({ event, onCancel }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-4">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 h-48 md:h-auto">
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-53 object-cover"
          loading="lazy"
          />
      </div>
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.event_name}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
  {new Date(event.event_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} - {event.event_time?.slice(0, 5)}
</span>

            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              {event.status}
            </span>
            <p className="text-gray-600 text-sm mt-2">
  Booked on:{" "}
  {new Date(event.booking_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}
</p>

          </div>
        </div>
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-[#1A73E8] font-bold text-xl">${event.price}</span>
          <div className="space-x-3">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
              View Ticket
            </button>
            <button
             onClick={() => onCancel(event.id)}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-colors duration-300">
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MyEvents = () => {
  const navigate = useNavigate();
  const [bookedEvents, setBookedEvents] = useState([]);

  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/booked-events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booked events");
        }

        const data = await response.json();
        setBookedEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching booked events:", error);
      }
    };

    fetchBookedEvents();
  }, []);



const handleCancelBooking = async (bookingId) => {

  const toastId = toast.info(
    <div>
      <p>Are you sure you want to cancel this booking?</p>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() =>{ 
            toast.dismiss(toastId);
            confirmCancel(bookingId);}}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Yes
        </button>
        <button onClick={()=> toast.dismiss(toastId)} className="bg-gray-300 px-4 py-1 rounded">No</button>
      </div>
    </div>,
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      position: "top-center",
    }
  );
};

const confirmCancel = async (bookingId) => {

  try {
    const response = await fetch("http://localhost:5000/cancel-booking", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({ bookingId }),
    });
    
    const text = await response.text();
    
    if (!response.ok) {
      console.log("Server response:", text);
      throw new Error("Failed to cancel booking.");
    }
    
    setBookedEvents(prevEvents => prevEvents.filter(event => event.id !== bookingId));
    toast.success("Booking cancelled successfully.");
  } catch (error) {
    console.error("Cancel failed:", error);
    console.error("Cancel failed:", error);

    toast.error("Failed to cancel booking.");
  }
};



  return (
    <div className="min-h-screen bg-[#F5F5F5] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-4">

        <button 
            onClick={() => navigate('/customer')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div> 
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-2">Manage events and tickets</p>
        </div>
        </div>
        
        <div className="space-y-6">
          {bookedEvents.length > 0 ? (
            bookedEvents.map(event => (
              <BookedEventCard key={event.id} event={event} onCancel={handleCancelBooking}/>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-900">No events booked yet</h3>
              <p className="text-gray-600 mt-2">Browse and book events to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEvents;