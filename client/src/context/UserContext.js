import {createContext, useReducer} from 'react'
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Loading } from '../components/Loading';
import { useEffect } from 'react';
export const UserContext = createContext()
const getUserQuery = gql`
    query{
        getUser {
            username,
            createdAt,
            email,
            admin
            profilePicture
        }
    }
`
const userReducer = (state, action) => {
    return { ...state, user: action.payload };
};

export const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, {
        user: null
    })
    const { loading, error, data } = useQuery(getUserQuery);
    useEffect(() => {
        if (!loading && !error && data) {
          dispatch({ type: 'SET_USER', payload: data });
        }
    }, [loading, error, data]);
    if (loading) {
        return <Loading />;
    }
    return (
        <UserContext.Provider value={{ user: state.user }}>
          {children}
        </UserContext.Provider>
    );
}