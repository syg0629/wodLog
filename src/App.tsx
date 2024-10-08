import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import RecordList from "./pages/Record/RecordList";
import WriteRecord from "./pages/Record/WriteRecord";
import HoldList from "./pages/Hold/HoldList";
import EditHold from "./pages/Hold/EditHold";
import WriteHold from "./pages/Hold/WriteHold";
import Login from "./pages/Login/Login";
import ContentList from "./components/Content/ContentList";
import WriteContentForm from "./components/Content/WriteContentForm";
import DetailContent from "./components/Content/DetailContent";
import EditContent from "./components/Content/EditContent";
import { ProtectedRoute } from "../src/components/common/ProtectedRoute";
import { AuthHandler } from "./pages/Login/AuthHandler";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/auth/callback" element={<AuthHandler />} />
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
          <Route path="/wod" element={<ContentList contentType="wod" />} />
          <Route
            path="/wod/:id"
            element={<DetailContent contentType="wod" />}
          />
          <Route
            path="/wod/:id/edit"
            element={<EditContent contentType="wod" />}
          />
          <Route path="/record" element={<RecordList />} />
          <Route path="/record/write" element={<WriteRecord />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/notice/write"
              element={<WriteContentForm isEdit={false} contentType="notice" />}
            />
            <Route
              path="/wod/write"
              element={<WriteContentForm isEdit={false} contentType="wod" />}
            />
            <Route path="/hold" element={<HoldList />} />
            <Route path="/hold/write" element={<WriteHold isEdit={false} />} />
            <Route path="/hold/:id/edit" element={<EditHold />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </QueryClientProvider>
  );
};

export default App;
