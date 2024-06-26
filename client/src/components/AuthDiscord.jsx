import { gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Loading } from './Loading'
const AuthDiscordMutation = gql`
    mutation AuthDiscord($code: String!) {
        authDiscord(code: $code) {
            success
            message
        }
    }
`
export const AuthDiscord = () => {
    const code = new URLSearchParams(window.location.search).get('code')
    const [error, setError] = useState("")
    const [authDiscord, { loading, data }] = useMutation(AuthDiscordMutation, {
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