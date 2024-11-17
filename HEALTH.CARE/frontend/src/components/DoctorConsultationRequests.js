import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorConsultationRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctors/requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching consultation requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const updateStatus = async (requestId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/doctors/requests/${requestId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: newStatus,
              }
            : req
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        `Failed to update status: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Consultation Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">No consultation requests available.</p>
      ) : (
        <ul className="space-y-6">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex bg-white border  border-gray-300 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              {request.imageUrl && (
                <img
                  src={request.imageUrl}
                  alt="Consultation"
                  className="w-1/3 h-auto object-cover border-r border-gray-300"
                />
              )}
              <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold text-blue-700">{request.patientUsername}</h3>
                <p className="text-gray-600 font-bold text-black mb-2">
                  Requested Time:{" "}
                  {request.dateTime ? new Date(request.dateTime).toLocaleString() : "N/A"}
                </p>
                <p className="text-gray-600 font-bold text-black mb-2">Description: {request.description}</p>
                <p className="text-gray-600 font-bold text-black mb-4">Status: {request.status}</p>

                <div className="mt-4">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, "Accepted")}
                        className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, "Rejected")}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "Accepted" && (
                    <button
                      onClick={() => updateStatus(request.id, "Confirmed")}
                      className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                      Confirm
                    </button>
                  )}
                  {request.status === "Confirmed" && (
                    <button
                      onClick={() => updateStatus(request.id, "Completed")}
                      className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition duration-200"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorConsultationRequests;
