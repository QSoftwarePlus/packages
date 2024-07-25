import { xUserTypeHeader } from 'bff';
import { UserType } from 'database';
import React, { useEffect, useState } from 'react';
import { NEXT_PUBLIC_API_URL } from '@env';

export interface HttpRequestProps {
    url: string,
    userType?: UserType,
    method: string,
    body?: any
    jwt?: string
}

const publicApiUrl = NEXT_PUBLIC_API_URL;

export const useApiRequest = <T extends Object>({ method, body, jwt, userType, path }: Pick<HttpRequestProps, 'body' | 'jwt' | 'method' | 'userType'> & {
    path: string
}) => {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(jwt && { Authorization: `Bearer ${jwt}` }),
        ...(userType && { [`${xUserTypeHeader}`]: userType }),
    };

    const url = `${publicApiUrl}/${path}`;

    console.log('process.env.NEXT_PUBLIC_API_URL', NEXT_PUBLIC_API_URL);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                });
                const json = await res.json();
                setResponse(json);
            } catch (error) {
                setError(error as any);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return { response, error, loading };
}