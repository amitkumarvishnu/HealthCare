import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorTimeSlots = ({ doctorId }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '', isAvailable: true });
    const [editingSlot, setEditingSlot] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to format the date (optional: use libraries like moment.js or date-fns for more control)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats the date in the user's local format
    };

    // Function to format the time (HH:mm)
    const formatTime = (timeString) => {
        if (!timeString) return '';  // Return empty string if timeString is invalid
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    // Fetch existing time slots for the doctor
    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}/time-slots`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTimeSlots(response.data.slots || []); // Assuming the response contains a slots array
            } catch (error) {
                console.error('Error fetching time slots:', error.response || error);
            }
        };

        fetchTimeSlots();
    }, [doctorId]);

    // Handle creating a new time slot
    const handleCreateSlot = async () => {
        if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
            return; // Prevent empty time slots from being created
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:5000/api/doctor/${doctorId}/time-slots`,
                { slots: [newSlot] }, // Pass slots as an array
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setTimeSlots([...timeSlots, ...response.data.slots]); // Add new slots to the list
            setNewSlot({ date: '', startTime: '', endTime: '', isAvailable: true }); // Clear the input fields
        } catch (error) {
            console.error('Error creating time slot:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    // Handle updating an existing time slot
    const handleUpdateSlot = async (timeSlotId) => {
        if (!editingSlot.date || !editingSlot.startTime || !editingSlot.endTime) {
            return; // Prevent updating if the time fields are empty
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:5000/api/doctor/${doctorId}/time-slot/${timeSlotId}`,
                {
                    date: editingSlot.date,
                    startTime: editingSlot.startTime,
                    endTime: editingSlot.endTime,
                    isAvailable: editingSlot.isAvailable,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setTimeSlots(timeSlots.map(slot => 
                slot.id === timeSlotId ? response.data.slot : slot
            ));
            setEditingSlot(null); // Close the editing form
        } catch (error) {
            console.error('Error updating time slot:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting a time slot
    const handleDeleteSlot = async (timeSlotId) => {
        setLoading(true);
        try {
            // Make the API call to delete the time slot
            await axios.delete(
                `http://localhost:5000/api/doctor/${doctorId}/time-slot/${timeSlotId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            // Once deleted, remove the time slot from the state (UI update)
            setTimeSlots(timeSlots.filter(slot => slot.id !== timeSlotId)); // Remove the deleted slot
        } catch (error) {
            console.error('Error deleting time slot:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-r from-indigo-100 to-blue-100 min-h-screen">
            {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Your Time Slots</h2> */}

            {/* Create Time Slot Form */}
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-8 rounded-lg shadow-xl mb-8">
                <h3 className="text-3xl font-semibold text-white mb-6 text-center">Create a New Time Slot</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300"
                        required
                    />
                    <input
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300"
                        required
                    />
                    <input
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300"
                        required
                    />
                    <button
                        onClick={handleCreateSlot}
                        className="col-span-2 p-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 disabled:opacity-50"
                        disabled={loading || !newSlot.date || !newSlot.startTime || !newSlot.endTime}
                    >
                        {loading ? 'Creating...' : 'Create Time Slot'}
                    </button>
                </div>
            </div>

            {/* Existing Time Slots */}
            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Existing Time Slots</h3>
                <ul className="space-y-6">
                    {timeSlots.length === 0 ? (
                        <p>No time slots available.</p>
                    ) : (
                        timeSlots.map((slot) => (
                            <li key={slot.id} className="flex flex-col sm:flex-row items-center p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                {editingSlot?.id === slot.id ? (
                                    <div className="flex flex-wrap justify-between items-center w-full">
                                        <input
                                            type="date"
                                            value={editingSlot.date}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                                            className="p-4 border-2 border-gray-300 rounded-xl mr-4 mb-4 sm:mb-0"
                                        />
                                        <input
                                            type="time"
                                            value={editingSlot.startTime}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                                            className="p-4 border-2 border-gray-300 rounded-xl mr-4 mb-4 sm:mb-0"
                                        />
                                        <input
                                            type="time"
                                            value={editingSlot.endTime}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                                            className="p-4 border-2 border-gray-300 rounded-xl mr-4 mb-4 sm:mb-0"
                                        />
                                        <select
                                            value={editingSlot.isAvailable}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, isAvailable: e.target.value === 'true' })}
                                            className="p-4 border-2 border-gray-300 rounded-xl mr-4 mb-4 sm:mb-0"
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </select>
                                        <button
                                            onClick={() => handleUpdateSlot(slot.id)}
                                            className="p-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => setEditingSlot(null)}
                                            className="p-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ml-4"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-lg font-semibold text-gray-700">{formatDate(slot.date)} {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                        <span className={`text-lg font-semibold ${slot.isAvailable ? 'text-green-600' : 'text-red-600'}`}>{slot.isAvailable ? 'Available' : 'Unavailable'}</span>
                                        <div>
                                            <button
                                                onClick={() => setEditingSlot({ id: slot.id, date: slot.date, startTime: slot.startTime, endTime: slot.endTime, isAvailable: slot.isAvailable })}
                                                className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSlot(slot.id)}
                                                className="p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DoctorTimeSlots;
