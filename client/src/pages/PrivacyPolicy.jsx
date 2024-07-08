export const PrivacyPolicy = () => {
    
    const data = [
        {
            title: "Information we collect",
            content: (
                <>
                    <p className="mb-4">We only collect information about you if we have a reason to do so; for example, to provide our Services, to communicate with you, or to make our Services better.</p>
                    <p className="mb-2 font-semibold">We may collect the following information:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Your email address</li>
                        <li>Usage data (e.g., IP address, browser type, pages visited)</li>
                        <li>Your Discord data (e.g. user ID)</li>
                    </ul>
                </>
            )
        },
        {
            title: "How we use your information",
            content: (
                <>
                    <p className="mb-4">We only use the information we collect to provide our Services, communicate with you, or to make our Services better.</p>
                    <p className="mb-2 font-semibold">We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Send you emails</li>
                        <li>Improve our Services</li>
                        <li>Monitor and analyze usage</li>
                        <li>Communicate with you</li>
                    </ul>
                </>
            )
        },
        {
            title: "Sharing your information",
            content: (
                <>
                    <p className="mb-4">We do not share your information with third parties. We do not sell, rent, or trade any of your information with third parties.</p>
                    <p className="mb-4">You can choose to make your profile public or private. If you make your profile public, other users will be able to see your profile information.</p>
                    <p>If you make your profile private, only you will be able to see your profile information.</p>
                </>
            )
        },
        {
            title: "Cookies",
            content: (
                <>
                    <p className="mb-4">We use cookies to improve your experience on our website. By using our website, you agree to our use of cookies.</p>
                    <p>We use cookies for authentication purposes and to remember your preferences.</p>
                </>
            )
        },
        {
            title: "Changes to our Privacy Policy",
            content: (
                <>
                    <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                    <p className="mb-4">You are advised to review this Privacy Policy periodically for any changes.</p>
                    <p>We will send you an email notification if we make any significant changes to our Privacy Policy.</p>
                </>
            )
        },
        {
            title: "Contact",
            content: (
                <p>
                    If you have any questions about our Privacy Policy, please contact us at{' '}
                    <a className="text-blue-400 hover:text-blue-300 underline" href="mailto:adelinmihai071@gmail.com">
                        adelinmihai071@gmail.com
                    </a>
                </p>
            )
        }
    ];
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-gray-800 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">Last updated: 2024-07-07</span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Privacy Policy</h1>
                        <p className="text-xl text-gray-400">Welcome to InfoConquer's Privacy Policy. This policy describes how we collect, use, and protect your personal information.</p>
                    </div>

                    {data.map((section, index) => (
                        <section key={index} className="mb-12 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <h2 className="text-2xl font-bold bg-gray-700 py-4 px-6">{section.title}</h2>
                            <div className="p-6">{section.content}</div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}