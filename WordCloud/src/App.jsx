// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import SessionSetup from "./Pages/SessionSetup";
import SessionView from "./Pages/SessionView";
import EditSession from "./Pages/EditSession";
import JoinSession from "./Pages/participant/JoinSession";
import ParticipantView from "./Pages/participant/ParticipantView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Presenter Routes */}
        <Route path='/' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/session-setup' element={<SessionSetup />} />
        <Route path='/dashboard/session/:id' element={<SessionView />} />
        <Route
          path='/dashboard/session-setup/:sessionId/edit'
          element={<EditSession />}
        />

        {/* Participant Routes - at root level */}
        <Route path='/join' element={<JoinSession />} />
        {/* We'll create ParticipantView component next */}
        <Route path='/participate/:sessionId' element={<ParticipantView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
