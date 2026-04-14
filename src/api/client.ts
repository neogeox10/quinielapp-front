import { closeSession } from '../util/close-session';

interface ApiOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    body?: any;
    params?: Record<string, string>;
    headers?: [string, string][];
    abortController?: AbortController;
}

export class RespuestaError extends Error {
    response: any;
    constructor(data: any) {
        super(data.statusText || 'Error en la petición');
        this.name = 'RespuestaError';
        this.response = data;
    }
}

const UNAUTHORIZED = 401;

export const apiCall = async ({
    method,
    path,
    body,
    params,
    headers = [],
    abortController = new AbortController(),
}: ApiOptions) => {

    // 1. Preparar Cabeceros
    const headerMap = new Headers([
        ['Content-Type', 'application/json'],
    ]);

    const token = localStorage.getItem('token');
    if (token) {
        headerMap.set('Authorization', `Bearer ${token}`);
    }

    headers.forEach(([key, value]) => headerMap.set(key, value));

    // 2. Construir URL
    const baseURL = import.meta.env.VITE_API_URL;
    const url = new URL(`${baseURL}${path}`);
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    // 3. Configurar Petición
    const config: RequestInit = {
        method,
        headers: headerMap,
        signal: abortController.signal,
    };

    if (method !== 'GET' && body) {
        config.body = JSON.stringify(body);
    }

    try {
        const respuesta = await fetch(url.toString(), config);

        // 4. Procesar Cuerpo (Manejo de posibles errores de parseo JSON)
        let data = null;
        const contentType = respuesta.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await respuesta.json();
        }

        const resultado = {
            status: respuesta.status,
            statusText: respuesta.statusText,
            headers: respuesta.headers,
            data,
        };

        if (respuesta.status === UNAUTHORIZED) {
            if (!['/auth/login', '/auth/google'].includes(path)) {
                closeSession();
            }
            return resultado;
        }

        if (!respuesta.ok) {
            throw new RespuestaError(resultado);
        }

        return resultado;
    } catch (error) {
        if (error instanceof RespuestaError) throw error;
        // Manejo de errores de red o aborto
        throw new Error(error instanceof Error ? error.message : 'Error de red');
    }
};