// Full Populated Mock Listings & State for RoomTiffin Finder - INDORE, MADHYA PRADESH
// Covers Rooms & Tiffins across authentic Indore localities:
// Bhawarkuan, Vijay Nagar, Palasia, Rau/Silicon City, Geeta Bhawan, Scheme 78/54

import { dedupeListingImages } from "../services/listingImages.js"

export const mockListings = [
  // ==========================================
  // 1. ROOMS & PGS (INDORE)
  // ==========================================
  {
    _id: "room-001",
    id: "room-001",
    category: "rooms",
    city: "Indore",
    title: "Serene Nest Student PG",
    description: "Serene Nest is an architect-designed student residency located right in Bhawarkuan near DAVV Takshashila campus and MPPSC coaching hubs. Engineered for undisturbed study and deep rest, each room offers personal solid-wood study desks, ergonomic mesh chairs, orthopedic pocket-spring mattresses, 200 Mbps fiber internet, and 24/7 security. Includes daily housekeeping, laundry, and power backup.",
    roomType: "single",
    occupancy: "Single Private Room",
    pricing: {
      amount: 7500,
      period: "month",
      deposit: 7500,
      formatted: "₹7,500/month"
    },
    rent: 7500,
    deposit: 7500,
    approxLocation: "Bhawarkuan Square (~350m from DAVV Takshashila Campus)",
    exactLocation: "Flat 204, Serene Nest PG, Near Holkar Science College, Bhawarkuan Main Road, Indore - 452001",
    distance: "0.3 km from Bhawarkuan iBus BRTS Stop",
    neighborhood: "Bhawarkuan",
    provider: {
      name: "Suresh Narang",
      verified: true,
      rating: 4.9,
      reviewCount: 42,
      phone: "+91 98260 11024",
      whatsapp: "+91 98260 11024",
      email: "suresh.pg@roomtiffin.in"
    },
    rating: 4.9,
    reviewCount: 42,
    availability: "Available immediately • 2 rooms left",
    isAvailable: true,
    furnishing: "Fully Furnished",
    wifi: true,
    ac: true,
    attachedBathroom: true,
    foodAvailability: "Breakfast & Dinner Included (Indori Poha + Homestyle Thali)",
    isFeatured: true,
    isPopular: true,
    isNewThisWeek: false,
    features: [
      "200 Mbps Fiber WiFi",
      "Attached Bathroom with Geyser",
      "Split Inverter AC",
      "Daily Housekeeping",
      "Full Power Backup (DG)",
      "Purified RO Water Dispenser",
      "CCTV & Biometric Entry"
    ],
    specs: {
      "Room Type": "Single Private Suite",
      "Furnishing": "Fully Furnished (Wardrobe, Bed, Study Desk)",
      "Attached Bathroom": "Yes (Geyser fitted)",
      "WiFi Speed": "200 Mbps Unlimited Fiber",
      "Air Conditioning": "1.5 Ton Inverter AC included",
      "Meals": "Homestyle Malwi & North Indian meals",
      "Security Deposit": "₹7,500 (1 Month, 100% Refundable)"
    },
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "room-002",
    id: "room-002",
    category: "rooms",
    city: "Indore",
    title: "Urban Haven Coliving",
    description: "Modern, vibrant community coliving suites in the heart of Vijay Nagar Scheme 54. Walking distance from C21 Mall, Malhar Mega Mall, and Bombay Hospital. Features premium shared lounges, private balconies, 300 Mbps fiber internet, rooftop community cafe, induction kitchenette, and weekly weekend mixer events.",
    roomType: "shared",
    occupancy: "Twin Sharing Coliving Suite",
    pricing: {
      amount: 9500,
      period: "month",
      deposit: 9500,
      formatted: "₹9,500/month"
    },
    rent: 9500,
    deposit: 9500,
    approxLocation: "Vijay Nagar Scheme 54 (~300m from C21 Mall)",
    exactLocation: "Urban Haven Tower, Plot 42, Scheme 54 PU-4, Behind Malhar Mall, Vijay Nagar, Indore - 452010",
    distance: "0.3 km from Vijay Nagar BRTS Square",
    neighborhood: "Vijay Nagar",
    provider: {
      name: "Rhea Sen (Community Lead)",
      verified: true,
      rating: 4.8,
      reviewCount: 58,
      phone: "+91 98270 44321",
      whatsapp: "+91 98270 44321",
      email: "community@urbanhaven.in"
    },
    rating: 4.8,
    reviewCount: 58,
    availability: "Available from 15th Oct • 1 bed open",
    isAvailable: true,
    furnishing: "Designer Fully Furnished",
    wifi: true,
    ac: true,
    attachedBathroom: true,
    foodAvailability: "Rooftop Cafe & Shared Induction Kitchen",
    isFeatured: true,
    isPopular: true,
    isNewThisWeek: true,
    features: [
      "Twin Beds with Memory Foam",
      "Rooftop Cafe & Coworking Lounge",
      "Attached Luxury Bathroom",
      "300 Mbps Dual Band WiFi",
      "Gym & Table Tennis",
      "Smart Keyless Biometric Entry",
      "Housekeeping Mon-Sat"
    ],
    specs: {
      "Room Type": "Twin Sharing Executive Suite",
      "Furnishing": "Modern Minimalist (Oak finish)",
      "Attached Bathroom": "Yes (Glass partition & rain shower)",
      "WiFi Speed": "300 Mbps Fiber",
      "Air Conditioning": "Centralised VRV Air Conditioning",
      "Food Option": "Breakfast included, self-cooking kitchen available",
      "Security Deposit": "₹9,500 (Refundable)"
    },
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "room-003",
    id: "room-003",
    category: "rooms",
    city: "Indore",
    title: "Greenwood Executive Residency",
    description: "Premium executive studio residences designed for corporate professionals and remote founders in New Palasia. Minutes away from the world-famous 56 Dukan (Chappan) culinary hub. Features wooden laminate flooring, soundproof French windows, personal modular kitchenette, smart 43-inch 4K TV, king-size bed, and access to a terrace herb garden.",
    roomType: "1rk",
    occupancy: "Independent Private Studio",
    pricing: {
      amount: 12500,
      period: "month",
      deposit: 12500,
      formatted: "₹12,500/month"
    },
    rent: 12500,
    deposit: 12500,
    approxLocation: "New Palasia (~400m from 56 Dukan / Chappan)",
    exactLocation: "Greenwood Suites, 14 Saket Club Road, New Palasia, Indore - 452001",
    distance: "0.4 km from 56 Dukan (Chappan)",
    neighborhood: "Palasia",
    provider: {
      name: "Captain Vikramaditya Singh",
      verified: true,
      rating: 4.95,
      reviewCount: 31,
      phone: "+91 98263 88120",
      whatsapp: "+91 98263 88120",
      email: "vikram@greenwoodresidency.in"
    },
    rating: 4.95,
    reviewCount: 31,
    availability: "Available immediately",
    isAvailable: true,
    furnishing: "Ultra-Luxury Furnished",
    wifi: true,
    ac: true,
    attachedBathroom: true,
    foodAvailability: "Self-cooking Kitchenette + On-demand Cook",
    isFeatured: false,
    isPopular: true,
    isNewThisWeek: false,
    features: [
      "Modular Kitchen with Induction & Microwave",
      "43-inch 4K Smart TV with OTT",
      "Dedicated High-Speed Work Desk",
      "Covered Stilt Two-Wheeler / Car Parking",
      "Private Balcony overlooking Tree Canopy",
      "100% Solar & Inverter Backup",
      "Automated Washing Machine in Balcony"
    ],
    specs: {
      "Room Type": "Private 1RK Executive Studio",
      "Furnishing": "Luxury Solid Teakwood & Modern Appliances",
      "Attached Bathroom": "Yes (Jaguar fittings & 25L Geyser)",
      "WiFi Speed": "400 Mbps Airtel Xstream Fiber",
      "Air Conditioning": "Daikin 1.5 Ton 5-Star Split AC",
      "Kitchen": "Induction, Microwave, Fridge, Chimney",
      "Security Deposit": "₹12,500 (100% Refundable)"
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "room-004",
    id: "room-004",
    category: "rooms",
    city: "Indore",
    title: "Lakeview Scholar PG",
    description: "Budget-friendly, peaceful student PG right next to Rau Circle and Silicon City, ideal for students at IPS Academy, Medi-Caps University, and IIM Indore. Offers spacious double-sharing rooms with cross ventilation, personal lockers, 24-hr study hall, high-speed WiFi, hot water, and delicious wholesome meals.",
    roomType: "shared",
    occupancy: "Twin Sharing Student Room",
    pricing: {
      amount: 5500,
      period: "month",
      deposit: 5500,
      formatted: "₹5,500/month"
    },
    rent: 5500,
    deposit: 5500,
    approxLocation: "Rau Circle (~500m from IPS Academy)",
    exactLocation: "Building 18, Silicon City Sector B, AB Road, Rau, Indore - 453331",
    distance: "0.5 km from IPS Academy Gate",
    neighborhood: "Rau",
    provider: {
      name: "Maheshwar Chouhan",
      verified: true,
      rating: 4.7,
      reviewCount: 39,
      phone: "+91 98264 55901",
      whatsapp: "+91 98264 55901",
      email: "lakeview.rau@roomtiffin.in"
    },
    rating: 4.7,
    reviewCount: 39,
    availability: "Available immediately • 4 beds open",
    isAvailable: true,
    furnishing: "Semi-Furnished (Beds, Wardrobes, Study Tables)",
    wifi: true,
    ac: false,
    attachedBathroom: true,
    foodAvailability: "Breakfast, Lunch & Dinner Included",
    isFeatured: false,
    isPopular: false,
    isNewThisWeek: true,
    features: [
      "100 Mbps WiFi across all rooms",
      "Attached Bathroom with Geyser",
      "24/7 Silent Study Hall with AC",
      "Purified RO Cold/Hot Water",
      "Two-Wheeler Gated Parking",
      "3 Wholesome Meals Daily included"
    ],
    specs: {
      "Room Type": "Twin Sharing Student Room",
      "Furnishing": "Steel Almirahs, Wooden Study Desks, Cot with Mattress",
      "Attached Bathroom": "Yes (Solar Hot Water + Geyser)",
      "WiFi Speed": "100 Mbps Unlimited",
      "Cooling": "High-speed Orient Ceiling Fans + Cooler",
      "Food Included": "Breakfast, Lunch & Dinner (Indori Poha + Homestyle Sabzi Roti)",
      "Security Deposit": "₹5,500 (Refundable)"
    },
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
    ]
  },

  // ==========================================
  // 2. TIFFIN & DABBA (INDORE)
  // ==========================================
  {
    _id: "tiffin-001",
    id: "tiffin-001",
    category: "tiffin",
    city: "Indore",
    title: "Annapurna Ghar Se Tiffin",
    description: "Pure vegetarian homestyle Indore dabba service by Smt. Sharda Sharma, delivering to Bhawarkuan, Geeta Bhawan, and Sapna Sangeeta. Homestyle food cooked with minimal cold-pressed mustard oil, desi cow ghee rotis, fresh seasonal vegetables, and authentic Malwi flavours. Features a beloved Sunday Dal Baati Churma feast and morning Poha-Jalebi add-on.",
    foodType: "pure vegetarian",
    cuisine: "Traditional Malwi & North Indian Home Food",
    pricing: {
      amount: 2600,
      period: "month",
      perMeal: 70,
      deposit: 0,
      formatted: "₹2,600/month (or ₹70/meal)"
    },
    rent: 2600,
    deposit: 0,
    approxLocation: "Bhawarkuan & Geeta Bhawan (Serving 3.5 km radius)",
    exactLocation: "Sharma Sadan, 28 Navlakha Main Road, Bhawarkuan, Indore - 452001",
    distance: "Free doorstep delivery across Bhawarkuan, Geeta Bhawan, Sapna Sangeeta",
    neighborhood: "Bhawarkuan",
    provider: {
      name: "Smt. Sharda Sharma",
      verified: true,
      rating: 4.9,
      reviewCount: 64,
      phone: "+91 94250 22345",
      whatsapp: "+91 94250 22345",
      email: "annapurna.indore@roomtiffin.in"
    },
    rating: 4.9,
    reviewCount: 64,
    availability: "Accepting new monthly subscriptions",
    isAvailable: true,
    isFeatured: true,
    isPopular: true,
    isNewThisWeek: false,
    deliveryHours: "Lunch: 12:15 PM - 1:30 PM | Dinner: 7:30 PM - 9:00 PM",
    deliveryRadius: "3.5 km free delivery radius",
    mealPlan: "Lunch & Dinner 6 days a week (Mon-Sat, Sunday special)",
    weeklySchedule: [
      "Mon: Dal Tadka + Sev Tamatar + 4 Ghee Phulkas + Rice + Salad",
      "Tue: Rajma Masala + Jeera Aloo + 4 Ghee Phulkas + Steamed Rice",
      "Wed: Malwi Paneer Bhurji + Yellow Dal + 4 Phulkas + Pulao",
      "Thu: Kadhi Pakoda + Moong Khichdi + Roasted Papad + Chutney",
      "Fri: Chana Masala + Aloo Gobi + 4 Phulkas + Jeera Rice",
      "Sat: Mix Veg Curry + Panchmel Dal + 4 Phulkas + Bundi Raita",
      "Sun: Authentic Indori Dal Baati Churma + Chhaachh Feast"
    ],
    features: [
      "100% Pure Vegetarian & Low Oil",
      "Desi Cow Ghee Phulkas",
      "Fresh Curd & Salad Daily",
      "Sunday Dal Baati Churma Feast",
      "Sample Trial Box at ₹70",
      "Pause Plan with 2-hr Notice on WhatsApp"
    ],
    specs: {
      "Diet Preference": "Pure Vegetarian (Jain options on request)",
      "Daily Tiffin Contents": "4 Phulka Rotis + 2 Sabzis (Sev Tamatar/Gravy + Dry) + Dal Fry + Rice + Salad & Pickle",
      "Lunch Delivery": "12:30 PM sharp",
      "Dinner Delivery": "8:00 PM sharp",
      "Packaging": "Stainless steel 4-tier tiffin or bio-degradable meal box",
      "Trial Meal": "Available for ₹70 with free delivery"
    },
    images: [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "tiffin-002",
    id: "tiffin-002",
    category: "tiffin",
    city: "Indore",
    title: "Swad Mandir Kitchen",
    description: "Authentic Gujarati and Pure Jain thali meals cooked strictly without onion, garlic, or root vegetables. Operating in Scheme 54 / Vijay Nagar, catering to corporate professionals and students in Scheme 78, AB Road, and Vijay Nagar. Prepared with brass cookware and served with fresh phulkas smeared with homemade white butter.",
    foodType: "jain",
    cuisine: "Traditional Gujarati & Pure Jain Thali",
    pricing: {
      amount: 2900,
      period: "month",
      perMeal: 75,
      deposit: 0,
      formatted: "₹2,900/month (or ₹75/meal)"
    },
    rent: 2900,
    deposit: 0,
    approxLocation: "Vijay Nagar Scheme 54 & Scheme 78",
    exactLocation: "Swad Mandir, 77 Scheme 54 PU-3, Vijay Nagar, Indore - 452010",
    distance: "Servicing Scheme 54, Scheme 78, Satya Sai & Vijay Nagar",
    neighborhood: "Vijay Nagar",
    provider: {
      name: "Bhavna Ben Shah",
      verified: true,
      rating: 4.85,
      reviewCount: 52,
      phone: "+91 94253 66789",
      whatsapp: "+91 94253 66789",
      email: "swadmandir.indore@roomtiffin.in"
    },
    rating: 4.85,
    reviewCount: 52,
    availability: "Available today for lunch order",
    isAvailable: true,
    isFeatured: true,
    isPopular: false,
    isNewThisWeek: true,
    deliveryHours: "Lunch: 12:00 PM - 1:30 PM | Dinner: 7:15 PM - 8:45 PM",
    deliveryRadius: "4 km radius across Vijay Nagar",
    mealPlan: "Monthly Lunch / Dinner or Both Plans",
    weeklySchedule: [
      "Mon: Sweet Gujarati Dal + Sev Tomato Jain Sabzi + 5 Phulkas",
      "Tue: Moong Dal Khichdi + Gujrati Kadhi + Papad + Athana",
      "Wed: Methi Thepla + Paneer Korma (No onion garlic) + Rice",
      "Thu: Val Dal + Bhindi Sambharo + 5 Phulkas + Chaas",
      "Fri: Gujarati Kadhi + Vegetable Pulao + Roasted Papad",
      "Sat: Mixed Gourd Kofta + Dal Fry + 5 Phulkas + Rice",
      "Sun: Kesar Shrikhand + Puri + Gujarati Dal Special Feast"
    ],
    features: [
      "Strictly Jain (No Onion, No Garlic, No Potato/Root Veg)",
      "Traditional Desi Butter Phulkas",
      "Fresh Buttermilk (Chaas) Cup Daily",
      "FSSAI Certified Clean Commercial Kitchen",
      "Flexible Meal Pauses via Sathi App"
    ],
    specs: {
      "Diet Preference": "Jain & Sattvic",
      "Menu": "5 Rotis, Dal/Kadhi, 2 Sabzis, Basmati Rice, Chaas & Roasted Papad",
      "Trial Price": "₹75 with free PG delivery"
    },
    images: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "tiffin-003",
    id: "tiffin-003",
    category: "tiffin",
    city: "Indore",
    title: "Marwar Kitchen Tiffin Co.",
    description: "Hearty Rajasthani and high-protein North Indian tiffin service operating out of Palasia. Perfect for gym-goers, remote techies, and coaching students who need balanced protein macros (Paneer, Soya Chaap, Dal Makhani, sprouted salads) and bold, memorable flavours.",
    foodType: "north indian",
    cuisine: "Rajasthani & North Indian High-Protein",
    pricing: {
      amount: 3200,
      period: "month",
      perMeal: 85,
      deposit: 0,
      formatted: "₹3,200/month (or ₹85/meal)"
    },
    rent: 3200,
    deposit: 0,
    approxLocation: "New Palasia & Geeta Bhawan",
    exactLocation: "Marwar Rasoi, 11 Tukoganj Main Road, Near Palasia, Indore - 452001",
    distance: "Covering Palasia, Geeta Bhawan, Saket, Vallabh Nagar",
    neighborhood: "Palasia",
    provider: {
      name: "Rathore Brothers",
      verified: true,
      rating: 4.88,
      reviewCount: 47,
      phone: "+91 94254 77890",
      whatsapp: "+91 94254 77890",
      email: "marwar.indore@roomtiffin.in"
    },
    rating: 4.88,
    reviewCount: 47,
    availability: "Accepting weekly & monthly subscriptions",
    isAvailable: true,
    isFeatured: false,
    isPopular: true,
    isNewThisWeek: false,
    deliveryHours: "Lunch: 12:30 PM - 2:00 PM | Dinner: 7:45 PM - 9:15 PM",
    deliveryRadius: "5 km radius across central Indore",
    mealPlan: "Custom High-Protein or Regular Daily Meal Plan",
    weeklySchedule: [
      "Mon: Rajasthani Gatta Curry + Dal Tadka + 4 Multigrain Rotis",
      "Tue: High-Protein Paneer Bhurji + Pindi Chole + Rice",
      "Wed: Malwa Dum Aloo + Panchmel Dal + 4 Rotis + Salad",
      "Thu: Dal Makhani + Soya Chunks Curry + Jeera Rice",
      "Fri: Palak Paneer + Rajma Masala + 4 Rotis + Sprout Bowl",
      "Sat: Kadhai Paneer + Pindi Chana + Veg Pulao",
      "Sun: Special Churma Baati Feast with Ghee"
    ],
    features: [
      "High Protein: 25g+ Protein per Meal Option",
      "Choice of Multigrain or Wheat Phulkas",
      "Sprout Salads & Peanut Chutney included",
      "Zero Artificial Colours or Preservatives",
      "Instant WhatsApp Delivery Tracking"
    ],
    specs: {
      "Diet Preference": "Vegetarian & High-Protein",
      "Box Contents": "4 Multigrain Rotis, High-Protein Sabzi, Dal Tadka, Brown/White Rice, Sprout Salad",
      "Trial Price": "₹85 with doorstep drop"
    },
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "tiffin-004",
    id: "tiffin-004",
    category: "tiffin",
    city: "Indore",
    title: "Shree Mahalakshmi Malwa Bhoj",
    description: "Beloved student tiffin service operating near Rau Circle and Silicon City, delivering fresh hot meals directly to student hostels of IPS Academy, Medi-Caps University, and Sage University. Cooked in traditional homestyle Malwi method with fresh rotis, wholesome seasonal vegetables, dal fry, steamed rice, and Sunday special Dal Baati Churma with buttermilk.",
    foodType: "pure vegetarian",
    cuisine: "Authentic Malwi Student Bhojnalaya",
    pricing: {
      amount: 2400,
      period: "month",
      perMeal: 65,
      deposit: 0,
      formatted: "₹2,400/month (or ₹65/meal)"
    },
    rent: 2400,
    deposit: 0,
    approxLocation: "Rau Circle & Silicon City",
    exactLocation: "Shree Mahalakshmi Bhojnalaya, Main Road, Rau, Indore - 453331",
    distance: "Covering Rau, Silicon City, Pithampur Gate",
    neighborhood: "Rau",
    provider: {
      name: "Sharma Bhoj Family",
      verified: true,
      rating: 4.8,
      reviewCount: 61,
      phone: "+91 94255 22345",
      whatsapp: "+91 94255 22345",
      email: "mahalakshmi.indore@roomtiffin.in"
    },
    rating: 4.8,
    reviewCount: 61,
    availability: "Monthly subscriptions open for new students",
    isAvailable: true,
    isFeatured: false,
    isPopular: false,
    isNewThisWeek: false,
    deliveryHours: "Lunch: 12:00 PM - 1:15 PM | Dinner: 7:30 PM - 8:30 PM",
    deliveryRadius: "6 km radius across Rau & Silicon City",
    mealPlan: "Monthly Regular Lunch / Dinner Combo Plan",
    weeklySchedule: [
      "Mon: Malwi Daal + Sev Tamatar + 5 Phulkas + Chaas",
      "Tue: Patta Gobhi Sabzi + Dal Fry + 5 Phulkas + Rice",
      "Wed: Aaloo Matar + Bhindi Masala + 5 Phulkas",
      "Thu: Kadhi + Dal Bafla Special + Choorma",
      "Fri: Malwi Dal + Baagi Aaloo + 5 Phulkas + Rice",
      "Sat: Gatte Ki Sabzi + Dal + Jeera Rice",
      "Sun: Dal Baati Churma Special Feast with Ghee"
    ],
    features: [
      "Pure Desi Ghee Dal Baati Cheesiness",
      "Traditional Malwi Homestyle Cooking",
      "Unlimited Thali Refill on Weekly Plan",
      "Freshly Ground Masalas & Wood-Pressed Oils",
      "Free Sunday Sweet on Monthly Plans"
    ],
    specs: {
      "Diet Preference": "Pure Vegetarian Malwi",
      "Box Contents": "5 Phulkas, Malwi Dal, Seasonal Sabzi, Rice, Chaas & Sweet",
      "Trial Price": "₹65 with direct hostel delivery"
    },
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
    ]
  }
]

// In-memory demo/test user for backend authentication (Indore based)
export const seededUser = {
  _id: "user-seeded-001",
  id: "user-seeded-001",
  name: "Aarav Sharma",
  email: "demo@roomtiffin.in",
  phone: "+91 98260 00123",
  userType: "USER",
  referralCode: "RT-AARAV24",
  referredBy: null,
  walletBalance: 250,
  address: "Flat 204, Serene Nest, Bhawarkuan, Indore"
}

// Category exports
export const mockRooms = mockListings.filter(l => l.category === "rooms")
export const mockTiffins = mockListings.filter(l => l.category === "tiffin")

// No photo is reused across listings (rooms and tiffins never share an image)
dedupeListingImages(mockRooms, mockTiffins)
