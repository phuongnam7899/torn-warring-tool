import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SettingPage } from "./pages/SettingPage";
import { MainPage } from "./pages/MainPage";
import { Navbar } from "./components/Navbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SecretPage } from "./pages/SecretPage";

export const NumberFormat = new Intl.NumberFormat();

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/setting" exact element={<SettingPage />} />
            <Route path="/secret" exact element={<SecretPage />} />
          </Routes>
        </div>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
