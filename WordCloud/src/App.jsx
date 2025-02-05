import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Landing page components
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Solutions from "./Components/Solutions";
import Features from "./Components/Features";
import HowItWorks from "./Components/HowItWorks";
import Pricing from "./Components/Pricing";
import Footer from "./Components/Footer";
// Dashboard and session components
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import SessionSetup from "./Pages/SessionSetup";
import SessionView from "./Pages/SessionView";
import EditSession from "./Pages/EditSession";
import JoinSession from "./Pages/participant/JoinSession";
import ParticipantView from "./Pages/participant/ParticipantView";

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-white'>
        {/* Navbar will show on landing page only */}
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Navbar />
                <Hero />
                <Solutions />
                <Features />
                <HowItWorks />
                <Pricing />
                <Footer />
              </>
            }
          />

          {/* Auth & Dashboard Routes */}
          <Route path='/auth' element={<SignUp />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/session-setup' element={<SessionSetup />} />
          <Route path='/dashboard/session/:id' element={<SessionView />} />
          <Route
            path='/dashboard/session-setup/:sessionId/edit'
            element={<EditSession />}
          />

          {/* Participant Routes */}
          <Route path='/join' element={<JoinSession />} />
          <Route path='/participate/:sessionId' element={<ParticipantView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
