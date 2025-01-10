<<<<<<< HEAD:frontend/src/components/DoctorConsultationRequests.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DoctorConsultationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [zoomLevels, setZoomLevels] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef(null);

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
        console.error("Error fetching consultation requests:", error.response ? error.response.data : error.message);
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
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error.response ? error.response.data : error.message);
      alert("Failed to update status. Please check the console for more details.");
    }
  };

  const handleViewImages = (images) => {
    setSelectedImages(images);
    setShowImages(true);
    setZoomLevels({}); // Reset zoom levels when opening new images
    setCurrentSlideIndex(0); // Reset current slide index
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => {
      setZoomLevels(prev => ({ ...prev, [current]: 1 })); // Reset zoom on image change
    },
    afterChange: (index) => {
      setCurrentSlideIndex(index); // Update current slide index
    },
  };

  const zoomIn = () => {
    setZoomLevels(prev => ({
      ...prev,
      [currentSlideIndex]: (prev[currentSlideIndex] || 1) + 0.1
    }));
  };

  const zoomOut = () => {
    setZoomLevels(prev => ({
      ...prev,
      [currentSlideIndex]: Math.max((prev[currentSlideIndex] || 1) - 0.1, 1)
    }));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-600">Consultation Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">No consultation requests available.</p>
      ) : (
        <ul className="space-y-6">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
              <div className="w-1/4 border-r border-gray-300 flex items-center justify-center p-4 relative">
                {request.imageUrls.length > 0 && (
                  <div className="relative w-full h-full">
                    <img
                      src={request.imageUrls[0]}
                      alt="Background"
                      className="absolute inset-0 w-full h-full object-cover filter blur-[0.1px]"
                      style={{ zIndex: -1 }}
                    />
                    <button
                      onClick={() => handleViewImages(request.imageUrls)}
                      className="relative p-2 bg-blue-500 text-white rounded-lg shadow z-10 opacity-90 hover:opacity-100 transition duration-200"
                    >
                      View Images
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 p-6">
                <h3 className="text-2xl font-semibold text-blue-700">{request.patientUsername}</h3>
                <p className="text-gray-600 font-bold mb-2">
                  Requested Date: {formatDateTime(request.date)}
                </p>
                <p className="text-gray-600 font-bold mb-2">
                  Start Time: {request.startTime}
                </p>
                <p className="text-gray-600 font-bold mb-2">
                  End Time: {request.endTime}
                </p>
                <p className="text-gray-600 font-bold mb-2">Description: {request.description}</p>
                <p className="text-gray-600 font-bold mb-4">
                  Status: <span className={`font-extrabold ${request.status === "Completed" ? "text-green-600" : request.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>{request.status}</span>
                </p>

                <div className="mt-4 flex space-x-2">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, "Accepted")}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 shadow"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, "Rejected")}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "Accepted" && (
                    <button
                      onClick={() => updateStatus(request.id, "Confirmed")}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow"
                    >
                      Confirm
                    </button>
                  )}
                  {request.status === "Confirmed" && (
                    <button
                      onClick={() => updateStatus(request.id, "Completed")}
                      className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-200 shadow"
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

      {showImages && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Consultation Images</h2>
            <div className="relative">
              <Slider ref={sliderRef} {...settings}>
                {selectedImages.map((url, index) => (
                  <div key={index} className="flex justify-center relative">
                    <img
                      src={url}
                      alt={`Consultation - ${index + 1}`}
                      className={`rounded-lg shadow-md transition-transform duration-200`}
                      style={{
                        width: '100%', 
                        height: '300px', 
                        objectFit: 'cover', 
                        transform: `scale(${zoomLevels[index] || 1})` 
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/fallback/image.jpg"; 
                      }}
                    />
                  </div>
                ))}
              </Slider>
              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={zoomIn}
                  className="p-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition duration-200"
                  aria-label="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={zoomOut}
                  className="p-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition duration-200"
                  aria-label="Zoom Out"
                >
                  -
                </button>
              </div>
              {/* Navigation Arrows */}
              <button
                onClick={() => sliderRef.current.slickPrev()}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200"
              >
                &#8592;
              </button>
              <button
                onClick={() => sliderRef.current.slickNext()}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200"
              >
                &#8594;
              </button>
            </div>
            <button
              onClick={() => setShowImages(false)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorConsultationRequests;
=======
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DoctorConsultationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [zoomLevels, setZoomLevels] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef(null);

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
        console.error(
          "Error fetching consultation requests:",
          error.response ? error.response.data : error.message
        );
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
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to update status. Please check the console for more details.");
    }
  };

  const handleViewImages = (images) => {
    if (!images || images.length === 0) {
      alert("No images available for this request.");
      return;
    }
    setSelectedImages(images);
    setShowImages(true);
    setZoomLevels({});
    setCurrentSlideIndex(0);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => {
      setZoomLevels((prev) => ({ ...prev, [current]: 1 }));
    },
    afterChange: (index) => {
      setCurrentSlideIndex(index);
    },
  };

  const zoomIn = () => {
    setZoomLevels((prev) => ({
      ...prev,
      [currentSlideIndex]: (prev[currentSlideIndex] || 1) + 0.1,
    }));
  };

  const zoomOut = () => {
    setZoomLevels((prev) => ({
      ...prev,
      [currentSlideIndex]: Math.max(
        (prev[currentSlideIndex] || 1) - 0.1,
        1
      ),
    }));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
        Consultation Requests
      </h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">
          No consultation requests available.
        </p>
      ) : (
        <ul className="space-y-6">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
              <div className="w-1/4 border-r border-gray-300 flex items-center justify-center p-4 relative">
                {request.imageUrls.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={request.imageUrls[0]}
                      alt="Background"
                      className="absolute inset-0 w-full h-full object-cover filter blur-[0.1px]"
                      style={{ zIndex: -1 }}
                    />
                    <button
                      onClick={() => handleViewImages(request.imageUrls)}
                      className="relative p-2 bg-blue-500 text-white rounded-lg shadow z-10 opacity-90 hover:opacity-100 transition duration-200"
                    >
                      View Images
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">No images available</p>
                )}
              </div>
              <div className="flex-1 p-6">
                <h3 className="text-2xl font-semibold text-blue-700">
                  {request.patientUsername}
                </h3>
                <p className="text-gray-600 font-bold mb-2">
                  Requested Date: {formatDateTime(request.date)}
                </p>
                <p className="text-gray-600 font-bold mb-2">
                  Start Time: {request.startTime}
                </p>
                <p className="text-gray-600 font-bold mb-2">
                  End Time: {request.endTime}
                </p>
                <p className="text-gray-600 font-bold mb-2">
                  Description: {request.description}
                </p>
                <p className="text-gray-600 font-bold mb-4">
                  Status:{" "}
                  <span
                    className={`font-extrabold ${
                      request.status === "Completed"
                        ? "text-green-600"
                        : request.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>

                <div className="mt-4 flex space-x-2">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, "Accepted")}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 shadow"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, "Rejected")}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "Accepted" && (
                    <button
                      onClick={() => updateStatus(request.id, "Confirmed")}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow"
                    >
                      Confirm
                    </button>
                  )}
                  {request.status === "Confirmed" && (
                    <button
                      onClick={() => updateStatus(request.id, "Completed")}
                      className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-200 shadow"
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

      {showImages && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Consultation Images
            </h2>
            <div className="relative">
              <Slider ref={sliderRef} {...settings}>
                {selectedImages.map((url, index) => (
                  <div key={index} className="flex justify-center relative">
                    <img
                      src={url}
                      alt={`Consultation - ${index + 1}`}
                      className={`rounded-lg shadow-md transition-transform duration-200`}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        transform: `scale(${zoomLevels[index] || 1})`,
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/path/to/fallback-image.jpg"; // Replace with your fallback image path
                      }}
                    />
                  </div>
                ))}
              </Slider>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={zoomIn}
                  className="p-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition duration-200"
                >
                  +
                </button>
                <button
                  onClick={zoomOut}
                  className="p-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition duration-200"
                >
                  -
                </button>
              </div>
              <button
                onClick={() => sliderRef.current.slickPrev()}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200"
              >
                &#8592;
              </button>
              <button
                onClick={() => sliderRef.current.slickNext()}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200"
              >
                &#8594;
              </button>
            </div>
            <button
              onClick={() => setShowImages(false)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorConsultationRequests;
>>>>>>> 60a392a (modified code):src/components/DoctorConsultationRequests.js
