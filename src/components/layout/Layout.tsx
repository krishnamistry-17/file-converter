import ScrollWindow from "../ScrollWindow";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <ScrollWindow>
        <Outlet />
      </ScrollWindow>
      <Footer />
    </div>
  );
};
export default Layout;
