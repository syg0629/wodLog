import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RecordList from "./pages/Record/RecordList";
import WriteRecord from "./pages/Record/WriteRecord";
import HoldList from "./pages/Hold/HoldList";
import EditHold from "./pages/Hold/EditHold";
import WriteHold from "./pages/Hold/WriteHold";
import Login from "./pages/Login/Login";
import ContentList from "./components/common/Content/ContentList";
import WriteContentForm from "./components/common/Content/WriteContentForm";
import DetailContent from "./components/common/Content/DetailContent";
import EditContent from "./components/common/Content/EditContent";
import { useAuthSetup } from "./hooks/useAuthSetup";

const queryClient = new QueryClient();

const App = () => {
  useAuthSetup();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/notice"
            element={<ContentList contentType="notice" />}
          />
          <Route
            path="/notice/:id"
            element={<DetailContent contentType="notice" />}
          />
          <Route
            path="/notice/:id/edit"
            element={<EditContent contentType="notice" />}
          />
          <Route
            path="/notice/write"
            element={<WriteContentForm isEdit={false} contentType="notice" />}
          />
          <Route path="/wod" element={<ContentList contentType="wod" />} />
          <Route
            path="/wod/:id"
            element={<DetailContent contentType="wod" />}
          />
          <Route
            path="/wod/:id/edit"
            element={<EditContent contentType="wod" />}
          />
          <Route
            path="/wod/write"
            element={<WriteContentForm isEdit={false} contentType="wod" />}
          />
          <Route path="/record" element={<RecordList />} />
          <Route path="/record/write" element={<WriteRecord />} />
          <Route path="/hold" element={<HoldList />} />
          <Route path="/hold/write" element={<WriteHold isEdit={false} />} />
          <Route path="/hold/:id/edit" element={<EditHold />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </QueryClientProvider>
  );
};

export default App;
