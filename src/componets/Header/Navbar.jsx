import React, { useState, useEffect, useContext } from "react";

import { Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../../Context/UserContext";

function Navbar(props) {
  const { User } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (User != null) {
      setProfilePic(User.photoURL);
    }
    window.addEventListener("scroll", transitionNavBar);
    console.log("Navbar", User);
    return () => {
      window.removeEventListener("scroll", transitionNavBar);
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const [show, handleShow] = useState(false);
  const transitionNavBar = () => {
    if (window.scrollY > 80) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  const NavBlack = () => {
    handleShow(true);
  };
  const NavTransparent = () => {
    handleShow(false);
  };

  const SignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Fade>
      <header
        className={
          props.playPage
            ? "fixed top-0 z-10 w-full backdrop-blur-sm"
            : "fixed top-0 z-10 w-full"
        }
      >
        <nav
          className={`transition duration-500 ease-in-out  ${show && "transition duration-500 ease-in-out bg-black "
            } `}
        >
          <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 sm:h-14 md:h-16 w-24 sm:w-32 md:w-40 ml-8 mt-2 cursor-pointer transform hover:scale-105 transition-transform duration-300 rounded-[50%] object-cover"
                    src="/Dontflix.png"
                    alt="DONTFIX"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center ml-10 space-x-4">
                    <Link
                      to={"/"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Accueil
                    </Link>

                    <Link
                      to={"/top10"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Le Top 10
                    </Link>

                    <Link
                      to={"/series"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Séries
                    </Link>

                    <Link
                      to={"/history"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Historique
                    </Link>

                    <Link
                      to={"/liked"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Favoris
                    </Link>

                    <Link
                      to={"/mylist"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Ma Liste
                    </Link>
                    <Link
                      to={"/recommendations"}
                      className="py-2 font-medium text-white transition ease-in-out delay-150 rounded-md cursor-pointer hover:text-red-800 lg:px-3 text-m"
                    >
                      Recommandations
                    </Link>
                  </div>
                </div>
              </div>

              <div className="ml-auto">
                <div className="flex">
                  {/* Search Icon */}
                  <Link to={"/search"}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="items-center w-10 h-10 pr-4 mt-auto mb-auto text-white hover:text-red-800 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </Link>

                  {User ? (
                    <a className="items-center hidden pr-4 mt-auto mb-auto text-base font-medium text-white transition ease-in-out delay-150 cursor-pointer hover:text-red-800 md:flex">
                      {User.displayName}
                    </a>
                  ) : null}



                  <div className="group inline-block relative transition ease-in-out delay-300">
                    <Link to={"/home"}>
                      <img
                        className="h-10 w-10 rounded-full cursor-pointer"
                        src={
                          profilePic
                            ? `${User.photoURL}`
                            : `https://www.citypng.com/public/uploads/preview/profile-user-round-red-icon-symbol-download-png-11639594337tco5j3n0ix.png`
                        }
                        alt="NETFLIX"
                      />
                    </Link>
                    <ul class="absolute hidden text-white pt-1 -ml-32 group-hover:block transition ease-in-out delay-150">

                      <li>
                        <Link
                          to={"/signin"}
                          className="cursor-pointer bg-stone-900 font-semibold hover:border-l-4 hover:bg-gradient-to-r from-[#ff000056] border-red-800 py-2 px-4 block whitespace-no-wrap transition ease-in-out delay-150"
                        >
                          Ajouter un utilisateur
                        </Link>
                      </li>
                      <li>
                        <a
                          onClick={SignOut}
                          className="cursor-pointer rounded-b bg-stone-900 font-bold hover:border-l-4 hover:bg-gradient-to-r from-[#ff000056] border-red-800 py-2 px-4 block whitespace-no-wrap transition ease-in-out delay-150"
                        >
                          Déconnexion
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex pl-4 -mr-2 md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-900 rounded-md hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Ouvrir le menu principal</span>
                  {!isOpen ? (
                    <svg
                      className="block w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      onClick={NavBlack}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      onClick={NavTransparent}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div className="md:hidden" id="mobile-menu">
                <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <Link to={"/"}>
                    <a className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-red-800">
                      Accueil
                    </a>
                  </Link>

                  <Link to={"/top10"}>
                    <a className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white">
                      Top 10
                    </a>
                  </Link>

                  <Link to={"/series"}>
                    <a className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white">
                      Séries TV
                    </a>
                  </Link>

                  <Link to={"/history"}>
                    <a className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white">
                      Historique
                    </a>
                  </Link>

                  <Link to={"/liked"}>
                    <a className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white">
                      Favoris
                    </a>
                  </Link>

                  <Link to={"/mylist"}>
                    <a className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white">
                      Ma Liste
                    </a>
                  </Link>

                  <Link to={"/signin"}>
                    <a className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white">
                      Ajouter un utilisateur
                    </a>
                  </Link>

                  <a
                    onClick={SignOut}
                    className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white"
                  >
                    Déconnexion
                  </a>
                </div>
              </div>
            )}
          </Transition>
        </nav>
      </header>
    </Fade>
  );
}

export default Navbar;
