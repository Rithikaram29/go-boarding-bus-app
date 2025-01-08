import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import AdminBus from "../components/adminComponents/AdminBus";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // console.log(localStorage.getItem("authToken"))
        const res = await axios.get("http://localhost:4000/user/account", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if necessary
          },
        });

        let data = res.data[0];

        const currentUser = {
          name: data.userName,
          role: data.role,
        };
        setUser(currentUser);
        // console.log(res.data);
      } catch (error: any) {
        console.log("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      {user?.role === "admin" || null ? <AdminBus /> : <SearchBar />}
    </div>
  );
};

export default HomePage;
