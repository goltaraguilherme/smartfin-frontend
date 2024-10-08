import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Cadastro() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [corretora, setCorretora] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password || !telephone || !corretora || !plan) {
      setErrorMessage("Preencha todos os campos!");
      return;
    }

    if(password.length < 6){
      setErrorMessage("A senha deve conter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)
    try {
      const { data } = await api.post("/users/register", {
        email,
        password,
        name,
        telephone,
        corretora,
        plan,
      },
      { 
        headers: { "Access-Control-Allow-Origin": "https://smartfin.vercel.app/" 
      }})

      const { token } = data;

      if (token) {
        alert("Usuário cadastrado com sucesso!")
        navigate("/");
      }

    } catch (error) {
      //@ts-ignore
      setErrorMessage(error.response.data.err)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className="flex-1 w-[100wh] h-[100vh] text-white">
        <div className="flex flex-row">
          <div className="hidden md:flex flex-1 justify-center bg-[#13141B] h-[100vh]">
            <div className="self-center">
              <img className="" src="/smartfinSoluction.png" alt="" />
              <h1 className="text-[30px]">Cadastre-se já</h1>
            </div>
          </div>

          <div className="flex flex-1 bg-[#201F25] h-[100vh]">
            <div className="flex flex-1 justify-center self-center">
              {errorMessage && (
                <div
                  className="fixed top-0 right-0 mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded shadow"
                  role="alert"
                >
                  {errorMessage}
                </div>
              )}
              <form
                onSubmit={handleSignUp}
                className="w-[80%] needs-validation"
                noValidate
              >
                <h4 className="font-bold text-left pb-4">
                  Entre ou crie sua conta
                </h4>
                <div className="flex-col mb-3">
                  <label htmlFor="name" className="form-label">
                    Nome Completo
                  </label>
                  <br />
                  <input
                    type="text"
                    className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md`}
                    id="name"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required = {true}
                  />
                </div>
                <div className="flex-col mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <br />
                  <input
                    type="email"
                    className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md`}
                    id="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required={true}
                  />
                </div>
                <div className="flex mb-3 justify-between w-[80%]">
                  <div className="flex-col">
                    <label htmlFor="tel" className="form-label">
                      Telefone
                    </label>
                    <br />
                    <input
                      type="tel"
                      className={`p-2 text-gray-800 focus:ring-opacity-50 rounded-md`}
                      id="tel"
                      pattern="([0-9]{2}) [0-9]{5}-[0-9]{4}"
                      placeholder="(xx) xxxxx-xxxx"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      required={true}
                    />
                  </div>

                  <div className="flex-col">
                    <label htmlFor="corretora" className="form-label">
                      Corretora
                    </label>
                    <br />
                    <input
                      type="text"
                      className={`p-2 text-gray-800 focus:ring-opacity-50 rounded-md`}
                      id="corretora"
                      placeholder="Sua corretora"
                      value={corretora}
                      onChange={(e) => setCorretora(e.target.value)}
                      required={true}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <br />
                  <input
                    type="password"
                    className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md`}
                    id="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    required={true}
                  />
                </div>

                <div className="flex mt-3 w-[80%]">
                  <div className="flex flex-1 gap-3 font-semibold">
                    <input 
                      className="cursor-pointer"
                      type="radio" 
                      id="semestral" 
                      name="semestral"  
                      checked={plan === "semestral" ? true : false} 
                      onClick={() => setPlan("semestral")} />
                    <label htmlFor="semestral">
                      Plano Semestral
                    </label>
                  </div>

                  <div className="flex flex-1 gap-3 font-semibold">
                    <input 
                      className="cursor-pointer"
                      type="radio" 
                      id="anual" 
                      name="anual" 
                      checked={plan === "anual" ? true : false} 
                      onClick={() => setPlan("anual")} />
                    <label htmlFor="anual">
                      Plano Anual
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#2D9BFC] w-[30%] mt-4 p-2 font-bold"
                  style={{
                    borderRadius: "10px",
                  }}
                >
                  {!isLoading ? "Criar conta" : "Carregando..."}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
