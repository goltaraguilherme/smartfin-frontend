import { useEffect, useState } from "react";
import api from "../services/api";
import Cookies from "js-cookie";

interface User {
  _id: string,
  name: string,
  email: string,
  telephone: string,
  corretora: string,
  plan: string,
  dateFinal: Date,
}

export default function AdminUsers() {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<User[]>();
  const [isEditItem, setIsEditItem] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<User>();
  const [plan, setPlan] = useState<string>();
  const [dateFinal, setDateFinal] = useState<string>();

 
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

  async function editUser() {
    try {
      const { data } = await api.post("/users/edit_user", {
        email: editItem?.email, plan, dateFinal
      })

      if(data.modifiedCount == 1)
        alert("Editado com sucesso.")
    } catch (error) {
      alert(error)
    }
  };

  useEffect(() => {
    getUserPermission();
  }, []);

  return (
    <div className="md:flex md:flex-row flex flex-col h-[100vh] w-[100%] gap-4">
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
                    <th scope="col" className="px-6 py-4"></th>
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
                          <td className="whitespace-nowrap px-6 py-4">{new Date(item.dateFinal).toLocaleDateString()}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button 
                              onClick={() => {
                                setPlan(item.plan)
                                setIsEditItem(true)
                                setEditItem(item)
                              }}
                              className="hover:underline">
                              Edit  
                            </button>
                          </td>
                        </tr>
                    )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        }
      </div>

      {isEditItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg animate__animated animate__fadeIn">
            <h2 className="text-2xl font-semibold mb-4">Editar {editItem?.name}</h2>
            <div className="flex mt-3">
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
                <div className="flex flex-col mt-3">
                  <label
                    className="dark:text-[#EDEEF0]"
                    htmlFor="#inputDate"
                  >
                    Data final
                  </label>
                  <input
                    className="p-2 font-bold text-sm border border-gray-500 rounded-md bg-transparent dark:text-[#EDEEF0]"
                    id="inputDate"
                    type="date"
                    value={dateFinal}
                    onChange={(e) => {
                      setDateFinal(e.target.value);
                    }}
                  />
                </div>

                <div className="flex flex-1 gap-3 justify-between">
                  <button
                    className="flex-1 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      editUser();
                      setIsEditItem(false);
                    }}
                  >
                    Salvar
                  </button>

                  <button
                    className="flex-1 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      setIsEditItem(false)
                      setDateFinal("")
                    }}
                  >
                    Fechar
                  </button>
                </div>

          </div>
        </div>
      )}
    </div>
  );
}
