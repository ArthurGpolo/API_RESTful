"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const {
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    refetchUsuarios,
  } = useUsers({ fetchOnMount: true });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="p-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Dashboard Alexandria</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 rounded-xl text-white px-4 py-2"
        >
          Sair
        </button>
      </div>

      <div className="mt-10">
        <p>Usuário Logado:</p>
        <h2 className="text-xl">{user?.name}</h2>
        <p>{user?.email}</p>
        <p>{user?.role}</p>
      </div>

      <div>
        <h1 className="mt-4 font-bold">Lista de usuários cadastrados:</h1>

        {errorUsuarios.fetch && (
          <p style={{ color: "red" }}>{errorUsuarios.fetch}</p>
        )}

        <ul>
          {(usuarios || []).map((u, index) => (
            <li key={index}>
              {u.name} {u.email} {u.role}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="bg-indigo-400 p-2 rounded-xl text-white mt-2"
        onClick={refetchUsuarios}
      >
        Recarregar
      </button>
    </main>
  );
}