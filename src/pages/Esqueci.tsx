import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../login.module.css';
import Cookies from 'js-cookie';

export default function RecuperacaoSenha() {
  const [email, setEmail] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Por favor, insira seu email!');
      return;
    }

    axios
      .post('https://smartfinsoluction-backend.vercel.app/recover-password', { email })
      .then((response) => {
        const { recoveryToken } = response.data;
        console.log(recoveryToken);
        setShowSuccessMessage(true);
        setErrorMessage('');
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Erro ao enviar email de recuperação de senha.');
      });
  };

  const closeModal = () => {
    setIsModalVisible(false);
  
  };

  return (
    <>
      <main className="w-[100%] text-white">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 bg-[#13141B] h-[100vh]">
              <div className="container">
                <div className=' h-100 pt-[50%]'>
                  <img className='w-80' src="/smartfinSoluction.png" alt="" />
                  <h1 className='pt-5 text-[30px]'>Recuperação de Senha</h1>
                </div>
              </div>
            </div>
            <div className="col-lg-6 bg-[#201F25] h-[100vh]">
              <div className="container">
                <div className={styles.centralizar}>
                  <div className="formulario">
                    <h4 className="font-bold text-left pb-4">Recuperação de Senha</h4>
                    {showSuccessMessage && (
                      <div className="fixed top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded shadow" role="alert">
                        Email de recuperação enviado com sucesso!
                      </div>
                    )}
                    {errorMessage && (
                      <div className="fixed top-0 right-0 mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded shadow" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="needs-validation" noValidate>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className={`form-control ${email ? 'border-green-500' : 'border-red-500'} focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md`} id="email" placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)} required />
                        {!email && <p className="text-red-500 text-sm mt-1">Por favor, insira um endereço de email válido.</p>}
                      </div>
                      <button type="submit" className="btn btn-primary">Enviar Email de Recuperação</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    
      {isModalVisible && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg animate__animated animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4">Verifique seu Email</h2>
      <p>Um email de recuperação foi enviado para o endereço fornecido. Por favor, verifique seu email para validar a nova senha.</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={closeModal}>Fechar</button>
    </div>
  </div>
)}

    </>

  );
}