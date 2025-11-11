// Sample data for testing CatchMyBus application
// Use this data in the Admin Panel or import to Firestore

export const sampleBusStops = [
  {
    name: "Thiruvananthapuram Central Bus Station",
    district: "Thiruvananthapuram",
    location: { lat: 8.5241, lng: 76.9366 }
  },
  {
    name: "Kollam KSRTC Bus Stand",
    district: "Kollam",
    location: { lat: 8.8932, lng: 76.6141 }
  },
  {
    name: "Alappuzha Bus Stand",
    district: "Alappuzha",
    location: { lat: 9.4981, lng: 76.3388 }
  },
  {
    name: "Kochi KSRTC Bus Stand",
    district: "Ernakulam",
    location: { lat: 9.9312, lng: 76.2673 }
  },
  {
    name: "Thrissur KSRTC Bus Stand",
    district: "Thrissur",
    location: { lat: 10.5276, lng: 76.2144 }
  },
  {
    name: "Kozhikode KSRTC Bus Stand",
    district: "Kozhikode",
    location: { lat: 11.2588, lng: 75.7804 }
  }
];

export const sampleBuses = [
  {
    busNumber: "KL-01-AB-1234",
    busName: "Trivandrum - Kochi Express",
    type: "KSRTC",
    route: [
      "Thiruvananthapuram Central Bus Station",
      "Kollam KSRTC Bus Stand",
      "Alappuzha Bus Stand",
      "Kochi KSRTC Bus Stand"
    ],
    timings: [
      {
        stopId: "stop_1",
        stopName: "Thiruvananthapuram Central Bus Station",
        arrivalTime: "06:00 AM",
        departureTime: "06:15 AM"
      },
      {
        stopId: "stop_2",
        stopName: "Kollam KSRTC Bus Stand",
        arrivalTime: "07:30 AM",
        departureTime: "07:40 AM"
      },
      {
        stopId: "stop_3",
        stopName: "Alappuzha Bus Stand",
        arrivalTime: "08:45 AM",
        departureTime: "08:55 AM"
      },
      {
        stopId: "stop_4",
        stopName: "Kochi KSRTC Bus Stand",
        arrivalTime: "10:00 AM",
        departureTime: "10:15 AM"
      }
    ]
  },
  {
    busNumber: "KL-07-BC-5678",
    busName: "Kochi - Thrissur Super Fast",
    type: "Super Fast",
    route: [
      "Kochi KSRTC Bus Stand",
      "Thrissur KSRTC Bus Stand"
    ],
    timings: [
      {
        stopId: "stop_1",
        stopName: "Kochi KSRTC Bus Stand",
        arrivalTime: "07:00 AM",
        departureTime: "07:10 AM"
      },
      {
        stopId: "stop_2",
        stopName: "Thrissur KSRTC Bus Stand",
        arrivalTime: "08:30 AM",
        departureTime: "08:40 AM"
      }
    ]
  },
  {
    busNumber: "KL-11-CD-9012",
    busName: "Kozhikode - Thrissur Fast",
    type: "Fast",
    route: [
      "Kozhikode KSRTC Bus Stand",
      "Thrissur KSRTC Bus Stand"
    ],
    timings: [
      {
        stopId: "stop_1",
        stopName: "Kozhikode KSRTC Bus Stand",
        arrivalTime: "05:30 AM",
        departureTime: "05:45 AM"
      },
      {
        stopId: "stop_2",
        stopName: "Thrissur KSRTC Bus Stand",
        arrivalTime: "08:15 AM",
        departureTime: "08:25 AM"
      }
    ]
  },
  {
    busNumber: "PVT-14-EF-3456",
    busName: "Trivandrum - Kollam Private",
    type: "Private",
    route: [
      "Thiruvananthapuram Central Bus Station",
      "Kollam KSRTC Bus Stand"
    ],
    timings: [
      {
        stopId: "stop_1",
        stopName: "Thiruvananthapuram Central Bus Station",
        arrivalTime: "09:00 AM",
        departureTime: "09:15 AM"
      },
      {
        stopId: "stop_2",
        stopName: "Kollam KSRTC Bus Stand",
        arrivalTime: "10:30 AM",
        departureTime: "10:40 AM"
      }
    ]
  },
  {
    busNumber: "KL-01-GH-7890",
    busName: "Kerala Coastal Ordinary",
    type: "Ordinary",
    route: [
      "Thiruvananthapuram Central Bus Station",
      "Kollam KSRTC Bus Stand",
      "Alappuzha Bus Stand",
      "Kochi KSRTC Bus Stand",
      "Thrissur KSRTC Bus Stand"
    ],
    timings: [
      {
        stopId: "stop_1",
        stopName: "Thiruvananthapuram Central Bus Station",
        arrivalTime: "05:00 AM",
        departureTime: "05:20 AM"
      },
      {
        stopId: "stop_2",
        stopName: "Kollam KSRTC Bus Stand",
        arrivalTime: "06:45 AM",
        departureTime: "07:00 AM"
      },
      {
        stopId: "stop_3",
        stopName: "Alappuzha Bus Stand",
        arrivalTime: "08:15 AM",
        departureTime: "08:30 AM"
      },
      {
        stopId: "stop_4",
        stopName: "Kochi KSRTC Bus Stand",
        arrivalTime: "09:45 AM",
        departureTime: "10:00 AM"
      },
      {
        stopId: "stop_5",
        stopName: "Thrissur KSRTC Bus Stand",
        arrivalTime: "11:30 AM",
        departureTime: "11:45 AM"
      }
    ]
  }
];

// Instructions:
// 1. Go to Admin Panel (http://localhost:3000/admin)
// 2. First, add all bus stops from sampleBusStops
// 3. Then, add all buses from sampleBuses
// 4. Now you can search for buses between any stops!
