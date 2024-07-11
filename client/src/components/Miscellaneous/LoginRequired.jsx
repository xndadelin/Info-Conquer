import { Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

export const LoginRequired = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
                <h2 className="text-4xl font-extrabold text-gray-300 mb-2">Login Required</h2>
                <div className="w-16 h-1 bg-indigo-500 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 mb-8">You need to be logged in to access this page. Please log in to continue.</p>
                <Link to="/login">
                   <Button onClick={(e) => e.preventDefault()} color='primary' size='lg' block>Log in</Button>
                </Link>
                <p className="mt-6 text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-primary-900 hover:underline">Sign up here</Link>
                </p>
            </div>
        </div>
    )
}