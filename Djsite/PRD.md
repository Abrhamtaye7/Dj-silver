# PRD: DJ SILVER WEB ECOSYSTEM (VERSION 1.0)
# TARGET: FULL-STACK MERN (MONGODB, EXPRESS, REACT, NODE)

## 1. PROJECT OVERVIEW
A professional DJ brand platform focused on two conversion goals: 
1. Professional booking acquisition (Event Organizers).
2. Fan engagement via high-frictionless guest posting.

## 2. TECHNICAL STACK & INFRASTRUCTURE
- Frontend: React.js (Functional Components, Hooks).
- Backend: Node.js, Express.js.
- Database: MongoDB (NoSQL).
- Media: Local File System storage on Linux VPS.
- Auth: JWT-based, single-user admin (Hardcoded ENV).
- Styling: Tailwind CSS (Primary) / Framer Motion (Animations).

## 3. DATABASE SCHEMA MODELS (MONGOOSE)
- Admin: None (Env-based logic).
- FanPost: 
    { 
      authorName: String (Required), 
      content: String (Max 500 chars), 
      imagePath: String (Optional), 
      likes: Array (Store IP addresses to prevent duplicate likes), 
      createdAt: Date 
    }
- Comment: 
    { 
      postId: ObjectId, 
      authorName: String, 
      content: String, 
      createdAt: Date 
    }
- Booking: 
    { 
      clientName: String, 
      email: String, 
      eventType: Enum['Club', 'Corporate', 'Festival', 'Private'], 
      eventDate: Date, 
      budgetRange: String, 
      status: String (Default: 'unread') 
    }
- Event (Ticker): 
    { 
      venue: String, 
      location: String, 
      date: Date, 
      isActive: Boolean 
    }

## 4. FRONTEND COMPONENT TREE & PAGES
- Layout: Navbar (Logo + Hamburger), Footer.
- Home: 
    - Hero: Glitch-effect image background + "Book Now" CTA.
    - Marquee: Gig Ticker (Horizontal scroll).
    - Grid: Services/Expertise (4 Cards).
    - Audio: Full-width Wavesurfer.js strip.
- Fans (Masonry): 
    - Pinterest Grid of FanPost cards.
    - FAB (Floating Action Button) for post creation.
    - Modal: One-time Name prompt (Sync with LocalStorage).
- Booking: 
    - 3-Step Wizard Form (State-managed).
- Music: 
    - Official Spotify Playlists/Tracks Embeds.

## 5. BACKEND API ROUTES
- GET /api/events -> Fetch active gigs.
- POST /api/bookings -> Submit wizard form (Rate-limited).
- GET /api/fans -> Fetch posts + comments.
- POST /api/fans -> Create post (Multer middleware for images).
- POST /api/fans/:id/like -> Toggle like (IP-based).
- POST /api/auth/login -> Admin verification.
- DELETE /api/admin/fans/:id -> Admin-only post removal.

## 6. SYSTEM LOGIC & CONSTRAINTS
- Rate Limiting: 10 mins window for bookings; 1 hour window for fan posts.
- File Validation: Max 5MB images; formats: jpg, png, webp.
- Local Storage: Store 'dj_silver_guest_name' to bypass future modals.



1. FanPost Model (models/FanPost.js)
This model handles the masonry grid content. Note the likes array—instead of a simple counter, we store IP addresses to ensure a guest can only like a post once.

JavaScript

const mongoose = require('mongoose');

const FanPostSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [30, 'Name cannot exceed 30 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [500, 'Post cannot exceed 500 characters']
  },
  imagePath: {
    type: String, // Stores the local FS path: /uploads/fans/filename.jpg
    default: null
  },
  // We store IPs in an array to prevent "Like" spamming from the same guest
  likes: {
    type: [String], 
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FanPost', FanPostSchema);
2. Comment Model (models/Comment.js)
These are tied directly to a FanPost using a reference.

JavaScript

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FanPost',
    required: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [300, 'Comment is too long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
3. Booking Model (models/Booking.js)
Designed to capture the 3-step wizard data.

JavaScript

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  eventType: {
    type: String,
    enum: ['Club', 'Corporate', 'Production', 'Festival', 'Private'],
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  budgetRange: {
    type: String,
    default: 'Not Specified'
  },
  message: String,
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
4. Event Model (models/Event.js)
This powers the "Next Gig" ticker on the Home page.

JavaScript

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  venue: {
    type: String,
    required: true
  },
  location: {
    type: String, // e.g., "London, UK"
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Event', EventSchema);