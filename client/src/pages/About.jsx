import { Link } from 'react-router-dom';
export const About = () => {
    return (
        <div className="container mx-auto p-4 my-5">
             <div className="flex flex-col gap-5 self-start mt-10 mb-20">
                <div className="text-5xl text-white font-extrabold">ℹ️ About</div>
                <p className="text-2xl text-white">
                    Here you can find information about the platform.
                </p>
            </div>
            <p className="text-lg">
                <b>InfoConquer </b>
                <ul className='list-disc ml-8'>
                    <li>Platform for competitive programming enthusiasts</li>
                    <li>Practice problems, participate in contests, read articles, and publish your own problems and articles</li>
                    <li>Code judger tests your code based on test cases and provides explicit feedback</li>
                    <li>Code feedback feature utilizes OpenAI API to give feedback on code optimization, quality, etc.</li>
                    <li>Insights feature provides information on the problem being solved (leaderboard, success rate, etc.)</li>
                    <li>Constantly evolving with more features to be added soon</li>
                    <li>Authentication system based on JWT tokens</li>
                    <li>Platform secured with HTTPS</li>
                    <li>Problems divided into categories, subcategories, and tagged with difficulty levels</li>
                    <li>Ability to publish your own problems and articles (permission required)</li>
                    <li>Announcement feature for admins</li>
                    <li>Code editor based on Monaco Editor</li>
                    <li>Code judger based on Docker containers for security</li>
                    <li>Built using MERN stack and GraphQL</li>
                </ul>
                <br/>
                <b>Features:</b>
                <ul className="list-disc ml-8">
                    <li>Contests</li>
                    <li>Problems</li>
                    <li>Articles and announcements</li>
                    <li>Code judge with docker</li>
                    <li>Code feedback from OpenAI API</li>
                    <li>Insights</li>
                    <li>More features . . . I think</li>
                </ul>
                <br/>
                <b>Technologies:</b>
                <ul className="list-disc ml-8">
                    <li>Javascript & ReactJS</li>
                    <li>CSS & Tailwind & NextUI</li>
                    <li>Node.js & ExpressJS</li>
                    <li>MongoDB & GraphQL & Apollo Server</li>
                    <li>Git</li>
                    <li>Docker</li>
                </ul>
                <br/>
                <b>Contributors:</b>
                <ul className="list-disc ml-8">
                    <li>Adi</li>
                </ul>
                <br/>
                <b>GitHub:
                    <Link to={`https://github.com/xndadelin`} className='text-red-500'> xndadelin</Link>
                </b>
                <br/>
                <b>Disclaimer:</b> This is a personal project and not meant for commercial use.
                <br/>
                <br/>
                <b>Thank you for visiting!</b>
            </p>
        </div>
    )
}