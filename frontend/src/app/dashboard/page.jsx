"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <main className="p-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          Dashboard Alexandria
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2"
        >
          Sair
        </button>
      </div>

      <div className="mt-10">
        <p>Usuário:</p>
        <h2 className="text-xl">{user?.name}</h2>
        <p>{user?.email}</p>
        <p>{user?.role}</p>
      </div>
    </main>
  );
}