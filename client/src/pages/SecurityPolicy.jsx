export const SecurityPolicy = () => {
    const data = [
        {
            title: "Data Protection",
            content: (
                <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
            )
        },
        {
            title: "Encryption",
            content: (
                <p>All data transmitted between your device and our servers is encrypted using SSL/TLS protocols to ensure the confidentiality of your information.</p>
            )
        },
        {
            title: "Access Control",
            content: (
                <p>We maintain strict access controls to limit employee access to user data. Only authorized personnel who need to access your information to perform their job duties are granted such access.</p>
            )
        },
        {
            title: "Regular Audits",
            content: (
                <p>We conduct regular security audits and vulnerability assessments to identify and address potential security risks in our systems.</p>
            )
        },
        {
            title: "Incident Response",
            content: (
                <p>In the event of a security breach, we have a comprehensive incident response plan in place to quickly identify, contain, and mitigate any potential impact on our users.</p>
            )
        },
        {
            title: "User Responsibilities",
            content: (
                <>
                    <p className="mb-4">While we take extensive measures to protect your data, we also recommend that you:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Use strong, unique passwords for your account</li>
                        <li>Enable two-factor authentication when available</li>
                        <li>Be cautious of phishing attempts and suspicious links</li>
                        <li>Keep your devices and software up to date</li>
                    </ul>
                </>
            )
        },
        {
            title: "Contact",
            content: (
                <p>
                    If you have any questions about our Security Policy or notice any suspicious activity, please contact us immediately at{' '}
                    <a className="text-blue-400 hover:text-blue-300 underline" href="mailto:security@infoconquer.com">
                        security@infoconquer.com
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
                        <span className="inline-block bg-gray-800 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">Last updated: 2024-07-08</span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Security Policy</h1>
                        <p className="text-xl text-gray-400">At InfoConquer, we take the security of your information seriously. This policy outlines our commitment to protecting your data.</p>
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