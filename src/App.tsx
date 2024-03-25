import "./App.css";
import { Routes, Route } from "react-router-dom";
import Wod from "./pages/Wod";
import Record from "./pages/Record";
import Hold from "./pages/Hold";
import Shop from "./pages/Shop";
import Notice from "./pages/Notice";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/wod" element={<Wod />} />
        <Route path="/record" element={<Record />} />
        <Route path="/hold" element={<Hold />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
