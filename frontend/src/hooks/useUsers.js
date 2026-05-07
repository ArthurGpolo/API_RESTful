import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';

export function useUsers({
  usuariosIniciais = [],
  fetchOnMount = false,
} = {}) {

  const [usuarios, setUsuarios] = useState(usuariosIniciais);

  const [loadingUsuarios, setLoading] = useState({
    fetch: false,
  });

  const [errorUsuarios, setError] = useState({
    fetch: null,
  });

  const fetchUsuarios = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setError((prev) => ({ ...prev, fetch: null }));

    try {
      const response = await api.get('/users');

      const data = response.data;

      const usuariosData =
        data?.usuarios ||
        data?.data?.usuarios ||
        data?.data ||
        [];

      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);

    } catch (err) {
      console.error(err);

      setError((prev) => ({
        ...prev,
        fetch: 'Erro ao buscar usuários, tente novamente mais tarde.',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) {
      fetchUsuarios();
    }
  }, [fetchOnMount, fetchUsuarios]);

  return {
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    refetchUsuarios: fetchUsuarios,
  };
}