import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';

const API_BASE_URL = '/auth';

export function useAuth({
  initialUser = null,
  fetchOnMount = true,
} = {}) {

  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const [loading, setLoading] = useState({
    login: false,
    perfil: false,
    logout: false,
  });

  const [error, setError] = useState({
    login: null,
    perfil: null,
  });

  // LOGIN
  const login = useCallback(async (dadosLogin) => {
    setLoading((prev) => ({ ...prev, login: true }));
    setError((prev) => ({ ...prev, login: null }));

    try {
      const data = await api.post(`${API_BASE_URL}/login`, dadosLogin);

      if (!data?.sucesso) {
        setError((prev) => ({ ...prev, login: data?.mensagem || 'Erro no login' }));
        setIsAuthenticated(false);
        return;
      }

      setUser(data.dados.usuario);
      setIsAuthenticated(true);
    } catch (err) {
      if (err?.message === 'Sessão expirada') return;

      setError((prev) => ({
        ...prev,
        login: 'Erro ao solicitar login, tente novamente mais tarde.',
      }));

      setIsAuthenticated(false);
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  }, []);

  // PERFIL
  const perfil = useCallback(async () => {
    setLoading((prev) => ({ ...prev, perfil: true }));
    setError((prev) => ({ ...prev, perfil: null }));

    try {
      const data = await api.get(`${API_BASE_URL}/perfil`);

      if (!data?.sucesso) {
        setUser(null);
        setIsAuthenticated(false);

        setError((prev) => ({
          ...prev,
          perfil: data?.mensagem || 'Erro ao carregar perfil',
        }));

        return;
      }

      setUser(data.dados.usuario);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);

      setError((prev) => ({
        ...prev,
        perfil: 'Erro ao solicitar perfil, tente novamente mais tarde.',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, perfil: false }));
      setCheckedAuth(true);
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setLoading((prev) => ({ ...prev, logout: true }));

    try {
      await api.post(`${API_BASE_URL}/logout`);

      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  }, []);

  // AUTO FETCH PERFIL
  useEffect(() => {
    if (!fetchOnMount) {
      setCheckedAuth(true);
      return;
    }

    perfil();
  }, [fetchOnMount, perfil]);

  return {
    user,
    isAuthenticated,
    checkedAuth,
    loading,
    error,
    login,
    perfil,
    logout,
  };
}