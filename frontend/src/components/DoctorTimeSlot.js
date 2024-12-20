import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorTimeSlots = ({ doctorId }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '', isAvailable: true });
    const [editingSlot, setEditingSlot] = useState({ id: null, date: '', startTime: '', endTime: '', isAvailable: true });
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format date to yyyy-MM-dd
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format date to yyyy-MM-dd
    };

    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}/time-slots`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTimeSlots(response.data.slots || []);
            } catch (error) {
                console.error('Error fetching time slots:', error.response || error);
            }
        };

        fetchTimeSlots();
    }, [doctorId]);

    const handleCreateSlot = async () => {
        if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;

        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:5000/api/doctor/${doctorId}/time-slots`,
                { slots: [newSlot] },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setTimeSlots([...timeSlots, ...response.data.slots]);
            setNewSlot({ date: '', startTime: '', endTime: '', isAvailable: true });
        } catch (error) {
            console.error('Error creating time slot:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSlot = async () => {
        if (!editingSlot.id || !editingSlot.date || !editingSlot.startTime || !editingSlot.endTime) {
            console.error("Invalid editingSlot data", editingSlot);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:5000/api/doctor/${doctorId}/time-slot/${editingSlot.id}`,
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
            const updatedSlot = {
                ...response.data.slot,
                date: formatDate(response.data.slot.date), // Format date here
            };
            setTimeSlots(timeSlots.map(slot =>
                slot.id === editingSlot.id ? updatedSlot : slot
            ));
            setEditingSlot({ id: null, date: '', startTime: '', endTime: '', isAvailable: true });
        } catch (error) {
            console.error('Error updating time slot:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = async (timeSlotId) => {
        const confirmed = window.confirm("Are you sure you want to delete this time slot?");
        if (!confirmed) return;

        setLoading(true);
        try {
            await axios.delete(
                `http://localhost:5000/api/doctor/${doctorId}/time-slot/${timeSlotId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setTimeSlots(timeSlots.filter(slot => slot.id !== timeSlotId));
        } catch (error) {
            console.error('Error deleting time slot:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-r from-indigo-100 to-blue-100 min-h-screen">
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-8 rounded-lg shadow-xl mb-8">
                <h3 className="text-3xl font-semibold text-white mb-6 text-center">Create a New Time Slot</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        min={getTodayDate()}
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

            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Existing Time Slots</h3>
                <ul className="space-y-6">
                    {timeSlots.length === 0 ? (
                        <p>No time slots available.</p>
                    ) : (
                        timeSlots.map((slot) => (
                            <li key={slot.id} className="flex flex-col sm:flex-row items-center p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-gray-50">
                                {editingSlot.id === slot.id ? (
                                    <div className="flex flex-wrap justify-between items-center w-full">
                                        <input
                                            type="date"
                                            value={editingSlot.date}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                                            className="p-2 border-2 border-gray-300 rounded-lg mr-2"
                                        />
                                        <input
                                            type="time"
                                            value={editingSlot.startTime}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                                            className="p-2 border-2 border-gray-300 rounded-lg mr-2"
                                        />
                                        <input
                                            type="time"
                                            value={editingSlot.endTime}
                                            onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                                            className="p-2 border-2 border-gray-300 rounded-lg mr-2"
                                        />
                                        <div className="flex items-center mr-2">
                                            <input
                                                type="checkbox"
                                                checked={editingSlot.isAvailable}
                                                onChange={(e) => setEditingSlot({ ...editingSlot, isAvailable: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <label className="text-gray-700">Available</label>
                                        </div>
                                        <button onClick={handleUpdateSlot} className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                                            Update
                                        </button>
                                        <button onClick={() => setEditingSlot({ id: null, date: '', startTime: '', endTime: '', isAvailable: true })} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex flex-col">
                                            <p className="font-semibold">
                                                Date: {formatDate(slot.date)}, Start Time: {slot.startTime} - End Time: {slot.endTime}
                                            </p>
                                            <p className={`text-gray-600 ${slot.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                                {slot.isAvailable ? 'Available' : 'Unavailable'}
                                            </p>
                                        </div>
                                        <div>
                                            <button onClick={() => {
                                                setEditingSlot({
                                                    id: slot.id,
                                                    date: formatDate(slot.date),
                                                    startTime: slot.startTime,
                                                    endTime: slot.endTime,
                                                    isAvailable: slot.isAvailable
                                                });
                                            }} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteSlot(slot.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
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
