import { createContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';  
import { GET_USER } from '../utils/Queries';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { loading, error, data } = useQuery(GET_USER);
    
    useEffect(() => {
        if (!loading && !error && data) {
            setUser(data);
        }
    }, [loading, error, data]);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};
