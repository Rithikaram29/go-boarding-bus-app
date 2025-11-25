import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalHost } from "../constants";
import { defaultBuses, DefaultBus } from "../../utils/defaultBuses";

import "../style/adminbus.css";

interface BookedSeat {
  SeatNumber: string;
  assignedTo: string;
  bookedBy: {
    _id: string;
    userName?: string;
    email?: string;
    name?: string;
  };
}

interface Trip {
  pickuplocation: string;
  pickupDateTime: string;
  dropLocation: string;
  dropDateTime: string;
  bookedSeats: BookedSeat[];
}

interface SeatsStructure {
  noOfSeatsInRowLeft: number;
  noOfSeatsInRowRight: number;
  noOfRowsInTotal: number;
  noOfSeatsInLastRow: number;
}

interface Bus {
  _id: string;
  busNo: string;
  busName: string;
  isAc: boolean;
  seats: SeatsStructure;
  trips: Trip[];
}

interface InputTrip {
  pickuplocation: string;
  pickupDateTime: string;
  dropLocation: string;
  dropDateTime: string;
}

const AdminBus: React.FC = () => {
  // const today: string = new Date().toISOString().split("T")[0];
  const [buses, setBuses] = useState<Bus[]>([]); // Use Bus type for buses
  const [busDetail, setBusDetail] = useState<Bus | null>(null); // Use Bus or null for busDetail
  const navigate = useNavigate();
  const [newTrips, setNewTrips] = useState<InputTrip[]>([]);
  const [updateTriggered, setUpdateTriggered] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await axios.get(`${LocalHost}/admin/bus`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const fetchedBuses = res.data || [];
        
        // Only show default buses if admin has not added any buses
        if (fetchedBuses.length === 0) {
          setBuses(defaultBuses as Bus[]);
        } else {
          // Show only admin buses when they exist
          setBuses(fetchedBuses);
        }
      } catch (error: any) {
        console.log("Error fetching buses:", error.message);
        // If fetch fails, show default buses as fallback
        setBuses(defaultBuses as Bus[]);
      }
    };

    fetchBuses();
    console.log("buses fetch triggered");
  }, [updateTriggered]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const busId = e.currentTarget.name;
    
    // Check if it's a default bus
    const defaultBus = defaultBuses.find((bus) => bus._id === busId);
    if (defaultBus) {
      setBusDetail(defaultBus as Bus);
      return;
    }

    try {
      const res = await axios.get(`${LocalHost}/admin/bus/details/${busId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setBusDetail(res.data[0]);
    } catch (error) {
      console.log("Error getting bus details:", error);
    }
  };

  const handleNewTripChange = (
    index: number,
    key: keyof Trip,
    value: string
  ) => {
    setNewTrips((prev) => {
      const updatedTrips: any = [...prev];
      updatedTrips[index][key] = value;
      return updatedTrips;
    });

    console.log(newTrips);
  };

  const handleAddTripInput = () => {
    setNewTrips((prev) => [
      ...prev,
      {
        pickuplocation: "",
        pickupDateTime: "",
        dropLocation: "",
        dropDateTime: "",
      },
    ]);
  };

  const resetSeats = (tripIndex: number) => {
    if (!busDetail) return;

    // Update the `bookedSeats` array for the specified trip
    setBusDetail((prev) => {
      if (!prev) return null;

      const updatedTrips = [...prev.trips];
      updatedTrips[tripIndex].bookedSeats = []; // Reset bookedSeats to an empty array
      return { ...prev, trips: updatedTrips };
    });
  };

  const handleUpdateBus = async () => {
    if (!busDetail) {
      alert("No bus selected!");
      return;
    }

    // Check if it's a default bus (demo bus)
    if (busDetail._id.startsWith("default-bus-")) {
      alert("This is a demo bus. Please add your own bus to make updates.");
      return;
    }

    try {
      // Merge the existing trips with new trips
      const updatedBusData = {
        ...busDetail,
        trips: [...busDetail.trips, ...newTrips],
      };

      console.log(updatedBusData);
      // Make the PUT request to update the bus
      const response = await axios.put(
        `${LocalHost}/admin/bus/add-trip/${busDetail.busNo}`,
        updatedBusData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the local state with the updated bus data
        setBusDetail(response.data.bus);
        setNewTrips([]); // Clear new trips state
        setUpdateTriggered((prev) => !prev);
        alert(response.data.message); // Display success message
        window.location.reload();
      } else {
        alert("Failed to update the bus!");
      }
    } catch (error: any) {
      console.error("Error updating the bus:", error.message);
      alert("An error occurred while updating the bus.");
    }
  };

  return (
    <div className="maindiv">
      <div className="buslist">
        <button onClick={() => navigate("/admin/addbus")}  style={{backgroundColor:"rgb(213, 223, 232)"}} className="busButton my-4" >
          Add Bus
        </button>
        <div>
          <h1 className="font-bold text-lg">Your Buses</h1>
          <div className="busnames">
            {buses.length > 0 ? (
              buses.map((bus: Bus) => (
                <div key={bus._id} style={{ position: "relative", display: "inline-block" }}>
                  <button
                    name={bus._id}
                    onClick={handleClick}
                    className="busname"
                  >
                    {bus.busNo}
                  </button>
                  {bus._id.startsWith("default-bus-") && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#666",
                        marginLeft: "4px",
                        fontStyle: "italic",
                      }}
                    >
                      (Demo)
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p>No buses present in your account</p>
            )}
          </div>
        </div>
      </div>

      <div className="busDetail ml-12 mt-3">
        {busDetail === null ? (
          <p>Select a bus to display details</p>
        ) : (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: "500" }}>
              {busDetail.busNo}
              {busDetail._id.startsWith("default-bus-") && (
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginLeft: "8px",
                    fontStyle: "italic",
                    fontWeight: "normal",
                  }}
                >
                  (Demo Bus)
                </span>
              )}
            </h2>
            <p><b>Name: </b>{busDetail.busName}</p>
            <p style={{color:"red",fontSize:"16px"}}>{busDetail.isAc ? "AC Bus" : "Non-AC Bus"}</p>
            {busDetail.trips.length > 0 ? (
              busDetail.trips.map((trip: any, index) => (
                <div
                  key={index}
                  className="my-3"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "rgb(213, 223, 232)",
                    boxShadow: "rgba(0, 0, 0, 0.4) 0px 1px 4px",
                    width:"fit-content",
                    padding:"10px"
                  }}
                >
                  <h3>Trip {index + 1}</h3>

                  <p>
                    <strong>Pickup:</strong> {trip.pickuplocation},{" "}
                    <strong>Date:</strong> {trip.pickupDateTime.slice(0,16).replace("T"," at ")}
                  </p>
                  <p>
                    <strong>Dropoff:</strong> {trip.dropLocation},{" "}
                    <strong>Date:</strong> {trip.dropDateTime.slice(0,16).replace("T"," at ")}
                  </p>
                  {trip.bookedSeats.length > 0 && (
                    <div>
                      {trip.bookedSeats.map((seat: any, seatIn: number) => (
                        <div key={seatIn}>
                          <p>SeatNo: {seat.SeatNumber}</p>
                          <p>Name: {seat.assignedTo}</p>
                        </div>
                      ))}
                      <button
                        onClick={() => resetSeats(index)}
                        className="bg-slate-800 text-white rounded-md p-2 mt-2"
                      >
                        Reset Seats
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No trips found</p>
            )}

            {newTrips.map((trip, index) => (
              <div key={index} className="w-96">
                <h4>New Trip {index + 1}</h4>
                <label>
                  Pickup Location:
                  <input
                    type="text"
                    value={trip.pickuplocation}
                    onChange={(e) =>
                      handleNewTripChange(
                        index,
                        "pickuplocation",
                        e.target.value
                      )
                    }
                    placeholder="Pickup Location"
                    className="outline-gray-600"
                  />
                </label>
                <label>
                  Pickup Date and Time:
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={trip.pickupDateTime}
                    onChange={(e) =>
                      handleNewTripChange(
                        index,
                        "pickupDateTime",
                        e.target.value
                      )
                    }
                    className="outline-gray-600"
                  />
                </label>
                <label>
                  Drop Location:
                  <input
                    type="text"
                    value={trip.dropLocation}
                    onChange={(e) =>
                      handleNewTripChange(index, "dropLocation", e.target.value)
                    }
                    placeholder="Drop Location"
                    className="outline-gray-600"
                  />
                </label>
                <label>
                  Drop Date and Time:
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={trip.dropDateTime}
                    onChange={(e) =>
                      handleNewTripChange(index, "dropDateTime", e.target.value)
                    }
                    className="outline-gray-600"
                  />
                </label>
              </div>
            ))}
            <button
              className="text-gray-500 hover:text-slate-950 rounded-md mx-4 p-2 mt-2 shadow-md"
              onClick={handleAddTripInput}
              style={{backgroundColor:"rgb(213, 223, 232)"}}
            >
              Add Another Trip
            </button>
            <button
              className="text-gray-500 hover:text-slate-950 rounded-md p-2 mt-2 shadow-md"
              onClick={handleUpdateBus}
              style={{backgroundColor:"rgb(213, 223, 232)"}}
            >
              Update Bus
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBus;
