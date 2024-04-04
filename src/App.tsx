import "./App.css";
import { Routes, Route } from "react-router-dom";
import Wod from "./pages/Wod";
import Record from "./pages/Record";
import Hold from "./pages/Hold";
import Shop from "./pages/Shop";
import Notice from "./pages/Notice";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import WriteNotice from "./pages/WriteNotice";
import WriteRecord from "./pages/WriteRecord";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/write" element={<WriteNotice />} />
        <Route path="/wod" element={<Wod />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/write" element={<WriteRecord />} />
        <Route path="/hold" element={<Hold />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
