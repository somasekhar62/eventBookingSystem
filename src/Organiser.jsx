import React, { useState } from "react";
import Navbar from "./Navbar";
const Organiser = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        eventName: "",
        eventType: "",
        venue: "",
        price: "",
        date: "",
        time: "",
        total_tickets:"",
        image: null,
    });

    const [editMode, setEditMode] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            eventName: "",
            eventType: "",
            venue: "",
            price: "",
            date: "",
            time: "",
            total_tickets:"",
            image: null,
        });
        setEditMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = new FormData();
        formPayload.append("eventName", formData.eventName);
        formPayload.append("eventType", formData.eventType);
        formPayload.append("venue", formData.venue);
        formPayload.append("price", formData.price);
        formPayload.append("date", formData.date);
        formPayload.append("time", formData.time);
        formPayload.append("total_tickets", formData.total_tickets);
        formPayload.append("image", formData.image); // imageFile is your selected image (File object)
        

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/create-event", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formPayload,
            });

            const result = await response.json();

            if (result.success) {
                alert("Event created successfully!");
                setEvents((prevEvents) => [...prevEvents, result.event]);
                resetForm();
            } else {
                alert("Error creating event. Please try again.");
            }
        } catch (error) {
            console.error("Error creating event:", error.message, error.stack);
            console.error("Error creating event:", error);
            alert("Error creating event. Please check the console for more details.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Organise Event</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Enter Event Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Event Type</option>
                                    <option value="educational">Educational</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="devotional">Devotional</option>
                                    <option value="business">Business</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Enter Venue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="0.00"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
    <label className="block text-sm font-medium text-gray-700">Max Tickets</label>
    <input
        type="number"
        name="total_tickets"
        value={formData.total_tickets}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder="Enter max number of tickets"
        min="1"
    />
</div>

                            <div>
  <label className="block text-sm font-medium text-gray-700">Event Image</label>
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
    }
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
  />
</div>
{formData.image && (
  <div className="mt-2">
    <p className="text-sm text-gray-500">Image Preview:</p>
    <img
      src={URL.createObjectURL(formData.image)}
      alt="Preview"
      className="mt-1 h-40 object-contain rounded"
    />
  </div>
)}
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                {editMode ? "Update Event" : "Create Event"}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Organiser;
