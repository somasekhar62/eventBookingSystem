import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const YourEvents = () => {
  const [events, setEvents] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
 
  const organiserId = user?.id; 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/your-events`,{method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // <-- send token
          },
        });

        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          setError(data.message || "Failed to fetch events.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("An error occurred while fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organiserId]);

  if (loading) {
    return <div className="p-4 text-center">Loading events...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Your Events</h1>

          {events.length === 0 ? (
            <div className="text-gray-500">No events found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.event_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.event_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.venue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
    </>
  );
};

export default YourEvents;
    