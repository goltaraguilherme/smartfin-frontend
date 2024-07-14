import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../login.module.css'; // Importe o arquivo CSS de estilos

export default function NovaSenha() {
  const { recoveryToken } = useParams(); // Obtém o recoveryToken da URL
  console.log(recoveryToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate()
  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    // Envie o recoveryToken e a nova senha para o servidor
    axios
      .put(`https://smartfinsoluction-backend.vercel.app/reset-password/${recoveryToken}`, { newPassword })
      .then(() => {
        setSuccessMessage('Senha redefinida com sucesso!');
        setErrorMessage('');
        navigate('/')
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Erro ao redefinir a senha. Tente novamente mais tarde.');
      });
  };

  return (

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
        <h4 className="font-bold text-left pb-4">Redefinir Senha</h4>
        {errorMessage && (
          <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded shadow" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow" role="alert">
            {successMessage}
          </div>
        )}
            <form onSubmit={handleFormSubmit} className="needs-validation" noValidate>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Nova Senha</label>
                <input
                  type="password"
                  className={`form-control`}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Nova Senha</label>
                <input
                  type="password"
                  className={`form-control`}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Redefinir Senha</button>
            </form>
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>  

  </main>
  );
}