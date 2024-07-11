import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Loading } from '../Miscellaneous/Loading'
import { AUTH_DISCORD } from '../../utils/Queries'

export const AuthDiscord = () => {
    const code = new URLSearchParams(window.location.search).get('code')
    const [error, setError] = useState("")
    const [authDiscord, { loading, data }] = useMutation(AUTH_DISCORD, {
        onError: (error) => {
            setError(error.message)
        },
        onCompleted: (data) => {
            if (data.authDiscord.success) {
                window.location.href = '/'
            }
        }
    })
    useEffect(() => {
        if (code) {
            authDiscord({
                variables: {
                    code
                }
            })
        }
    }, [code])
    if (loading) return <Loading />
    
    if (error) return (
        <div className='container h-screen mx-auto'></div>
    )
}