import { useParams } from "react-router-dom"
import {gql, useMutation} from "@apollo/client"
import {useContext, useEffect} from "react"
import {UserContext} from "../context/UserContext"
import {useState} from "react"
import { Loading } from "./Loading"
const verifyToken = gql`
    mutation verifyEmail($token: String){
        verifyEmail(token: $token){
            success
        }
    }
`
export const VerifyEmail = () => {
    const {user} = useContext(UserContext)
    const {token} = useParams()
    const [error, setError] = useState(null)
    useEffect(() => {
        verifyEmail()
    }, )
    const [verifyEmail, {loading}] = useMutation(verifyToken, {
        variables: {
            token
        },
        onCompleted: data => {
            if(data.verifyEmail.success){
                window.location.href = "/"
            }
        },
        onError: err => {
            setError(err.message)
        }
    })
    if(loading) return <Loading />
    return (
        <div className="container mx-auto p-4 my-4">
            {error && <div className="bg-red-500 text-white p-2 my-2">{error}</div>}
        </div>
    )
}