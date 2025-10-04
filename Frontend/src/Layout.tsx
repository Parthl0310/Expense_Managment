// src/Layout.tsx
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; // adjust path if your Navbar is in a different folder

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // pages where Navbar should not appear
  const hideNavbarOn = ["/login", "/signup", "/admin"];

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
