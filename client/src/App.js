import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  BlogDetail,
  CategoryPage,
  Home,
  Blog,
  SignIn,
  SignUp,
  WriterPage,
  OTPVerification,
  ForgotPassword,
  Contact,
  NewPost,
  Trip,
  TravelGuide,
  TripDetail,
  NewTrip,
  Profile,
} from "./pages";
import { Footer, Loading, Navbar } from "./components";
import useStore from "./store";

function Layout() {
  return (
    <>
      <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

function App() {
  const { theme, isLoading } = useStore();
  const location = useLocation();

  return (
    <main className={theme}>
      <div className={`w-full min-h-sreen relative dark:bg-[#020b19] bg-white`}>
        <Routes>
          <Route element={<Layout />}>
            {/* <Route path="/" /> */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/:slug/:id?" element={<BlogDetail />} />
            <Route path="/writer/:id" element={<WriterPage />} />
            <Route path="/travel-guide" element={<TravelGuide />} />
            <Route path="/new-post" element={<NewPost />} />
            <Route path="/trip" element={<Trip />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/trip/create" element={<NewTrip />} />
            <Route path="/trip/:id/plans/create" element={<TravelGuide />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        {isLoading && <Loading />}
      </div>
    </main>
  );
}

export default App;
