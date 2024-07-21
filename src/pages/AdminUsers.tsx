import { useEffect, useState } from "react";
import api from "../services/api";
import Cookies from "js-cookie";

interface User {
  name: string,
  email: string,
  telephone: string,
  corretora: string,
  plan: string,
  dateFinal: string,
}

export default function AdminUsers() {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<User[]>();
  
 
  async function getUserPermission() {
    try {
      const { data } = await api.get("/users")

      //@ts-ignore
      const user = data.filter(item => (item.email == Cookies.get("email") && item.typeUser == "Admin"))

      if(!user)
        setIsAllowed(false);

      setIsAllowed(true);
      setUsersList(data);
    } catch (error) {
      alert(error)
    }
  };

  useEffect(() => {
    getUserPermission();
  }, []);

  return (
    <div className="md:flex md:flex-row flex flex-col h-[100%] w-[100%] gap-4">
      <div className="flex flex-col h-[100%] w-[100%]">
        {
          isAllowed &&
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table
                className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                <thead
                  className="border-b border-neutral-200 font-medium bg-white dark:border-white/10 dark:bg-gray-600">
                  <tr>
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">Nome</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Telefone</th>
                    <th scope="col" className="px-6 py-4">Corretora</th>
                    <th scope="col" className="px-6 py-4">Plano</th>
                    <th scope="col" className="px-6 py-4">Fim da assinatura</th>
                    <th scope="col" className="px-6 py-4">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    usersList?.map((item, index) => {
                      return (
                        <tr
                          className={`border-b border-neutral-200 ${index % 2 == 0 ? 'bg-black/[0.02] dark:border-white/10' : 'bg-white dark:border-white/10 dark:bg-gray-600' }`}>
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{index+1}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.email}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.telephone}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.corretora}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.plan}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.dateFinal}</td>
                          <td className="whitespace-nowrap px-6 py-4">x</td>
                        </tr>
                    )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
}
