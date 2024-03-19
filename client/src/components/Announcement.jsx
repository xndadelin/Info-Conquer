import {gql, useQuery} from '@apollo/client'
import { useParams } from 'react-router-dom'
import { Loading } from './Loading'
import { NotFound } from '../pages/NotFound'
const getAnnouncement = gql`
    query getAnnouncement($title: String) {
        getAnnouncement(title: $title) {
            title
            content
        }
    }
`
export const Announcement = () => {
    const {title} = useParams()
    const {data, error, loading} = useQuery(getAnnouncement, {
        variables: {title}
    })
    if(loading) return <Loading/>
    if(error) return <NotFound/>
    return (
        <div className="container mx-auto py-10">
            <p className="text-3xl font-bold mb-5">{data.getAnnouncement.title}</p>
            <div dangerouslySetInnerHTML={{__html: data.getAnnouncement.content}}></div>
        </div>
    )
}