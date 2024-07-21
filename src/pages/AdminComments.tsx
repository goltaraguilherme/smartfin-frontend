import { useEffect, useState } from "react";
import api from "../services/api";
import Cookies from "js-cookie";

interface Comment {
  name: string,
  email: string,
  type: string,
  comment: string,
  date: string,
}


export default function AdminComments() {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [commenstList, setCommentsList] = useState<Comment[]>();
  
 
  async function getUserPermission() {
    try {
      const { data } = await api.get("/users")

      //@ts-ignore
      const user = data.filter(item => (item.email == Cookies.get("email") && item.typeUser == "Admin"))

      if(!user)
        setIsAllowed(false);

      const response = await api.get("/utils/list_comments", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "https://smartfin.vercel.app/",
        },
      })
      const comments = response.data;

      setIsAllowed(true);
      setCommentsList(comments);
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
                      className="border-b border-neutral-200 bg-white font-medium dark:border-white/10 dark:bg-body-dark">
                      <tr>
                        <th scope="col" className="px-6 py-4">#</th>
                        <th scope="col" className="px-6 py-4">Nome</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Tipo</th>
                        <th scope="col" className="px-6 py-4">Data</th>
                        <th scope="col" className="px-6 py-4">Comentário</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        commenstList?.map((item, index) => {
                          return (
                            <tr
                              className={`border-b border-neutral-200 ${index % 2 == 0 ? 'bg-black/[0.02] dark:border-white/10' : 'bg-white dark:border-white/10 dark:bg-gray-600' }`}>
                              <td className="whitespace-nowrap px-6 py-4 font-medium">{index+1}</td>
                              <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                              <td className="whitespace-nowrap px-6 py-4">{item.email}</td>
                              <td className="whitespace-nowrap px-6 py-4">{item.type == "sugest" ? "Sugestão" : "Dúvida"}</td>
                              <td className="whitespace-nowrap px-6 py-4">{item.date.split("T")[0]}</td>
                              <td className="whitespace-nowrap px-6 py-4">{item.comment}</td>
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
