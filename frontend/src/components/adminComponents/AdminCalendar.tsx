import React, { useState, useEffect } from 'react';
import '../style/calender.css'; 
import axios from 'axios';

// Interface for Bus Data
interface Bus {
  busNo: string;
  busId: string;  // Assuming we have a bus ID
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);  // To store selected dates
  const [selectedBus, setSelectedBus] = useState<string>('');  // To store selected bus
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBuses = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/admin/bus", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setBuses(res.data);
      } catch (error: any) {
        console.log("Error fetching buses:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBuses();
  }, []);

  // Get all the dates for the current month
  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get all the dates for the current month
    const dates: Date[] = [];
    for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
      const newDate = new Date(year, month, day);
      dates.push(newDate);
    }
    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Check if there's a bus running on the given date
  const getBusOnDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    const bus = buses.find((bus) => bus.busNo === dateString);
    return bus ? bus.busNo : null;
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDates((prevSelectedDates) => {
      if (prevSelectedDates.includes(date)) {
        return prevSelectedDates.filter((d) => d !== date); // Remove the date if already selected
      }
      return [...prevSelectedDates, date]; // Add the date if not selected
    });
  };

  // Handle adding bus to selected dates
  const handleAddBusToDates = async () => {
    if (!selectedBus || selectedDates.length === 0) {
      alert("Please select a bus and dates.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:4000/admin/calendar/addbus",
        {
          busNo: selectedBus,
          dates: selectedDates,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response)
      alert("Bus added successfully!");
    } catch (error: any) {
      console.error("Error adding bus:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the dates for the current month
  const datesInMonth = getDatesInMonth(currentDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {datesInMonth.map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          return (
            <button
              key={index}
              className={`calendar-day ${selectedDates.includes(dateString) ? "selected" : ""}`}
              onClick={() => handleDateSelect(dateString)}
            >
              <div className="calendar-day-number">{date.getDate()}</div>
              {getBusOnDate(date) && <div className="calendar-bus-number">{getBusOnDate(date)}</div>}
            </button>
          );
        })}
      </div>

      <div className="bus-selection">
        <h3>Select Bus</h3>
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Select a Bus</option>
          {buses.map((bus) => (
            <option key={bus.busId} value={bus.busNo}>
              {bus.busNo}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddBusToDates}
          className="add-bus-button"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Bus to Selected Dates"}
        </button>
      </div>
    </div>
  );
};

export default Calendar;
