import { useApiRequest, HttpRequestProps } from '../hooks/useHttpRequest';

export const fetchUser = ({
    body,
    jwt,
}: Pick<HttpRequestProps, 'body' | 'jwt'>) => {
    return useApiRequest<{
        id: number,
        type: string
    }>({
        method: 'GET',
        path: 'hello',
        body,
        jwt,
        userType: 'default_user',
    })
};