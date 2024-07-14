import { useState } from "react";
import axios from "axios";

export default function RecuperacaoSenha() {
  const [email, setEmail] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Por favor, insira seu email!");
      return;
    }

    axios
      .post("https://smartfinsoluction-backend.vercel.app/recover-password", {
        email,
      })
      .then((response) => {
        const { recoveryToken } = response.data;
        console.log(recoveryToken);
        setShowSuccessMessage(true);
        setErrorMessage("");
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Erro ao enviar email de recuperação de senha.");
      });
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <main className="flex w-[100%] text-white">
        <div className="hidden md:flex flex-1 justify-center bg-[#13141B] h-[100vh]">
          <div className="self-center">
            <img className="" src="/smartfinSoluction.png" alt="" />
            <h1 className="text-[30px]">Nova senha</h1>
          </div>
        </div>

        <div className="flex flex-1 bg-[#201F25] h-[100vh]">
          <div className="flex flex-1 justify-center self-center">
            {showSuccessMessage && (
              <div
                className="fixed top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded shadow"
                role="alert"
              >
                Email de recuperação enviado com sucesso!
              </div>
            )}
            {errorMessage && (
              <div
                className="fixed top-0 right-0 mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded shadow"
                role="alert"
              >
                {errorMessage}
              </div>
            )}
            <form
              onSubmit={handleFormSubmit}
              className="w-[80%] needs-validation"
              noValidate
            >
              <h4 className="font-bold text-left pb-4">Recuperação de Senha</h4>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <br />
                <input
                  type="email"
                  className={`p-2 w-[80%] form-control ${
                    email ? "border-green-500" : "border-red-500"
                  } focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md`}
                  id="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#2D9BFC] w-[50%] mt-4 p-2 font-bold"
                style={{
                  borderRadius: "10px",
                }}
              >
                Enviar Email de Recuperação
              </button>
            </form>
          </div>
        </div>
      </main>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg animate__animated animate__fadeIn">
            <h2 className="text-2xl font-semibold mb-4">Verifique seu Email</h2>
            <p>
              Um email de recuperação foi enviado para o endereço fornecido. Por
              favor, verifique seu email para validar a nova senha.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
