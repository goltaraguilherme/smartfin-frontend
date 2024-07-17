import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDarkTheme } from "../context/DarkThemeContext";

interface SidebarProps {
  handlelogout: () => void;
}

export const Sidebar = ({ handlelogout }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [switchToggleDarkMode, setSwitchToggleDarkMode] =
    useState<boolean>(false);
  const [darkToggle, setDarkToggle] = useState<boolean>(false);

  let location = useLocation();
  const { isDark, toggleDarkMode } = useDarkTheme();

  return (
    <div
      className={`flex md:flex-col py-4 px-2 justify-between md:${
        isOpen ? "w-[15%]" : "w-[7%]"
      } ease-in-out duration-200`}
    >
      <div>
        <div className="hidden md:flex my-[5vh] mr-4 justify-end">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <img
              className="w-8 h-8"
              src={
                isOpen
                  ? "/assets/fechar-sidebar.png"
                  : "/assets/abrir-sidebar.png"
              }
              alt={isOpen ? "Fechar menu" : "Abrir menu"}
            />
          </button>
        </div>

        <div className="flex flex-col gap-6">

        </div>

        <NavLink to="/">
          <div
            className={`${
              String(location.pathname) === "/" && "md:bg-black md:no-underline underline rounded-lg"
            } duration-200`}
          >
            <button
              className={`${
                String(location.pathname) === "/"
                  ? "md:bg-[#D9D9D9] md:translate-x-1"
                  : "md:hover:bg-[#D9D9D9]"
              } flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}
            >
              <img
                className="hidden md:flex w-11 h-11"
                src="/assets/spread.png"
                alt="Tela de spread"
              />
              {isOpen && (
                <h3 className="whitespace-nowrap md:text-xl font-medium block">
                  Spreads
                </h3>
              )}
            </button>
          </div>
        </NavLink>

        {/*<NavLink to="/carteira">
            <div
              className={`${
                String(location.pathname) === "/carteira" &&
                "bg-black rounded-lg"
              } duration-200`}
            >
              <button
                className={`${
                  String(location.pathname) === "/carteira"
                    ? "bg-[#D9D9D9] translate-x-1"
                    : "hover:bg-[#D9D9D9]"
                } flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}
              >
                <img
                  className="w-11 h-11"
                  src="/assets/carteira.png"
                  alt="Tela de carteira"
                />
                {isOpen && (
                  <h3 className="whitespace-nowrap text-xl font-medium">
                    Carteira
                  </h3>
                )}
              </button>
            </div>
          </NavLink>

          <div className="flex flex-col gap-2">
            <div
              className={`${
                String(location.pathname) === "/gastos-pessoais" &&
                "bg-black rounded-lg"
              } duration-200`}
            >
              <button
                className={`${
                  String(location.pathname) === "/gastos-pessoais"
                    ? "bg-[#D9D9D9] translate-x-1"
                    : "hover:bg-[#D9D9D9]"
                } flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}

                onClick={() => {
                    setIsOpen(true)
                    setOpenDropDown(!openDropDown)}
                }
              >
                <img
                  className="w-11 h-11"
                  src="/assets/renda.png"
                  alt="Tela de renda variável"
                />
                {isOpen && (
                  <div className="flex flex-1 justify-between">
                    <h3 className="flex- 1 whitespace-nowrap text-xl font-medium">
                      Renda V.
                    </h3>
                    <div className="flex items-center justify-center">
                      <img
                        src="/assets/expand-dropdown.png"
                        alt="Expandir opções"
                        className={`${openDropDown && "rotate-180"} duration-200`}
                      />
                    </div>
                  </div>
                )}
              </button>
            </div>
            {openDropDown && (
              <div className="flex flex-col gap-2">
                <NavLink to={"/acoes"}>
                  <div className="bg-[#D9D9D9] flex items-center justify-center w-[100%] py-2 rounded-lg">
                    <h3 className="flex-1 whitespace-nowrap text-xl font-medium text-center">
                      Lista
                    </h3>
                  </div>
                </NavLink>
                <NavLink to={"/comparador-acoes"}>
                  <div className="bg-[#D9D9D9] flex items-center justify-center w-[100%] py-2 rounded-lg">
                    <h3 className="flex-1 whitespace-nowrap text-xl text-center font-medium">
                      Comparador
                    </h3>
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to={"/financas"}>
            <div
              className={`${
                String(location.pathname) === "/financas" && "bg-black rounded-lg"
              } duration-200`}
            >
              <button
                className={`${
                  String(location.pathname) === "/financas"
                    ? "bg-[#D9D9D9] translate-x-1"
                    : "hover:bg-[#D9D9D9]"
                } flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}
              >
                <img
                  className="w-11 h-11"
                  src="/assets/financas.png"
                  alt="Tela de finanças"
                />
                {isOpen && (
                  <h3 className="whitespace-nowrap text-xl font-medium">
                    Finanças
                  </h3>
                )}
              </button>
            </div>
          </NavLink>

          <NavLink to={"/fiis"}>
            <div
              className={`${
                String(location.pathname) === "/fiis" && "bg-black rounded-lg"
              } duration-200`}
            >
              <button
                className={`${
                  String(location.pathname) === "/fiis"
                    ? "bg-[#D9D9D9] translate-x-1"
                    : "hover:bg-[#D9D9D9]"
                } flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}
              >
                <img
                  className="w-11 h-11"
                  src="/assets/spread.png"
                  alt="Tela de spread"
                />
                {isOpen && (
                  <h3 className="whitespace-nowrap text-xl font-medium">
                    Spreads
                  </h3>
                )}
              </button>
            </div>
          </NavLink>*/}
      </div>

      <div className="flex md:flex-col self-center justify-center md:mb-8 gap-4">
        <div>
          <button
            className={`flex p-1 self-center w-14 rounded-3xl items-center ${
              isDark ? "bg-[#141414]" : "bg-[#EDEEF0]"
            } duration-200`}
            onClick={() => {
              toggleDarkMode();
              setDarkToggle(!darkToggle);
              localStorage.setItem("darkMode", JSON.stringify(!darkToggle));
              setSwitchToggleDarkMode(!switchToggleDarkMode);
            }}
          >
            <div
              className={`flex justify-center items-center h-6 w-6 rounded-full ${
                isDark
                  ? "translate-x-full bg-[#EDEEF0]"
                  : "justify-start bg-[#28292B]"
              } duration-200`}
            >
              <img
                src={`${isDark ? "/assets/moon.png" : "/assets/sun.png"}`}
                alt="Alterar tema"
              />
            </div>
          </button>
        </div>
        <button onClick={handlelogout} className="hover:underline">
          <p className="text-md font-semibold">Log out</p>
        </button>
      </div>
    </div>
  );
};
