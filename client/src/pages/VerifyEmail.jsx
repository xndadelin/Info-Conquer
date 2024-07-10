import { useParams } from "react-router-dom"
import { gql, useMutation } from "@apollo/client"
import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { useState } from "react"
import { Loading } from "../components/Loading"
import { VERIFY_TOKEN } from "../utils/Queries"

export const VerifyEmail = () => {
    const { user } = useContext(UserContext)
    const { token } = useParams()
    const [error, setError] = useState(null)
    useEffect(() => {
        verifyEmail()
    }, [])
    const [verifyEmail, { loading }] = useMutation(VERIFY_TOKEN, {
        variables: {
            token
        },
        onCompleted: data => {
            if (data.verifyEmail.success) {
                window.location.href = "/"
            }
        },
        onError: err => {
            setError(err.message)
        }
    })
    if (loading) return <Loading />
    if (user.getUser) window.location.href = '/'

    return (
        <main className="container mx-auto p-4 my-4 h-screen">
            {error && <div className="bg-red-500 text-white p-2 my-2">{error}</div>}
        </main>
    )
}