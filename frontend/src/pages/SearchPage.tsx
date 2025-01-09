import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import SeatGrid from "../components/seatGrid";
import "../components/style/searchBar.css";
import SideBar from "../components/SideBar";
import { LocalHost } from "../components/constants";

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [filteredResults, setFilteredResults] = useState<any>(null);
  const [error, setError] = useState<any>("");
  const [inputdata, setInputdata] = useState<any>({});
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [sort,setSort] = useState<boolean>(false);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Fetch data on initial load
  useEffect(() => {
    const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
    if (searchData && Object.keys(searchData).length > 0) {
      setInputdata(searchData);
      fetchBusDetails(searchData);
    }
  }, []);

  // Fetch bus details based on the search data
  const fetchBusDetails = async (searchData: any) => {
    try {
      const response = await axios.get(`${LocalHost}/user/findbus`, {
        params: searchData,
      });

      console.log(response);
      if (response.data.length === 0) {
        setError("No buses available for the selected route.");
      } else {
        setSearchResults(response.data);
        setFilteredResults(response.data);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No buses available for the selected route.");
      } else if (err.response?.status === 400) {
        setError("Invalid search parameters. Please check your inputs.");
      } else {
        setError("Failed to fetch bus details.");
      }
      console.error("Error fetching bus details:", err);
    }
  };

  // Handle form submission and update localStorage
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((e.target as any).from.value === "" || (e.target as any).to.value === "") {
      alert("Add search inputs.");
      return;
    }

    const formData = {
      from: (e.target as any).from.value,
      to: (e.target as any).to.value,
      date: (e.target as any).date.value,
    };
    localStorage.setItem("searchData", JSON.stringify(formData));
    setInputdata(formData); // Update state to trigger useEffect
    setSearchOpen(false); // Close the form

    window.location.reload()
  };

  // Filter function
  const handleFilter = (filters: string) => {
    if (!searchResults) return;

    const filterArray = filters.split(",");

    const filtered = searchResults.filter((bus: any) =>
      bus.trips.some((trip: any) => {
        const pickupTime = new Date(trip.pickupDateTime).getHours();
        const dropTime = new Date(trip.dropDateTime).getHours();

        console.log(pickupTime, dropTime);
        return filterArray.every((filter) => {
          if (filter.startsWith("pickup")) {
            if (filter === "pickupBefore6am") {
              return pickupTime < 6;
            } else if (filter === "pickup6am-4pm") {
              return pickupTime >= 6 && pickupTime < 16;
            } else if (filter === "pickupAfter4pm") {
              return pickupTime >= 16;
            }
          } else if (filter.startsWith("drop")) {
            if (filter === "dropBefore6am") {
              return dropTime < 6;
            } else if (filter === "drop6am-4pm") {
              return dropTime >= 6 && dropTime < 16;
            } else if (filter === "dropAfter4pm") {
              return dropTime >= 16;
            }
          }
          return true;
        });
      })
    );

    if (filters === "reset") {
      setFilteredResults(searchResults); // Reset to original results
    } else {
      setFilteredResults(filtered);
    }
  };

  const handleSort = (sortType: string, order: "asc" | "desc") => {
    if (!filteredResults) return;
  
    setSort((prev)=> !prev)

    const sortedResults = [...filteredResults].sort((a: any, b: any) => {
      const getEarliestTrip = (bus: any, key: "pickupDateTime" | "dropDateTime") => {
        return bus.trips.reduce((selectedTrip: any, currentTrip: any) => {
          return new Date(currentTrip[key]).getTime() <
            new Date(selectedTrip[key]).getTime()
            ? currentTrip
            : selectedTrip;
        });
      };
  
      const tripA =
        sortType === "duration"
          ? a.trips[0]
          : getEarliestTrip(a, sortType === "departure" ? "pickupDateTime" : "dropDateTime");
      const tripB =
        sortType === "duration"
          ? b.trips[0]
          : getEarliestTrip(b, sortType === "departure" ? "pickupDateTime" : "dropDateTime");
  
      const calculateDuration = (trip: any) => {
        const pickupTime = new Date(trip.pickupDateTime).getTime();
        const dropTime = new Date(trip.dropDateTime).getTime();
        return Math.abs(dropTime - pickupTime);
      };
  
      let comparison = 0;
  
      if (sortType === "departure") {
        comparison =
          new Date(tripA.pickupDateTime).getTime() -
          new Date(tripB.pickupDateTime).getTime();
      } else if (sortType === "arrival") {
        comparison =
          new Date(tripA.dropDateTime).getTime() -
          new Date(tripB.dropDateTime).getTime();
      } else if (sortType === "duration") {
        const durationA = calculateDuration(tripA);
        const durationB = calculateDuration(tripB);
        comparison = durationA - durationB;
      }
  
      return order === "asc" ? comparison : -comparison;
    });
  
    setFilteredResults(sortedResults);
  };
  

  const openSeat = (
    bus: any,
    currentTrip: any,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setSelectedTrip([bus, currentTrip]);
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY + 10, // Position below the card
      left: buttonRect.left + window.scrollX - 10, // Align with the card
    });
    setShowPopup(true);
  };

  return (
    <>
      <NavBar />
      <div className="flex">
        <SideBar onFilter={handleFilter} />
        <div>
          <div className="w-full">
            {searchOpen ? (
              <>
                <form
                  onSubmit={handleFormSubmit}
                  className="flex-row space-x-3 items-center"
                >
                  <label>
                    From:
                    <input
                      type="text"
                      name="from"
                      defaultValue={inputdata.from || ""}
                    />
                  </label>
                  <label>
                    To:
                    <input
                      type="text"
                      name="to"
                      defaultValue={inputdata.to || ""}
                    />
                  </label>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      defaultValue={inputdata.date || ""}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </label>
                  <button
                    type="submit"
                    className="shadow-sm hover:bg-slate-100 py-1 px-3"
                  >
                    Search
                  </button>
                </form>
              </>
            ) : (
              <div className="flex m-2 items-center">
                <p>
                  <b>{inputdata.from}</b> to <b>{inputdata.to}</b> on{" "}
                  <b>{inputdata.date}</b>
                </p>
                <button
                  className="mx-6 shadow-sm px-3 py-1 bg-slate-200 hover:bg-blue-600"
                  style={{borderRadius:"10px"}}
                  onClick={() => setSearchOpen((prev: boolean) => !prev)}
                >
                  Modify
                </button>
              </div>
            )}
          </div>
          <div className="sort-controls">
            <button
              onClick={() => handleSort("departure", `${sort ? "asc" : "desc"}`)}
             className="p-2 m-2 shadow-md rounded-sm bg-slate-200 hover:bg-blue-600 "
            >
              Sort by Departure
            </button>
            <button
              onClick={() => handleSort("arrival", `${sort ? "asc" : "desc"}`)}
             className="p-2 m-2 shadow-md rounded-sm bg-slate-200 hover:bg-blue-600 "
            >
              Sort by Arrival
            </button>
            <button
              onClick={() => handleSort("duration", `${sort ? "asc" : "desc"}`)}
              className="p-2 m-2 shadow-md rounded-sm bg-slate-200 hover:bg-blue-600 "
            
            >
              Sort by Duration
            </button>
          </div>
          <p></p>
          {filteredResults && (
            <div className="results">
              {filteredResults.error ? (
                <p className="error">{filteredResults.error}</p>
              ) : (
                <ul>
                  <p className="m-1 ml-3 text-red-700">
                    {" "}
                    <b>{filteredResults.length} </b>buses found from{" "}
                    <b>{inputdata.from} </b>to <b>{inputdata.to}</b>
                  </p>
                  {filteredResults.map((bus: any, index: number) => (
                    <div
                      key={index}
                      className="buscard flex-col shadow-lg mb-4 w-[1000px] m-3 px-3 py-2"
                      style={{borderRadius:"10px", backgroundColor:"rgb(239, 248, 255)"}}
                    >
                      <li>{bus.busNo}</li>{" "}
                      <div>
                        {bus.trips.length > 0
                          ? bus.trips.map((trip: any, tripIndex: number) => {
                              const tripDate: any = new Date(
                                trip.pickupDateTime
                              );
                              const tripDateString = tripDate.toLocaleString(); // For better readability (date and time)

                              const dropDate: any = new Date(trip.dropDateTime);
                              const dropDateString = dropDate.toLocaleString();

                              // Calculate trip duration
                              const duration = Math.abs(dropDate - tripDate);
                              const durationInHours = Math.floor(
                                duration / (1000 * 60 * 60)
                              ); // In hours
                              const durationInMinutes = Math.floor(
                                (duration % (1000 * 60 * 60)) / (1000 * 60)
                              ); // In minutes
                              const durationString = `${durationInHours}h ${durationInMinutes}m`;

                              if (
                                trip.pickuplocation.toLowerCase() ===
                                  inputdata.from.toLowerCase() &&
                                trip.dropLocation.toLowerCase() ===
                                  inputdata.to.toLowerCase() &&
                                tripDate.toISOString().split("T")[0] ===
                                  inputdata.date
                              ) {
                                return (
                                  <div key={tripIndex} className="h-fit" >
                                    <p>
                                      {trip.pickuplocation} to{" "}
                                      {trip.dropLocation}
                                    </p>
                                    <p>
                                      <b>Pick Time: </b>
                                      {tripDateString}
                                      <br></br>
                                      <b>Drop Time: </b> {dropDateString}
                                    </p>
                                    <p>
                                      <b>Duration: </b>
                                      {durationString}
                                    </p>
                                    <button
                                      onClick={(event) => {
                                        openSeat(bus, trip, event);
                                        console.log(selectedTrip);
                                      }}
                                      className="p-1 px-3 shadow-md rounded-sm bg-blue-400 hover:bg-blue-600"
                                    >
                                      Seats
                                    </button>
                                  </div>
                                );
                              }
                              return null;
                            })
                          : null}
                      </div>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {showPopup && selectedTrip && popupPosition && (
          <div
            className="popupmain"
            style={{
              position: "absolute",
              top: popupPosition.top,
              left: popupPosition.left,
              zIndex: 1000, // Ensure it appears above other elements
            }}
          >
            <div className="popup bg-white p-10"  style={{position:"absolute", width:"70vw" , borderRadius:"10px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
              <button
                onClick={() => setShowPopup(false)}
                className="p-2 mb-2 rounded-sm shadow-md  bg-blue-400 hover:bg-blue-700"
              >
                HIDE SEATS
              </button>
              {selectedTrip[0].seats && (
                <div>
                <div className="bg-white" >
                  <SeatGrid
                    seatData={{
                      date: inputdata.date,
                      busNo: selectedTrip[0].busNo,
                      ...selectedTrip[0].seats,
                      ...selectedTrip[1],
                    }}
                  />
                </div>
                </div>
              ) }
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
