import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import SessionSetup from "./Pages/SessionSetup";
import SessionView from "./Pages/SessionView";
import PresentView from "./Pages/PresentView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/dashboard'>
          <Route index element={<Dashboard />} />
          <Route path='session-setup' element={<SessionSetup />} />
          <Route path='session/:id' element={<SessionView />} />
          <Route path='session/:id/present' element={<PresentView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
