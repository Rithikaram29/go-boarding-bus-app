import React, { useEffect, useState } from "react";
import "./style/searchBar.css";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const today: string = new Date().toISOString().split("T")[0]; // Ensures the type is string
  const [inputdata, setInputData] = useState({
    from: "",
    to: "",
    date: today,
  });

  useEffect(() => {
    const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
    if (searchData && Object.keys(searchData).length > 0) {
      setInputData({ ...inputdata, ...searchData });
    }
  }, []);

  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputdata.from === "" || inputdata.to === "") {
      alert("Add search inputs.");
      return;
    }

    // Convert `from` and `to` values to lowercase
    const processedData = {
      ...inputdata,
      from: inputdata.from.toLowerCase(),
      to: inputdata.to.toLowerCase(),
    };

    // Store `from`, `to`, and `date` in localStorage
    localStorage.setItem("searchData", JSON.stringify(processedData));

    // Navigate to the search page
    navigate("/search");
  };

  // const changeLocation = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setInputData({
  //     ...inputdata,
  //     from: inputdata.to,
  //     to: inputdata.from,
  //   });
  // };

  return (
    <>
      <div>
        <form className="mainform flex-row">
          <div>
            <label>From</label>
            <input
              name="from"
              placeholder="From"
              value={inputdata.from}
              onChange={handleChange}
            />
          </div>
          {/* <button onClick={changeLocation} className="swap">
            <FontAwesomeIcon icon={faRightLeft} />
          </button> */}
          <div>
            <label>To</label>
            <input
              name="to"
              placeholder="To"
              value={inputdata.to}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date</label>
            <input
              name="date"
              type="date"
              value={inputdata.date}
              min={today}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSearch} className="search mr-4">
            Search Buses
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
