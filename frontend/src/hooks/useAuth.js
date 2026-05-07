import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';


// URL base da API
const API_BASE_URL = '/auth';

export function useAuth({
    initialUser = null,
    fetchOnMount = true
} = {}
) {
    // Estado com o usuário
    const [user, setUser] = useState(initialUser)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [checkedAuth, setCheckedAuth] = useState(false);

    // Estado que indica se há uma requisição em andamento
    const [loading, setLoading] = useState({
        login: false,
        perfil: false,
        logout: false,
    });

    // Estado para armazenar mensagem de erro (se houver)
    const [error, setError] = useState({
        login: null,
        perfil: null,
    });

    // Função para fazer login
    const login = useCallback(async (dadosLogin) => {
        setLoading((prev) => ({ ...prev, login: true }));
        setError((prev) => ({ ...prev, login: null }));

        try {
            // Chamada à API
            const data = await apiFetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                body: JSON.stringify(dadosLogin),
                ignoreAuthError: true
            });

            // Se a resposta veio com status de erro
            if (!data.sucesso) {
                setError((prev) => ({ ...prev, login: data.mensagem }))
            }
            else {
                // Atualizando o estado dos dados
                setUser(data.dados.usuario)
                setIsAuthenticated(true)
            }
        } catch (err) {
            // Caso dê erro de rede, CORS, servidor, etc, guardamos uma mensagem amigável em `error`
            if (err.message === 'Sessão expirada') return;

            setError((prev) => ({
                ...prev,
                login: 'Erro ao solicitar login, tente novamente mais tarde.'
            }));

        } finally {
            // Independente de sucesso ou erro, o loading termina aqui
            setLoading((prev) => ({ ...prev, login: false }));
        }
    }, []);

    // Função para obter o perfil do usuário logado
    const perfil = useCallback(async () => {
        setLoading((prev) => ({ ...prev, perfil: true }));
        setError((prev) => ({ ...prev, perfil: null }));

        try {
            // Chamada à API
            const data = await apiFetch(`${API_BASE_URL}/perfil`, {
                method: 'GET',
                credentials: 'include'
            });

            // Se a resposta veio com status de erro
            if (!data.sucesso) {
                setError((prev) => ({ ...prev, perfil: data.mensagem }))
                setUser(null)
            }
            else {
                // Atualizando o estado do usuário
                setUser(data.dados.usuario)
                setIsAuthenticated(true)
            }

        } catch (err) {
            // Caso dê erro de rede, CORS, servidor, etc, guardamos uma mensagem amigável em `error`
            setError((prev) => ({ ...prev, perfil: 'Erro ao solicitar perfil, tente novamente mais tarde.' }))

        } finally {
            // Independente de sucesso ou erro, o loading termina aqui
            setLoading((prev) => ({ ...prev, perfil: false }));
            setCheckedAuth(true);
        }
    }, []);

    // Função para fazer logout
    const logout = async () => {
        setLoading((prev) => ({ ...prev, logout: true }));

        try {
            await apiFetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            // Limpando estados locais
            setUser(null);
            setIsAuthenticated(false)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, logout: false }));
        }
    };

    // Obtendo o perfil
    useEffect(() => {
        if (!fetchOnMount) return;
        perfil();
    }, [fetchOnMount, perfil]);

    return {
        user,
        isAuthenticated,
        checkedAuth,
        loading,
        setLoading,
        error,
        login,
        perfil,
        logout,
    };
}