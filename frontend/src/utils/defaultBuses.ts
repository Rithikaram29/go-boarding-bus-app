// Default buses that are always visible for demonstration purposes
// Structure matches the server Bus model exactly

export interface DefaultBus {
  _id: string;
  busNo: string;
  busName: string;
  isAc: boolean;
  seats: {
    noOfSeatsInRowLeft: number;
    noOfSeatsInRowRight: number;
    noOfRowsInTotal: number;
    noOfSeatsInLastRow: number;
  };
  trips: Array<{
    pickuplocation: string;
    pickupDateTime: string; // ISO string format
    dropLocation: string;
    dropDateTime: string; // ISO string format
    bookedSeats: Array<{
      SeatNumber: string;
      assignedTo: string;
      bookedBy: string | {
        _id: string;
        userName?: string;
        email?: string;
        name?: string;
      };
    }>;
  }>;
}

// Generate dates for upcoming trips (today and next few days)
const getUpcomingDate = (daysFromNow: number, hour: number = 8): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const getDropDate = (pickupDate: string, hoursToAdd: number = 6): string => {
  const date = new Date(pickupDate);
  date.setHours(date.getHours() + hoursToAdd);
  return date.toISOString();
};

// Generate multiple trips for each route to ensure buses show up for different dates
const generateTripsForRoute = (
  from: string,
  to: string,
  baseDays: number[] = [0, 1, 2],
  hours: number[] = [6, 8, 10, 14, 16, 18, 20, 22],
  durationHours: number = 6
) => {
  return baseDays.flatMap((day) =>
    hours.map((hour) => ({
      pickuplocation: from.toLowerCase(),
      pickupDateTime: getUpcomingDate(day, hour),
      dropLocation: to.toLowerCase(),
      dropDateTime: getDropDate(getUpcomingDate(day, hour), durationHours),
      bookedSeats: [],
    }))
  );
};

export const defaultBuses: DefaultBus[] = [
  {
    _id: "default-bus-001",
    busNo: "TN-01-AB-1234",
    busName: "Express Deluxe",
    isAc: true,
    seats: {
      noOfSeatsInRowLeft: 2,
      noOfSeatsInRowRight: 2,
      noOfRowsInTotal: 12,
      noOfSeatsInLastRow: 2,
    },
    trips: [
      // Chennai to bengaluru - multiple trips
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(0, 8),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 8), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(0, 14),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 14), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(1, 8),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(1, 8), 6),
        bookedSeats: [],
      },
      // Chennai to Coimbatore
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(0, 10),
        dropLocation: "coimbatore",
        dropDateTime: getDropDate(getUpcomingDate(0, 10), 5),
        bookedSeats: [],
      },
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(1, 16),
        dropLocation: "coimbatore",
        dropDateTime: getDropDate(getUpcomingDate(1, 16), 5),
        bookedSeats: [],
      },
    ],
  },
  {
    _id: "default-bus-002",
    busNo: "TN-02-CD-5678",
    busName: "Comfort Plus",
    isAc: true,
    seats: {
      noOfSeatsInRowLeft: 2,
      noOfSeatsInRowRight: 2,
      noOfRowsInTotal: 10,
      noOfSeatsInLastRow: 2,
    },
    trips: [
      // bengaluru to Chennai
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(0, 6),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(0, 6), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(0, 12),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(0, 12), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(1, 10),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(1, 10), 6),
        bookedSeats: [],
      },
      // bengaluru to Mysore
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(0, 8),
        dropLocation: "mysore",
        dropDateTime: getDropDate(getUpcomingDate(0, 8), 3),
        bookedSeats: [],
      },
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(2, 18),
        dropLocation: "mysore",
        dropDateTime: getDropDate(getUpcomingDate(2, 18), 3),
        bookedSeats: [],
      },
    ],
  },
  {
    _id: "default-bus-003",
    busNo: "TN-03-EF-9012",
    busName: "Budget Traveler",
    isAc: false,
    seats: {
      noOfSeatsInRowLeft: 2,
      noOfSeatsInRowRight: 2,
      noOfRowsInTotal: 13,
      noOfSeatsInLastRow: 2,
    },
    trips: [
      // Coimbatore to Chennai
      {
        pickuplocation: "coimbatore",
        pickupDateTime: getUpcomingDate(0, 6),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(0, 6), 7),
        bookedSeats: [],
      },
      {
        pickuplocation: "coimbatore",
        pickupDateTime: getUpcomingDate(0, 20),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(0, 20), 7),
        bookedSeats: [],
      },
      {
        pickuplocation: "coimbatore",
        pickupDateTime: getUpcomingDate(1, 8),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(1, 8), 7),
        bookedSeats: [],
      },
      // Coimbatore to bengaluru
      {
        pickuplocation: "coimbatore",
        pickupDateTime: getUpcomingDate(0, 14),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 14), 5),
        bookedSeats: [],
      },
      {
        pickuplocation: "coimbatore",
        pickupDateTime: getUpcomingDate(1, 20),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(1, 20), 5),
        bookedSeats: [],
      },
    ],
  },
  {
    _id: "default-bus-004",
    busNo: "TN-04-GH-3456",
    busName: "Premium Sleeper",
    isAc: true,
    seats: {
      noOfSeatsInRowLeft: 2,
      noOfSeatsInRowRight: 2,
      noOfRowsInTotal: 11,
      noOfSeatsInLastRow: 2,
    },
    trips: [
      // Mysore to bengaluru
      {
        pickuplocation: "mysore",
        pickupDateTime: getUpcomingDate(0, 7),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 7), 3),
        bookedSeats: [],
      },
      {
        pickuplocation: "mysore",
        pickupDateTime: getUpcomingDate(0, 15),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 15), 3),
        bookedSeats: [],
      },
      {
        pickuplocation: "mysore",
        pickupDateTime: getUpcomingDate(1, 12),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(1, 12), 3),
        bookedSeats: [],
      },
      // Mysore to Chennai
      {
        pickuplocation: "mysore",
        pickupDateTime: getUpcomingDate(0, 10),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(0, 10), 8),
        bookedSeats: [],
      },
      {
        pickuplocation: "mysore",
        pickupDateTime: getUpcomingDate(2, 8),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(2, 8), 8),
        bookedSeats: [],
      },
    ],
  },
  {
    _id: "default-bus-005",
    busNo: "TN-05-IJ-7890",
    busName: "City Express",
    isAc: false,
    seats: {
      noOfSeatsInRowLeft: 2,
      noOfSeatsInRowRight: 2,
      noOfRowsInTotal: 9,
      noOfSeatsInLastRow: 2,
    },
    trips: [
      // Chennai to Coimbatore (return)
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(0, 16),
        dropLocation: "coimbatore",
        dropDateTime: getDropDate(getUpcomingDate(0, 16), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(1, 12),
        dropLocation: "coimbatore",
        dropDateTime: getDropDate(getUpcomingDate(1, 12), 6),
        bookedSeats: [],
      },
      // bengaluru to Mysore
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(0, 9),
        dropLocation: "mysore",
        dropDateTime: getDropDate(getUpcomingDate(0, 9), 3),
        bookedSeats: [],
      },
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(0, 22),
        dropLocation: "mysore",
        dropDateTime: getDropDate(getUpcomingDate(0, 22), 3),
        bookedSeats: [],
      },
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(1, 14),
        dropLocation: "mysore",
        dropDateTime: getDropDate(getUpcomingDate(1, 14), 3),
        bookedSeats: [],
      },
    ],
  },
  {
    _id: "default-bus-006",
    busNo: "TN-06-KL-2468",
    busName: "Super Fast",
    isAc: true,
    seats: {
      noOfSeatsInRowLeft: 2,
      noOfSeatsInRowRight: 2,
      noOfRowsInTotal: 11,
      noOfSeatsInLastRow: 2,
    },
    trips: [
      // More routes for better coverage
      {
        pickuplocation: "chennai",
        pickupDateTime: getUpcomingDate(0, 9),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 9), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "bengaluru",
        pickupDateTime: getUpcomingDate(0, 7),
        dropLocation: "chennai",
        dropDateTime: getDropDate(getUpcomingDate(0, 7), 6),
        bookedSeats: [],
      },
      {
        pickuplocation: "coimbatore",
        pickupDateTime: getUpcomingDate(0, 12),
        dropLocation: "bengaluru",
        dropDateTime: getDropDate(getUpcomingDate(0, 12), 5),
        bookedSeats: [],
      },
    ],
  },
];
