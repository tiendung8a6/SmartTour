import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar, Sidebar, UpdateProfile } from "./components";
import {
  // OTPVerification,
  // WritePost,
  Analytics,
  Contents,
  Dashboard,
  Followers,
  StartPage,
  Users,
  Contacts,
  Policy,
  Categories,
  Trips,
  Payments,
  Notifications,
} from "./pages";
import useStore from "./store/store";

function Layout() {
  const { user } = useStore((state) => state);
  const location = useLocation();

  return user?.token ? (
    <div className="w-full h-screen">
      <Navbar />
      <div className="w-full h-full flex border-t pt-[76px]">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        <div className="w-full flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <Outlet />
          {/* <Footer /> */}
        </div>
      </div>
      <UpdateProfile key={new Date()} />
    </div>
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
}

function App() {
  return (
    <main className="w-full min-h-screen">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/analytics" />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/contents" element={<Contents />} />
          <Route path="/users" element={<Users />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="/sign-in" element={<StartPage />} />
        {/* <Route path="/otp-verification" element={<OTPVerification />} /> */}
      </Routes>
    </main>
  );
}

export default App;
