import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import SeatGrid from "../components/seatGrid";
import "../components/style/searchBar.css";
import SideBar from "../components/SideBar";
import { LocalHost } from "../components/constants";
import { defaultBuses } from "../utils/defaultBuses";

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
  const [sort, setSort] = useState<boolean>(false);
  console.log("filteredResults", filteredResults);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Fetch data on initial load
  useEffect(() => {
    const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
    console.log("searchData", searchData);

    if (searchData && Object.keys(searchData).length > 0 && searchData.from && searchData.to && searchData.date) {
      setInputdata(searchData);
      fetchBusDetails(searchData);
    } else {
      // If no search data, show search form
      setSearchOpen(true);
      // Set today's date as default
      const today = new Date().toISOString().split("T")[0];
      setInputdata({ from: "", to: "", date: today });
    }
  }, []);

  // Fetch bus details based on the search data
  const fetchBusDetails = async (searchData: any) => {
    const searchFrom = searchData.from?.toLowerCase().trim();
    const searchTo = searchData.to?.toLowerCase().trim();

    // Helper function to filter default buses by route
    const getDefaultBusesForRoute = () => {
      console.log("defaultBuses", defaultBuses);
      const result = defaultBuses
        .map((bus) => {
          // Find trips that match the route (flexible on dates for demo buses)
          const matchingTrips = bus.trips.filter((trip) => {
            const tripFrom = trip.pickuplocation.toLowerCase().trim();
            const tripTo = trip.dropLocation.toLowerCase().trim();
            return tripFrom === searchFrom && tripTo === searchTo;
          });

          // Return bus with only matching trips, or null if no matches
          if (matchingTrips.length > 0) {
            return {
              ...bus,
              trips: matchingTrips,
            };
          }
          return null;
        })
        .filter((bus) => bus !== null);

      console.log("filtered default buses", result);
      return result;
    };

    try {
      let response;
      let apiBuses = [];
      try {
        response = await axios.get(`${LocalHost}/user/findbus`, {
          params: searchData,
        });

        console.log("API Response:", response);
        if (Array.isArray(response.data)) {
          apiBuses = response.data;
        } else if (response.data?.error) {
          // API returned an error object, treat as no buses
          apiBuses = [];
        }
      } catch (error) {
        apiBuses = [];
      }





      // Only add default buses if no admin buses were found
      let allBuses = apiBuses;
      if (apiBuses.length === 0) {
        console.log("No admin buses found, showing default buses for route:", searchFrom, "->", searchTo);
        const filteredDefaultBuses = getDefaultBusesForRoute();
        allBuses = filteredDefaultBuses;
        console.log("Default buses found:", filteredDefaultBuses.length);
      }

      if (allBuses.length === 0) {
        setError("No buses available for the selected route.");
        setSearchResults([]);
        setFilteredResults([]);
      } else {
        setSearchResults(allBuses);
        setFilteredResults(allBuses);
        setError("");
      }
    } catch (err: any) {
      // If API fails, try to show default buses as fallback
      console.log("API Error, showing default buses as fallback:", err);

      const filteredDefaultBuses = getDefaultBusesForRoute();

      if (filteredDefaultBuses.length > 0) {
        console.log("Default buses found in error handler:", filteredDefaultBuses.length);
        setSearchResults(filteredDefaultBuses);
        setFilteredResults(filteredDefaultBuses);
        setError(""); // Clear error if we have default buses
      } else {
        console.log("No default buses found for route:", searchFrom, "->", searchTo);
        if (err.response?.status === 404) {
          setError("No buses available for the selected route.");
        } else if (err.response?.status === 400) {
          setError("Invalid search parameters. Please check your inputs.");
        } else {
          setError("Failed to fetch bus details.");
        }
        setSearchResults([]);
        setFilteredResults([]);
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
    setInputdata(formData); // Update state
    setSearchOpen(false); // Close the form
    setError(""); // Clear any previous errors

    // Fetch bus details directly
    fetchBusDetails(formData);
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

    setSort((prev) => !prev)

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
      <div className="flex flex-col lg:flex-row">
        <SideBar onFilter={handleFilter} />
        <div className="flex-1 min-w-0 w-full">
          <div className="w-full">
            {searchOpen ? (
              <>
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full max-w-full"
                >
                  <label className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium mb-1">From:</span>
                    <input
                      type="text"
                      name="from"
                      defaultValue={inputdata.from || ""}
                      className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                    />
                  </label>
                  <label className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium mb-1">To:</span>
                    <input
                      type="text"
                      name="to"
                      defaultValue={inputdata.to || ""}
                      className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                    />
                  </label>
                  <label className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium mb-1">Date:</span>
                    <input
                      type="date"
                      name="date"
                      defaultValue={inputdata.date || ""}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                    />
                  </label>
                  <button
                    type="submit"
                    className="shadow-sm hover:bg-slate-100 py-2 px-4 rounded-md bg-blue-600 text-white font-medium sm:mt-6 mt-0 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4 px-2">Tip: You can search for buses connecting bengaluru, chennai and coimbatore.</p>
                <div className="flex flex-col sm:flex-row m-2 items-start sm:items-center gap-2 sm:gap-0">
                  {inputdata.from && inputdata.to && inputdata.date ? (
                    <>
                      <p className="flex-1 text-sm sm:text-base">
                        <b>{inputdata.from}</b> to <b>{inputdata.to}</b> on{" "}
                        <b>{inputdata.date}</b>
                      </p>
                      <button
                        className="sm:mx-6 shadow-sm px-3 py-1 bg-slate-200 hover:bg-blue-600 rounded-lg"
                        onClick={() => setSearchOpen((prev: boolean) => !prev)}
                      >
                        Modify
                      </button>
                    </>
                  ) : (
                    <div className="w-full p-4">
                      <p className="text-gray-600 mb-4">Please search for buses to see results.</p>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => setSearchOpen(true)}
                      >
                        Start Search
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {filteredResults && filteredResults.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2">
              <button
                onClick={() => handleSort("departure", `${sort ? "asc" : "desc"}`)}
                className="p-2 shadow-md rounded-sm bg-slate-200 hover:bg-blue-600 text-sm sm:text-base"
              >
                Sort by Departure
              </button>
              <button
                onClick={() => handleSort("arrival", `${sort ? "asc" : "desc"}`)}
                className="p-2 shadow-md rounded-sm bg-slate-200 hover:bg-blue-600 text-sm sm:text-base"
              >
                Sort by Arrival
              </button>
              <button
                onClick={() => handleSort("duration", `${sort ? "asc" : "desc"}`)}
                className="p-2 shadow-md rounded-sm bg-slate-200 hover:bg-blue-600 text-sm sm:text-base"
              >
                Sort by Duration
              </button>
            </div>
          )}
          <p></p>
          {filteredResults && filteredResults.length > 0 && (
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
                  {error && <p>{error}</p>}
                  {filteredResults.map((bus: any, index: number) => (
                    <div
                      key={index}
                      className="buscard flex-col shadow-lg mb-4 w-full max-w-full mx-auto sm:mx-3 px-3 py-2"
                      style={{ borderRadius: "10px", backgroundColor: "rgb(239, 248, 255)" }}
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
            className="popupmain fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowPopup(false)}
          >
            <div 
              className="popup bg-white p-4 sm:p-10 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
