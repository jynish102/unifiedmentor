export const tenantData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "(555) 123-4567",
  unit: "Apartment 304",
  building: "Sunset Towers",
  leaseStart: "2024-01-01",
  leaseEnd: "2025-12-31",
  rentAmount: 2500,
  nextPaymentDue: "2026-04-01",
};

export const amenities = [
  {
    id: 1,
    name: "Gym & Fitness Center",
    description: "Fully equipped fitness center with cardio and weight training equipment",
    available: true,
    hours: "6:00 AM - 10:00 PM",
    capacity: 15,
    icon: "dumbbell",
  },
  {
    id: 2,
    name: "Swimming Pool",
    description: "Indoor heated pool with lap lanes",
    available: true,
    hours: "7:00 AM - 9:00 PM",
    capacity: 20,
    icon: "waves",
  },
  {
    id: 3,
    name: "Rooftop Lounge",
    description: "Outdoor lounge area with BBQ grills and seating",
    available: true,
    hours: "8:00 AM - 11:00 PM",
    capacity: 30,
    icon: "palmtree",
  },
  {
    id: 4,
    name: "Business Center",
    description: "Co-working space with high-speed internet and printing",
    available: true,
    hours: "24/7",
    capacity: 10,
    icon: "briefcase",
  },
  {
    id: 5,
    name: "Movie Theater",
    description: "Private screening room with comfortable seating",
    available: false,
    hours: "2:00 PM - 11:00 PM",
    capacity: 12,
    icon: "film",
  },
  {
    id: 6,
    name: "Guest Suite",
    description: "Overnight accommodation for visitors",
    available: true,
    hours: "Check-in: 3:00 PM, Check-out: 11:00 AM",
    capacity: 2,
    icon: "bed",
  },
];

export const bookings = [
  {
    id: 1,
    amenityName: "Gym & Fitness Center",
    date: "2026-04-02",
    time: "7:00 AM - 8:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    amenityName: "Rooftop Lounge",
    date: "2026-04-05",
    time: "6:00 PM - 9:00 PM",
    status: "confirmed",
  },
  {
    id: 3,
    amenityName: "Guest Suite",
    date: "2026-04-10",
    time: "3:00 PM - 11:00 AM (Next Day)",
    status: "pending",
  },
];

export const payments = [
  {
    id: 1,
    date: "2026-03-01",
    description: "Monthly Rent - March 2026",
    amount: 2500,
    status: "paid",
    method: "Auto-Pay",
  },
  {
    id: 2,
    date: "2026-02-01",
    description: "Monthly Rent - February 2026",
    amount: 2500,
    status: "paid",
    method: "Auto-Pay",
  },
  {
    id: 3,
    date: "2026-01-01",
    description: "Monthly Rent - January 2026",
    amount: 2500,
    status: "paid",
    method: "Auto-Pay",
  },
  {
    id: 4,
    date: "2025-12-15",
    description: "Security Deposit",
    amount: 2500,
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: 5,
    date: "2026-04-01",
    description: "Monthly Rent - April 2026",
    amount: 2500,
    status: "pending",
    method: "Auto-Pay",
  },
];

export const maintenanceRequests = [
  {
    id: 1,
    title: "Leaking Kitchen Faucet",
    description: "The kitchen sink faucet has been dripping continuously",
    category: "Plumbing",
    priority: "medium",
    status: "in-progress",
    dateSubmitted: "2026-03-25",
    lastUpdate: "2026-03-28",
  },
  {
    id: 2,
    title: "AC Not Cooling Properly",
    description: "Air conditioning unit not maintaining temperature",
    category: "HVAC",
    priority: "high",
    status: "pending",
    dateSubmitted: "2026-03-28",
    lastUpdate: "2026-03-28",
  },
  {
    id: 3,
    title: "Light Bulb Replacement",
    description: "Hallway light bulb needs replacement",
    category: "Electrical",
    priority: "low",
    status: "completed",
    dateSubmitted: "2026-03-20",
    lastUpdate: "2026-03-22",
  },
];

export const announcements = [
  {
    id: 1,
    title: "Pool Maintenance Scheduled",
    message: "The swimming pool will be closed for maintenance on April 5th from 8 AM to 2 PM.",
    date: "2026-03-28",
    type: "maintenance",
  },
  {
    id: 2,
    title: "New Parcel Locker System",
    message: "We've installed new smart parcel lockers in the main lobby for package deliveries.",
    date: "2026-03-25",
    type: "update",
  },
  {
    id: 3,
    title: "Rent Increase Notice",
    message: "Starting June 2026, monthly rent will increase by 3% as per your lease agreement.",
    date: "2026-03-20",
    type: "important",
  },
];

export const paymentHistory = [
  { month: "Oct", amount: 2500 },
  { month: "Nov", amount: 2500 },
  { month: "Dec", amount: 2500 },
  { month: "Jan", amount: 2500 },
  { month: "Feb", amount: 2500 },
  { month: "Mar", amount: 2500 },
];
