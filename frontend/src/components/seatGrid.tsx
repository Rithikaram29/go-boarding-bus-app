import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BookedSeat {
  SeatNumber: string;
  assignedTo: string;
  bookedBy: string;
}

interface SeatData {
  date: string;
  busNo: string;
  noOfRowsInTotal: number;
  noOfSeatsInLastRow: number;
  noOfSeatsInRowLeft: number;
  noOfSeatsInRowRight: number;
  bookedSeats: BookedSeat[];
}

interface SeatGridProps {
  seatData: SeatData;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seatData }) => {
  const {
    date,
    busNo,
    noOfRowsInTotal,
    noOfSeatsInLastRow,
    noOfSeatsInRowLeft,
    noOfSeatsInRowRight,
    bookedSeats,
  } = seatData;

  useEffect(()=>{console.log(bookedSeats)},[])

  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<
    { seatNumber: string; passengerName: string }[]
  >([]);

  const rows = noOfRowsInTotal - 1;

  // Check if the seat is booked
  const isSeatBooked = (seatNumber: string): boolean =>
    bookedSeats.some((seat) => seat.SeatNumber === seatNumber);


  // Handle seat click (toggle seat selection)
  const handleSeatClick = (seatNumber: string) => {
    setSelectedSeats(
      (prevSelected) =>
        prevSelected.find((seat) => seat.seatNumber === seatNumber)
          ? prevSelected.filter((seat) => seat.seatNumber !== seatNumber) // Deselect
          : [...prevSelected, { seatNumber, passengerName: "" }] // Select with an empty name
    );
  };

  // Handle input change for passenger names
  const handleNameChange = (seatNumber: string, name: string) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.map((seat) =>
        seat.seatNumber === seatNumber
          ? { ...seat, passengerName: name } // Update passenger name
          : seat
      )
    );
  };

  // Determine seat CSS class based on its status
  const getSeatClass = (seatNumber: string, booked: boolean): string => {
    if (booked){ return "bg-gray-400 cursor-not-allowed"};
    if (selectedSeats.find((seat) => seat.seatNumber === seatNumber)){
      return "bg-green-500"}
    return "bg-blue-500 hover:bg-blue-600";
  };

  const bookTicketsHandle = async () => {
    try {
      // Fetch user details to check if the user is logged in
      const fetchUser = async () => {
        try {
          const res = await axios.get("http://localhost:4000/user/account", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if necessary
            },
          });

          const data = res.data[0];
          return {
            name: data.userName,
            role: data.role,
          };
        } catch (error) {
          console.error("Error fetching user:", error);
          return null;
        }
      };

      console.log(busNo);
      const currentUser = await fetchUser();

      if (!currentUser) {
        alert("Please log in to book tickets.");
        navigate("/login");
        return;
      }

      // Validate selected seats and passenger names
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }

      // Check if all selected seats have passenger names
      if (selectedSeats.some((seat) => !seat.passengerName)) {
        alert("Please provide passenger names for all selected seats.");
        return;
      }

      // Prepare the payload for booking tickets
      const payload = {
        date,
        seats: selectedSeats.map((seat) => ({
          seatNo: seat.seatNumber,
          name: seat.passengerName,
        })),
      };

      // Make an axios PUT request to book the tickets
      const res = await axios.put(
        `http://localhost:4000/user/book-ticket/${busNo}`, // Include the bus ID in the URL
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if necessary
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      if (res.status === 200) {
        console.log("Tickets booked successfully!", res.data);
        // setSelectedSeats([]); // Clear selected seats after booking
        navigate("/user/profile");
      }
    } catch (error: any) {
      console.error("Error booking tickets:", error);
      alert(
        error.response?.data?.error ||
          "Failed to book tickets. Please try again."
      );
    }
  };

  return (
    <>
      {/* main div */}
      <div className="flex space-x-5 bg-white">
       
        <div
          className="flex flex-col items-center gap-8"
          style={{
            border: "1px solid black",
            width: "fit-content",
            padding: "0.5%",
          }}
        >
          <h2>Bus Front</h2>

          {/* Top Row: Left and Right Sections */}
          <div className="flex gap-16">
            {/* Left Block */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${noOfSeatsInRowLeft}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows * noOfSeatsInRowLeft }).map(
                (_, index) => {
                  const seatNumber = `L${index + 1}`;
                  const booked = isSeatBooked(seatNumber);

                  // console.log(`Seat: ${seatNumber}, Booked: ${booked}`);

                  return (
                    <button
                      key={`left-${index}`}
                      className={`w-8 h-8 ${getSeatClass(
                        seatNumber,
                        booked
                      )} border border-gray-200`}
                      disabled={booked}
                      onClick={() => handleSeatClick(seatNumber)}
                    >
                      {seatNumber}
                    </button>
                  );
                }
              )}
            </div>

            {/* Right Block */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${noOfSeatsInRowRight}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows * noOfSeatsInRowRight }).map(
                (_, index) => {
                  const seatNumber = `R${index + 1}`;
                  const booked = isSeatBooked(seatNumber);

                  return (
                    <button
                      key={`right-${index}`}
                      className={`w-8 h-8 ${getSeatClass(
                        seatNumber,
                        booked
                      )} border border-gray-200`}
                      disabled={booked}
                      onClick={() => handleSeatClick(seatNumber)}
                    >
                      {seatNumber}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateRows: `repeat(1, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${noOfSeatsInLastRow}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: noOfSeatsInLastRow }).map((_, index) => {
              const seatNumber = `B${index + 1}`;
              const booked = isSeatBooked(seatNumber);

              // console.log(`Seat: ${seatNumber}, Booked: ${booked}`);

              return (
                <button
                  key={`last-${index}`}
                  className={`w-8 h-8 ${getSeatClass(
                    seatNumber,
                    booked
                  )} border border-gray-200`}
                  disabled={booked}
                  onClick={() => handleSeatClick(seatNumber)}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        </div>
         {/* Selected Seats */}
         {selectedSeats.length > 0 && (
          <div className="mt-4 shadow-lg p-4 rounded-md">
            <h2 className="text-lg font-bold">Passenger Details:</h2>
            {selectedSeats.map((seat, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <label className="font-bold">{seat.seatNumber}:</label>
                <input
                  type="text"
                  placeholder="Passenger name"
                  className="border border-gray-300 px-2 py-1 rounded-lg"
                  value={seat.passengerName}
                  onChange={(e) =>
                    handleNameChange(seat.seatNumber, e.target.value)
                  }
                />
              </div>
            ))}
            <button
              onClick={() => bookTicketsHandle()}
              className="p-1 m-1 shadow-md hover:opacity-60"
            >
              BOOK TICKETS
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SeatGrid;
