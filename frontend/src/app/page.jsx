"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 👇 login precisa retornar { user, token }
      const res = await login(form.email, form.password);

      const user = res?.user;

      console.log("USER LOGADO:", user);

      if (!user) {
        throw new Error("Usuário não retornado pelo login");
      }

      // ✅ REDIRECIONAMENTO CORRETO (baseado na sua estrutura de pastas)
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/usuarios");
      }

    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Email ou senha inválidos"
          : "Erro no servidor");

      console.log("FRONT ERROR:", err.response?.data || err);

      alert(message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          Alexandria
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 mb-4"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-black text-white p-2">
          Entrar
        </button>
      </form>
    </main>
  );
}