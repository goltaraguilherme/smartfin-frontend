import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserContext } from "../context/UserContext";
import SplashScreen from "../components/SplashScreen";
import api from "../services/api";

interface LoginProps {
  handleLogin: () => void;
}

export default function Login({ handleLogin }: LoginProps) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  async function handleSubmit2(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      //@ts-ignore
      const { data } = await api.post(
        "/users/authenticate",
        { email, password },
        { headers: { "Access-Control-Allow-Origin": "https://smartfin.vercel.app/" } }
      );

      const { token, name } = data;

      if (token) {
        const expiresInHours = 24;
        const expirationDate = new Date();
        expirationDate.setTime(
          expirationDate.getTime() + expiresInHours * 60 * 60 * 1000
        );

        Cookies.set("token", token, {
          expires: expirationDate,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("token", token);
        Cookies.set("name", name);
        Cookies.set("email", email);
        setUser({ name, email });

        setShowSplash(true);
        setTimeout(() => {
          navigate("/", { replace: true });
          handleLogin();
        }, 2000);
      }
    } catch (error) {
      //@ts-ignore
      setError(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const token = Cookies.get("token");
    const tokenLS = localStorage.getItem("token");
    if (token && tokenLS) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <main className="w-[100%] text-white">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="container-fluid">
          <div className="flex flex-1">
            <div className="hidden md:flex justify-center flex-1 bg-[#13141B] h-[100vh] w-[100%]">
              <div className="flex self-center justify-center">
                <img className="" src="/logo.png" alt="" />
              </div>
            </div>

            <div className="flex flex-1 self-center justify-center bg-[#201F25] h-[100vh] md:w-[50vh]">
              <div className="flex flex-col self-center justify-center w-[100%]">
                {error && (
                  <div className="fixed top-0 right-0 mt-4 mr-4">
                    <div
                      className="bg-red-500 text-white px-4 py-2 rounded shadow"
                      role="alert"
                    >
                      {error}
                    </div>
                  </div>
                )}
                <form className="self-center w-[80%]" onSubmit={handleSubmit2}>
                  <h4 className="font-bold text-left pb-4">
                    Entre ou crie sua conta
                  </h4>
                  <label htmlFor="email" className="pb-2">
                    Email
                  </label>
                  <br />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      borderRadius: "10px",
                    }}
                    className="w-[80%] p-2 bg-transparent border border-white"
                    type="email"
                    id="email"
                    placeholder="Seu email"
                    required={true}
                  />

                  <br />
                  <br />

                  <label className="pb-2" htmlFor="name">
                    Senha
                  </label>
                  <br />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      borderRadius: "10px",
                    }}
                    className="w-[80%] p-2 bg-transparent border border-white"
                    type="password"
                    id="celular"
                    placeholder="Sua senha"
                    required={true}
                  />
                  <br />
                  <br />
                  <button
                    type="submit"
                    className="bg-[#2D9BFC] w-[50%] p-2 font-bold"
                    style={{
                      borderRadius: "10px",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Carregando..." : "Entrar"}
                  </button>

                  <div className="pt-4">
                    <p>
                      <Link className="text-blue-500" to={"/esqueci"}>
                        Esqueci a senha
                      </Link>
                    </p>

                    <p>
                      Ainda não tem uma conta?{" "}
                      <Link className="text-blue-500" to={"/cadastro"}>
                        Registre-se
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
