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
  Trip,
  TravelGuide,
  TripSummary,
  NewTrip,
  Profile,
  PlansCreate,
  NewActivity,
  EditTrip,
  PrintTrip,
  NewLodging,
  NewFlights,
  NewCar,
  NewConcert,
  NewTheater,
  NewCamp,
  NewParking,
  NewRestaurant,
  NewRail,
  EditActivity,
  MyTripsPanel,
  PublicTripsPanel,
  EditFlights,
  EditConcert,
  EditTheater,
  EditCar,
  EditParking,
  EditRail,
  Pricing,
  Checkout,
  Cancel,
  Success,
  EditLodging,
  EditRestaurant,
  ViewFlights,
  ViewLodging,
  ViewCar,
  ViewParking,
  ViewTheater,
  ViewRail,
  ViewConcert,
  ViewRestaurant,
  ViewActivity,
  Notification,
  TripSummaryPublic,
  MapPage,
  Policy,
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
      <div
        className={`w-full min-h-screen relative dark:bg-[#05132b] bg-white`}
      >
        <Routes>
          <Route element={<Layout />}>
            {/* <Route path="/" /> */}
            <Route path="/" element={<Home />} />
            <Route path="/map/:id" element={<MapPage />}></Route>
            <Route path="/policy" element={<Policy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/success" element={<Success />} />
            <Route path="/notification" element={<Notification />} />
            <Route
              path="/pricing/checkout/:paymentType"
              element={<Checkout />}
            />
            <Route path="/blog/category" element={<CategoryPage />} />
            <Route path="/blog/:slug/:id?" element={<BlogDetail />} />
            <Route path="/blog/writer/:id" element={<WriterPage />} />
            <Route path="/travel-guide" element={<TravelGuide />} />
            <Route path="/trip" element={<Trip />} />
            <Route path="/my-trips" element={<MyTripsPanel />} />
            <Route path="/public-trips" element={<PublicTripsPanel />} />
            <Route path="/trip/:id" element={<TripSummary />} />
            <Route path="/trip/:id/public" element={<TripSummaryPublic />} />
            <Route path="/trip/create" element={<NewTrip />} />
            <Route path="/trip/:id/edit" element={<EditTrip />} />
            <Route path="/trip/:id/print" element={<PrintTrip />} />
            <Route path="/trip/:id/plans/create" element={<PlansCreate />} />
            <Route path="/trip/:id/activity/create" element={<NewActivity />} />
            <Route path="/trip/:id/lodging/create" element={<NewLodging />} />
            <Route path="/trip/:id/flights/create" element={<NewFlights />} />
            <Route path="/trip/:id/car/create" element={<NewCar />} />
            <Route path="/trip/:id/concert/create" element={<NewConcert />} />
            <Route path="/trip/:id/theater/create" element={<NewTheater />} />
            <Route path="/trip/:id/camp/create" element={<NewCamp />} />
            <Route path="/trip/:id/parking/create" element={<NewParking />} />
            <Route path="/trip/:id/rail/create" element={<NewRail />} />

            <Route
              path="/trip/:id/restaurant/create"
              element={<NewRestaurant />}
            />
            <Route
              path="/trip/:id/activity/:planId/edit"
              element={<EditActivity />}
            />
            <Route
              path="/trip/:id/flights/:planId/edit"
              element={<EditFlights />}
            />
            <Route
              path="/trip/:id/concert/:planId/edit"
              element={<EditConcert />}
            />
            <Route
              path="/trip/:id/theater/:planId/edit"
              element={<EditTheater />}
            />
            <Route path="/trip/:id/car/:planId/edit" element={<EditCar />} />
            <Route
              path="/trip/:id/parking/:planId/edit"
              element={<EditParking />}
            />
            <Route path="/trip/:id/rail/:planId/edit" element={<EditRail />} />
            <Route
              path="/trip/:id/lodging/:planId/edit"
              element={<EditLodging />}
            />
            <Route
              path="/trip/:id/restaurant/:planId/edit"
              element={<EditRestaurant />}
            />

            <Route
              path="/trip/:id/flights/:planId/view"
              element={<ViewFlights />}
            />
            <Route
              path="/trip/:id/lodging/:planId/view"
              element={<ViewLodging />}
            />

            <Route
              path="/trip/:id/theater/:planId/view"
              element={<ViewTheater />}
            />

            <Route
              path="/trip/:id/parking/:planId/view"
              element={<ViewParking />}
            />
            <Route path="/trip/:id/car/:planId/view" element={<ViewCar />} />
            <Route path="/trip/:id/rail/:planId/view" element={<ViewRail />} />
            <Route
              path="/trip/:id/concert/:planId/view"
              element={<ViewConcert />}
            />
            <Route
              path="/trip/:id/restaurant/:planId/view"
              element={<ViewRestaurant />}
            />
            <Route
              path="/trip/:id/activity/:planId/view"
              element={<ViewActivity />}
            />

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
