import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function NovaSenha() {
  const [recoveryToken, setRecoveryToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();
  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    // Envie o recoveryToken e a nova senha para o servidor
    api
      .post(
        `/users/reset_password`,
        { email, token: recoveryToken, password: newPassword }
      )
      .then(() => {
        alert("Senha alterada com sucesso")
        setSuccessMessage("Senha redefinida com sucesso!");
        setErrorMessage("");
        navigate("/");
      })
      .catch((error) => {
        if(error.response.data.err)
          setErrorMessage(error.response.data.err);
        else
          setErrorMessage("Erro ao redefinir a senha. Tente novamente mais tarde.");
      });
  };

  return (
    <main className="flex w-[100%] text-white">
      <div className="hidden md:flex flex-1 justify-center bg-[#13141B] h-[100vh]">
        <div className="flex flex-col justify-center self-center">
          <img className="w-80" src="/smartfinSoluction.png" alt="" />
          <h1 className="text-[30px]">Recuperação de Senha</h1>
        </div>
      </div>

      <div className="flex flex-1 bg-[#201F25] h-[100vh]">
        <div className="flex flex-1 flex-col self-center justify-center">
          {errorMessage && (
            <div
              className="fixed top-0 right-0 mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded shadow"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div
              className="fixed top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded shadow"
              role="alert"
            >
              {successMessage}
            </div>
          )}
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col w-[80%] justify-center self-center needs-validation"
            noValidate
          >
            <h4 className="font-bold text-left pb-4">Redefinir Senha</h4>
            <div className="flex flex-col mb-3">
              <label htmlFor="tokenReset" className="form-label">
                Código enviado por email
              </label>
              <input
                type="text"
                className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md form-control`}
                id="tokenReset"
                value={recoveryToken}
                onChange={(e) => setRecoveryToken(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md form-control`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="newPassword" className="form-label">
                Nova Senha
              </label>
              <input
                type="password"
                className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md form-control`}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                className={`p-2 w-[80%] text-gray-800 focus:ring-opacity-50 rounded-md form-control`}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-[#2D9BFC] w-[30%] mt-4 p-2 font-bold"
                style={{
                  borderRadius: "10px",
              }}>
              Redefinir Senha
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
