import { useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative ">
        <h1 className="text-xl font-bold">My App</h1>

        <div className="md:flex hidden items-center gap-6">
          <button onClick={() => navigate("/merge-pdfs")}>Merge PDF</button>
          <button onClick={() => navigate("/split-pdfs")}>Split PDF</button>
          <button onClick={() => navigate("/compress-pdfs")}>
            Compress PDF
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2"
              onClick={toggleDropdown}
              onMouseEnter={() => setOpen(true)}
            >
              Convert PDF <FaChevronDown />
            </button>

            {open && (
              <div onMouseLeave={() => setOpen(false)}>
                <Dropdown close={() => setOpen(false)} />
              </div>
            )}
          </div>
        </div>

        <div>
          <button className="bg-gray-200 px-4 py-2 rounded-md mr-2">
            Login
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-md">Register</button>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        </div>
        {mobileMenu && (
          <div
            onMouseLeave={() => setMobileMenu(false)}
            className="absolute top-18 right-0 mt-2 p-4 w-[250px] bg-white shadow-lg rounded-md text-sm"
          >
            <div className="absolute top-0 right-0">
              <IoMdClose onClick={() => setMobileMenu(false)} />
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/merge-pdfs")}>Merge PDF</button>
              <button onClick={() => navigate("/split-pdfs")}>Split PDF</button>
              <button onClick={() => navigate("/compress-pdfs")}>
                Compress PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
