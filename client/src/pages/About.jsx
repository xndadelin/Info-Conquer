import { Link } from 'react-router-dom';
export const About = () => {
    return (
        <div className="container mx-auto p-4 my-5">
            <p className="text-4xl mb-4 font-bold">About</p>
            <p className="text-lg">
                This is a platform for competitive programming enthusiasts.
                <br/>
                InfoConquer is a platform for competitive programming enthusiasts. It is a platform where you can practice problems, participate in contests, read articles, and publish your own problems and articles
                <br/>
                The platform also has a code judger thats tests your code based on tests cases and gives you (explicit) feedback on your code.
                <br/>
                The platform also has a code feedback feature that uses OpenAI API to give you feedback on your code (optimization, code quality, etc.). 
                <br/>
                The platform also has a feature that gives you insights on the problem you are solving (leaderbord, success rate, etc.).
                <br/>
                The platform is still in development and more features will be added soon.
                <br/>
                The authentication system is based on JWT tokens and the platform is (will be lol) secured with HTTPS.
                <br/>
                The problems are divided into categories and subcategories. The problems are also tagged with difficulty levels.
                <br/>
                The platform also has a feature that allows you to publish your own problems (you have to get my permission) and articles (can do it without admin, but need permission to actually publish).
                <br/>
                The platform also has a feature that allows you to post announcements (for admins).
                <br/> 
                The code editor is based on Monaco Editor. The code judger is based on Docker containers so you do no try things like system("rm -rf /") and stuff like that. I do not want my host machine to be destroyed.
                <br/>
                The platform is built using MERN stack and GraphQL.
                <br/>
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