# Go Boarding - v2

Go Boarding is a bus ticket booking app, which connects bus operators and customers.

## Deployed website
You can see the deployed website for the code by clicking on the below URL:

https://go-boarding-bus-app-yfk7-mjfyfqh7j-rithikaram29s-projects.vercel.app

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

Go Boarding is a bus ticket booking platform designed to connect bus operators with customers looking to book bus tickets online. The platform offers two distinct interfaces, one for customers and one for bus operators (admin).

- Customer Interface: The customer side allows users to easily search for available buses based on their travel preferences, such as route, date, and time. Once they find suitable options, customers can securely book their tickets through the platform. Additionally, customers can view a list of their current bookings, as well as cancel any tickets they no longer need, directly from their user account.

- Admin Interface: The admin side is designed for bus operators who manage their bus fleets and schedule trips. Operators can log in using their credentials to add new buses to the system, create trips for existing buses, and manage ticket availability for specific trips. The admin can also view a detailed list of customers who have booked tickets for their buses, and if necessary, reset the ticket availability for any given trip, allowing them to manage bookings more efficiently.

## Installation

To use the website locally, clone the code to your system and follow the steps for installation
### Example Installation Steps:
### Clone the repository
git clone <add the clone url>

### Starting  the server
In your git bash terminal:
$ cd server
$ npm install
$ npm run build
$ npm run start

### Starting the front-end
Open a new git bash terminal and run the following:
$ cd frontend
$ npm install
$ npm run dev


## Usage

### Customers
Booking Made Easy with Go Boarding
The process is quick, seamless, and straightforward!
- Find Your Bus: Start by entering your desired route and travel date. With just a click on the Search button, you’ll be taken to a page displaying all the buses that match your criteria.
- View Available Seats: Once on the search results page, you can simply click on the View Seats button to explore the seating arrangements for each bus. The interactive seat layout makes it easy to pick your perfect spot!
- Book Your Seat: Found the seat you want? Just click on it! A form will appear, allowing you to enter your name and other details. Once you're ready, hit Book Tickets to reserve your seat!
- Manage Your Bookings: After booking, you'll be automatically redirected to your Account Page, where you can easily view your booked tickets. If your plans change, no worries – you can cancel your bookings with just a click!

### Operators
As an operator, managing your buses and trips has never been simpler!
- View Your Buses: Once logged in, you’ll be greeted with a list of all the buses you've added to your profile. Just click on any bus to see all the details.
- Bus Details at a Glance: For each bus, you’ll find key information such as the Bus Number, Bus Name, and a Description to give you a complete overview of your vehicle.
- Trips & Schedules: Each bus is linked to the trips you've scheduled. You’ll see important trip details like the Route, Pick-up Time, and Drop-off Time. This helps you stay organized and keeps everything in one place.
- Add New Trips: Have upcoming travel plans? You can easily add new trips for future dates, complete with routes and times, to keep your schedule updated and ensure your customers can book in advance.
- View Bookings: When customers book tickets for a particular trip, you’ll see a list of booked seats in the Trip Details section. This lets you keep track of demand and plan accordingly.
- Reset Trip Availability: If needed, you can reset a trip, making all seats available again. This is perfect if you need to make changes or free up space for new bookings.

## License
This project is licensed under the [MIT License](LICENSE).
