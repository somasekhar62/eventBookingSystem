import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Search, User, LogOut, Ticket } from "lucide-react";
import { FiSearch, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
import BookingPage from "./BookingPage"; 


const EventCard = ({ event,  onBookNow }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
    <div className="relative h-48 overflow-hidden">
      <img
        src={event.image_url || "https://via.placeholder.com/400x300?text=Event"}
        alt={event.event_name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        loading="lazy"
      />  
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.event_name}</h3>
      <div className="flex items-center text-gray-600 mb-2">
        <FiCalendar className="mr-2" />
        <span>{new Date(event.date).toLocaleDateString()} - {event.time?.slice(0, 5)}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <FiMapPin className="mr-2" />
        <span>{event.venue}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#FF6B35] font-bold text-xl">${event.price}</span>
        <button
        onClick={() => onBookNow(event)}
        className="bg-[#1A73E8] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
          Book Now
        </button>
      </div>
    </div>
  </div>
);

const CustomerHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  

  const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events"); 
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);


  const handleBookNow = async (event) => {
    const customer = JSON.parse(localStorage.getItem("user")); // Assuming user is stored after login
    const customerId = customer?.id;
  
    if (!customerId) {
      toast.warning("Please login to book events.");
      return navigate("/login");
    }
    setSelectedEvent(event);
  setIsBookingModalOpen(true);
  };


  const handleBookingSuccess = (eventId, ticketCount) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? {...event, available_tickets: event.available_tickets - ticketCount} 
          : event
      )
    );
  };
  
  


  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.event_type.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#1A73E8]">Event.io</h1>
              <div className="hidden md:flex space-x-8 ml-10">
                {["All", "Business", "Sports", "Cultural", "Entertainment", "Educational"].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${selectedCategory === category ? "text-[#1A73E8]" : "text-gray-600"} hover:text-[#1A73E8] transition-colors duration-300`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 relative">
  {/* Search Input */}
  <div className="relative">
    <input
      type="text"
      placeholder="Search events..."
      className="w-64 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <FiSearch className="absolute right-4 top-3 text-gray-400" />
  </div>

  {/* User/Profile Button */}
  <div className="relative">
    <button
      onClick={() => setIsProfileOpen(!isProfileOpen)}
      className="flex items-center space-x-2 text-gray-600 hover:text-[#1A73E8] focus:outline-none"
    >
      <User className="w-5 h-5" />
    </button>

    {isProfileOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
        <button
          className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => {
            setIsProfileOpen(false);
            // Handle my events click
            navigate("/my-events");
          }}
        >
          <Ticket className="w-4 h-4" />
          <span>My Events</span>
        </button>
        <button
          className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => {
            setIsProfileOpen(false);
            // Handle logout click
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            setIsProfileOpen(false);
            navigate("/login");
            
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
</div>

          </div>
        </div>
      </nav>


      {loading ? (
  <div className="text-center py-20 text-gray-600 text-lg">
    Loading events...
  </div>
) : (
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredEvents.map(event => (
        <EventCard key={event.id} event={event} onBookNow={handleBookNow} />
      ))}
    </div>
  </main>
)}

<BookingPage
        event={selectedEvent}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess} 
      />
      

      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h2 className="text-xl font-bold text-[#1A73E8] mb-4">Event.io</h2>
              <p className="text-gray-600">Your premier destination for discovering and booking amazing events.</p>
            </div>
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">Business</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">Sports</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">Cultural</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1A73E8]">Entertainment</a></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-[#1A73E8]"><FaFacebook size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-[#1A73E8]"><FaTwitter size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-[#1A73E8]"><FaInstagram size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-[#1A73E8]"><FaLinkedin size={24} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">&copy; 2024 Event.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerHome;