import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/searchBar.css";

const SearchBar: React.FC = () => {
  const today: string = new Date().toISOString().split("T")[0];
  const [inputdata, setInputData] = useState({
    from: "",
    to: "",
    date: today,
  });

  useEffect(() => {
    const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
    if (searchData && Object.keys(searchData).length > 0) {
      setInputData((prev) => ({ ...prev, ...searchData }));
    }
  }, []);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputdata.from.trim() || !inputdata.to.trim()) {
      alert("Add search inputs.");
      return;
    }

    const processedData = {
      ...inputdata,
      from: inputdata.from.toLowerCase(),
      to: inputdata.to.toLowerCase(),
    };

    localStorage.setItem("searchData", JSON.stringify(processedData));
    navigate("/search");
  };

  return (
    <section className="search-widget">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-field">
          <label htmlFor="from">From</label>
          <input
            id="from"
            name="from"
            placeholder="Start location"
            value={inputdata.from}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className="search-field">
          <label htmlFor="to">To</label>
          <input
            id="to"
            name="to"
            placeholder="Destination"
            value={inputdata.to}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className="search-field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={inputdata.date}
            min={today}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="search-button">
          Search buses
        </button>
      </form>
    </section>
  );
};

export default SearchBar;
