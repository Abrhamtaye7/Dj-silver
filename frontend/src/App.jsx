import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import NeonBackground from "./components/NeonBackground.jsx";
import Home from "./pages/Home.jsx";
import Promo from "./pages/Promo.jsx";
import Schedule from "./pages/Schedule.jsx";
import Fans from "./pages/Fans.jsx";
import Booking from "./pages/Booking.jsx";
import Contact from "./pages/Contact.jsx";
import Music from "./pages/Music.jsx";
import Media from "./pages/Media.jsx";
import Community from "./pages/Community.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-100">
        <NeonBackground />
        <Navbar />
        <main className="page-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/fans" element={<Fans />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/music" element={<Music />} />
            <Route path="/media" element={<Media />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
