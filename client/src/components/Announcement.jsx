import {gql, useQuery} from '@apollo/client'
import { Link, useParams } from 'react-router-dom'
import { Loading } from './Loading'
import { NotFound } from '../pages/NotFound'
const getAnnouncement = gql`
    query getAnnouncement($title: String) {
        getAnnouncement(title: $title) {
            title
            content
            createdBy
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
            <p className="text-3xl font-bold">{data.getAnnouncement.title}</p>
            <p className="text-slate">Announcement by 
                <Link to={`/profile/${data.getAnnouncement.createdBy}`} className="text-default-500"> {data.getAnnouncement.createdBy}</Link>
            </p>
            <div className='mt-5' dangerouslySetInnerHTML={{__html: data.getAnnouncement.content}}></div>
        </div>
    )
}