import React, { useState } from "react";
import "../style/addbus.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LocalHost } from "../constants";

interface SeatsStructure {
  noOfSeatsInRowLeft: number;
  noOfSeatsInRowRight: number;
  noOfRowsInTotal: number;
  noOfSeatsInLastRow: number;
}

interface Trip {
  pickuplocation: string;
  pickupDateTime: string;
  dropLocation: string;
  dropDateTime: string;
}

interface BusForm {
  busNo: string;
  busName: string;
  isAc: boolean;
  seats: SeatsStructure;
  trips: Trip[];
}

const initialFormState: BusForm = {
  busNo: "",
  busName: "",
  isAc: false,
  seats: {
    noOfSeatsInRowLeft: 0,
    noOfSeatsInRowRight: 0,
    noOfRowsInTotal: 0,
    noOfSeatsInLastRow: 0,
  },
  trips: [
    {
      pickuplocation: "",
      pickupDateTime: "",
      dropLocation: "",
      dropDateTime: "",
    },
  ],
};

const BusFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<BusForm>(initialFormState);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const today: string = new Date().toISOString().slice(0,16);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(today)
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSeatsChange = (key: keyof SeatsStructure, value: number) => {
    setFormData((prev) => ({
      ...prev,
      seats: {
        ...prev.seats,
        [key]: value,
      },
    }));
  };

  const handleAddTrip = () => {
    setFormData((prev) => ({
      ...prev,
      trips: [
        ...prev.trips,
        {
          pickuplocation: "",
          pickupDateTime: "",
          dropLocation: "",
          dropDateTime: "",
        },
      ],
    }));
  };

  const handleTripChange = (index: number, key: keyof Trip, value: any) => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!dateTimeRegex.test(value)) {
      value = value.toLowerCase();
    }

    setFormData((prev) => {
      const updatedTrips = [...prev.trips];
      updatedTrips[index][key] = value;
      return { ...prev, trips: updatedTrips };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Log form data to ensure busNo is set correctly
    

    if (!formData.busNo) {
      setMessage("Bus number is required.");
      console.log("busNo not there");
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        `${LocalHost}/admin/bus/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);

      alert("Bus created successfully");
      setFormData(initialFormState);
      
      if (response.status === 201) navigate("/");
    } catch (error: any) {
      setMessage(error.response.data.error? error.response.data.error:"Error adding bus. Please try again.");
      error.response.data.error && (alert(`${error.response.data.error} Add a different bus Number`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="heading">
        <h1>Bus Details</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Bus Number:
            <input
              type="text"
              name="busNo"
              value={formData.busNo}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Bus Name:
            <input
              type="text"
              name="busName"
              value={formData.busName}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Air Conditioned:
            <input
              type="checkbox"
              name="isAc"
              checked={formData.isAc}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* Seats Structure */}
        <h3>Seats Structure</h3>
        <div>
          <label>
            No. of Seats in Left Row:
            <input
              type="number"
              value={formData.seats.noOfSeatsInRowLeft}
              onChange={(e) =>
                handleSeatsChange(
                  "noOfSeatsInRowLeft",
                  parseInt(e.target.value, 10) || 0
                )
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            No. of Seats in Right Row:
            <input
              type="number"
              value={formData.seats.noOfSeatsInRowRight}
              onChange={(e) =>
                handleSeatsChange(
                  "noOfSeatsInRowRight",
                  parseInt(e.target.value, 10) || 0
                )
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            No. of Rows in Total:
            <input
              type="number"
              value={formData.seats.noOfRowsInTotal}
              onChange={(e) =>
                handleSeatsChange(
                  "noOfRowsInTotal",
                  parseInt(e.target.value, 10) || 0
                )
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            No. of Seats in Last Row:
            <input
              type="number"
              value={formData.seats.noOfSeatsInLastRow}
              onChange={(e) =>
                handleSeatsChange(
                  "noOfSeatsInLastRow",
                  parseInt(e.target.value, 10) || 0
                )
              }
              required
            />
          </label>
        </div>

        {/* Trips */}
        <h3>Trips</h3>
        {formData.trips.map((trip, index) => (
          <div key={index}>
            <h4>Trip {index + 1}</h4>
            <label>
              Pickup Location:
              <input
                type="text"
                value={trip.pickuplocation}
                onChange={(e) =>
                  handleTripChange(index, "pickuplocation", e.target.value)
                }
                required
              />
            </label>
            <label>
              Pickup Date and Time:
              <input
                type="datetime-local"
                min={today}
                value={trip.pickupDateTime}
                onChange={(e) =>
                  handleTripChange(index, "pickupDateTime", e.target.value)
                }
                required
              />
            </label>
            <label>
              Drop Location:
              <input
                type="text"
                value={trip.dropLocation}
                onChange={(e) =>
                  handleTripChange(index, "dropLocation", e.target.value)
                }
                required
              />
            </label>
            <label>
              Drop Date and Time:
              <input
                type="datetime-local"
                min={today}
                value={trip.dropDateTime}
                onChange={(e) =>
                  handleTripChange(index, "dropDateTime", e.target.value)
                }
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddTrip}>
          Add Trip
        </button>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"}
        >
          Submit
        </button>
      </form>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default BusFormComponent;
