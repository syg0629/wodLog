import "./App.css";
import { Routes, Route } from "react-router-dom";
import Wod from "./pages/Wod";
import Record from "./pages/Record/Record";
import Hold from "./pages/Hold";
import Shop from "./pages/Shop";
import Notice from "./pages/Notice/Notice";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import WriteNotice from "./pages/Notice/WriteNotice";
import EditNotice from "./pages/Notice/EditNotice";
import WriteRecord from "./pages/Record/WriteRecord";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DetailNotice from "./pages/Notice/DetailNotice";
import { Suspense } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/notice/:id" element={<DetailNotice />} />
          <Route path="/notice/write" element={<WriteNotice />} />
          <Route path="/notice/:id/edit" element={<EditNotice />} />
          <Route path="/wod" element={<Wod />} />
          <Route path="/record" element={<Record />} />
          <Route path="/record/write" element={<WriteRecord />} />
          <Route path="/hold" element={<Hold />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </QueryClientProvider>
  );
}

export default App;
