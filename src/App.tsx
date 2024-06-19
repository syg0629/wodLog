import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NoticeList from "./pages/Notice/NoticeList";
import DetailNotice from "./pages/Notice/DetailNotice";
import EditNotice from "./pages/Notice/EditNotice";
import WriteNoticeForm from "./pages/Notice/WriteNoticeForm";
import WodList from "./pages/Wod/WodList";
import DetailWod from "./pages/Wod/DetailWod";
import EditWod from "./pages/Wod/EditWod";
import WriteWodForm from "./pages/Wod/WriteWodForm";
import RecordList from "./pages/Record/RecordList";
import WriteRecord from "./pages/Record/WriteRecord";
import HoldList from "./pages/Hold/HoldList";
import EditHold from "./pages/Hold/EditHold";
import WriteHold from "./pages/Hold/WriteHold";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notice" element={<NoticeList />} />
          <Route path="/notice/:id" element={<DetailNotice />} />
          <Route
            path="/notice/write"
            element={<WriteNoticeForm isEdit={false} />}
          />
          <Route path="/notice/:id/edit" element={<EditNotice />} />
          <Route path="/wod" element={<WodList />} />
          <Route path="/wod/:id" element={<DetailWod />} />
          <Route path="/wod/write" element={<WriteWodForm isEdit={false} />} />
          <Route path="/wod/:id/edit" element={<EditWod />} />
          <Route path="/record" element={<RecordList />} />
          <Route path="/record/write" element={<WriteRecord />} />
          <Route path="/hold" element={<HoldList />} />
          <Route path="/hold/write" element={<WriteHold isEdit={false} />} />
          <Route path="/hold/:id/edit" element={<EditHold />} />
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
