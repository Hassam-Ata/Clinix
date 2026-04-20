import { Outlet } from "react-router-dom";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;

