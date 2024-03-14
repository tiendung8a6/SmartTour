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
} from "./pages";
import { Footer, Loading, Navbar } from "./components";
import useStore from "./store";

function Layout() {
  return (
    <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
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
            <Route path="/" />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/:slug/:id?" element={<BlogDetail />} />
            <Route path="/writer/:id" element={<WriterPage />} />
          </Route>

          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
        {isLoading && <Loading />}
      </div>
    </main>
  );
}

export default App;
