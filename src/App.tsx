import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";
import { ProtectedRoute } from "../src/components/common/ProtectedRoute";

const Home = lazy(() => import("./pages/Home/Home"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const RecordList = lazy(() => import("./pages/Record/RecordList"));
const WriteRecord = lazy(() => import("./pages/Record/WriteRecord"));
const HoldList = lazy(() => import("./pages/Hold/HoldList"));
const EditHold = lazy(() => import("./pages/Hold/EditHold"));
const WriteHold = lazy(() => import("./pages/Hold/WriteHold"));
const Login = lazy(() => import("./pages/Login/Login"));
const ContentList = lazy(() => import("./components/Content/ContentList"));
const WriteContentForm = lazy(
  () => import("./components/Content/WriteContentForm")
);
const DetailContent = lazy(() => import("./components/Content/DetailContent"));
const EditContent = lazy(() => import("./components/Content/EditContent"));
const AuthHandler = lazy(() => import("./pages/Login/AuthHandler"));

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
