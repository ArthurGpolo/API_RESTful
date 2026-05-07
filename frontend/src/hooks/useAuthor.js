import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api'

export function useAuthor({
    authoresIniciais = [],
    fetchOnMount = false,
} = {}) {

    const [authores, setAuthores] = useState(authoresIniciais);

    const [loadingAuthores, setLoading] = useState({
        fetch: false,
    });

    const [errorAuthores, setError] = useState({
        fetch: null,
    });

    const fetchAuthores = useCallback(async () => {
        setLoading((prev) => ({ ...prev, fetch: true }));
        setError((prev) => ({ ...prev, fetch: null }));

        try {
            const response = await api.get('/authors')

            const data = response.data;

            const authoresData =
                data?.authores ||
                data?.data?.authores ||
                data?.data ||
                [];

            setAuthores(Array.isArray(authoresData) ? authoresData : []);

        } catch (err) {
            console.error(err)

            setError((prev) => ({
                ...prev,
                fetch: 'Erro ao buscar autores, tente novamente mais tarde.',
            }));
        } finally {
            setLoading((prev) => ({ ...prev, fetch: false }));
        }
    }, []);

    useEffect(() => {
        if (fetchOnMount) {
            fetchAuthores();
        }
    }, [fetchOnMount,fetchAuthores]);

    return {
        authores,
        loadingAuthores,
        errorAuthores,
        refetchAuthores: fetchAuthores,
    };
}