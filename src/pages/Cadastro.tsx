import { useState } from 'react';
import axios from 'axios';
import styles from '../login.module.css';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  password: string;
  // Adicione outras propriedades conforme necessário
}

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage('Preencha todos os campos!');
      return;
    }

    // Verificar se o usuário já existe
    axios
      .get<User[]>('https://smartfinsoluction-backend.vercel.app/users/all')
      .then(response => {
        const users = response.data;
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
          setErrorMessage('Usuário já existe!');
        } else {
          // Prosseguir com o cadastro
          const newUser = {
            name: name,
            email: email,
            password: password
          };

          axios
            .post('https://smartfinsoluction-backend.vercel.app/signup', newUser)
            .then(response => {
              console.log(response.data); // Exibe a resposta do servidor
              setShowSuccessMessage(true); // Mostra o aviso de sucesso
              setErrorMessage(''); // Limpa o erro, se houver

              navigate('/');
            })
            .catch(error => {
              console.error(error);
              // Lógica de tratamento de erro
            });
        }
      })
      .catch(error => {
        console.error(error);
        // Lógica de tratamento de erro
      });
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
                  <h1 className='pt-5 text-[30px]'>Cadastre-se já</h1>
                </div>
              </div>
            </div>

            <div className="col-lg-6 bg-[#201F25] h-[100vh]">
              <div className="container">
                <div className={styles.centralizar}>
                  <div className="formulario">
                    <h4 className="font-bold text-left pb-4">Entre ou crie sua conta</h4>
                    {showSuccessMessage && (
                      <div className="fixed top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded shadow" role="alert">
                        Cadastro realizado com sucesso!
                      </div>
                    )}
                    {errorMessage && (
                      <div className="fixed top-0 right-0 mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded shadow" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="needs-validation" noValidate>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome Completo</label>
                        <input type="text" className={`form-control ${name ? 'border-green-500' : 'border-red-500'} focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md`} id="name" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
                        {!name && <p className="text-red-500 text-sm mt-1">Por favor, insira seu nome completo.</p>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className={`form-control ${email ? 'border-green-500' : 'border-red-500'} focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md`} id="email" placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)} required />
                        {!email && <p className="text-red-500 text-sm mt-1">Por favor, insira um endereço de email válido.</p>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" className={`form-control ${password ? 'border-green-500' : 'border-red-500'} focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md`} id="password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
                        {!password && <p className="text-red-500 text-sm mt-1">Por favor, insira uma senha.</p>}
                      </div>
                      <button type="submit" className="btn btn-primary">Criar conta</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
