import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalHost } from './constants';

interface Seat {
    seatNo: string;
    name: string;
    busNo: string;
  }
  
  interface User {
    email: string;
    name: string;
    password: string;
    phone: string;
    role: string;
    tickets: { busNo: string; date: string; seats: Seat[] }[]; 
    userName: string;
  }
  

  
const UserProfileBody: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
     useEffect(() => {
        const fetchUser = async () => {
          try {
            // console.log(localStorage.getItem("authToken"))
            const res = await axios.get(`${LocalHost}/user/account`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
              },
            });
    
            let data = res.data[0];
              
            console.log(data)

            // const currentUser = {
            //   name: data.userName,
            //   role: data.role,
            // };
            setUser(data);
            // console.log(res.data);
          } catch (error: any) {
            console.log("Error fetching user:", error.message);
          }
        };
    
        fetchUser();
      }, []);

      const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        return parsedDate.toLocaleString(); // Use toLocaleString for readable date and time
      };


      const cancelTicket = async (ticket: any, seatNo: string) => {
        const busNo = ticket.busNo;
        const date = ticket.date;
    
        // Prepare the payload with the necessary data
        const payload = {
          date: date,
          seatNo: seatNo
        };
    console.log(payload)

        try {
          const res = await axios.put(
            `${LocalHost}/user/cancel-ticket/${busNo}`, 
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
              },
            }
          );
    
          if (res.status === 200) {
            // Update the user state after ticket cancellation
            const updatedUser: any = { ...user };
            updatedUser.tickets = updatedUser.tickets.map((userTicket: any) => {
              if (userTicket.busNo === busNo && userTicket.date === date) {
                // Filter out the canceled seat
                userTicket.seats = userTicket.seats.filter(
                  (seat: any) => seat.seatNo !== seatNo
                );
              }
              return userTicket;
            });
            setUser(updatedUser);
            alert("Ticket canceled successfully!");
          }
        } catch (error: any) {
          console.log("Error canceling ticket:", error);
          alert("Failed to cancel ticket.");
        }
      };


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">User Profile</h2>
      
      {/* User Information */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-lg font-medium text-gray-600">Username:</span>
          <span className="text-lg text-gray-800">{user && user.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium text-gray-600">Email:</span>
          <span className="text-lg text-gray-800">{user && user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium text-gray-600">Phone:</span>
          <span className="text-lg text-gray-800">{user && user.phone}</span>
        </div>
      </div>

      {/* Tickets Information */}
      {user && user.tickets && user.tickets.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Tickets</h3>
          <div className="space-y-4">
            {user.tickets.map((ticket, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm">
                {/* Bus and Date Information */}
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-600">Bus No:</span>
                  <span className="text-lg text-gray-800">{ticket.busNo}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-lg font-medium text-gray-600">Date and Time:</span>
                  <span className="text-lg text-gray-800">{formatDate(ticket.date)}</span>
                </div>
               

                {/* Seat Information */}
                <div className="mt-2">
                  <h4 className="text-lg font-medium text-gray-600">Seats:</h4>
                  <ul className="space-y-2">
                    {ticket.seats.map((seat, seatIndex) => (
                      <li key={seatIndex} className="flex justify-between">
                        <span className="text-gray-800">Seat No: {seat.seatNo}</span>
                        <span className="text-gray-600">Assigned to: {seat.name}</span>
                        <button onClick={()=>cancelTicket(ticket, seat.seatNo)}>Cancel Ticket</button>
                      </li>

                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default UserProfileBody