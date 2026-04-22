import { Outlet } from "react-router-dom";
import Navbar from "../landing/Navbar";


const RootLayout = () => {
  return (
    <div className="min-h-full flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;

