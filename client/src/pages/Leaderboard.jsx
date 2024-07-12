import { useQuery } from '@apollo/client';
import { Loading } from '../components/Miscellaneous/Loading';
import { Avatar, Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { GET_LEADERBOARD } from '../utils/Queries';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Leaderboard = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);

    const { data, loading } = useQuery(GET_LEADERBOARD);
    
    if (loading) return <Loading />;

    const top3 = data.getLeaderboard.slice(0, 3);
    const rest = data.getLeaderboard.slice(3);

    const heights = ['h-60', 'h-40', 'h-50'];
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container flex flex-col px-5 mx-auto mt-20 gap-10 mb-[100vh] text-white"
        >
            <section className="text-center mb-10" >
                <h1 className="text-5xl font-extrabold text-primary-900">{t('leaderboard.header')}</h1>
                <p className="text-xl text-gray-400 mt-4">{t('leaderboard.description')}</p>
            </section>


            <motion.section
                className="flex flex-col items-end md:flex-row mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {top3[1] ? (
                    <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-6 transform transition duration-500 ease-in-out hover:scale-105">
                        <div className={`flex flex-col justify-end items-center w-32 ${heights[1]} bg-gray-800 p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                            <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-gray-800 text-lg text-white font-bold shadow-md`}>#2</div>
                            <Avatar src={top3.profilePcture} size="xl" className="mt-3" />
                            <div className="text-xl mt-3">{top3[1].username}</div>
                            <div className="text-lg text-gray-400 mt-1">{top3[1].solvedProblems}</div>
                        </div>
                        <div className="text-center mt-3 font-bold">{t('leaderboard.silver')}</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-6 transform transition duration-500 ease-in-out hover:scale-105">
                        <div className={`flex flex-col justify-end items-center w-32 ${heights[1]} bg-gray-800 p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                            <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-gray-800 text-lg text-white font-bold shadow-md`}>#2</div>
                            <div className="text-xl mt-3">-</div>
                            <div className="text-lg text-gray-400 mt-1">-</div>
                        </div>
                        <div className="text-center mt-3 font-bold">{t('leaderboard.silver')}</div>
                    </div>
                )}
                {top3[0] ? (
                    <div className="flex flex-col items-center mb-6 md:mb-0 transform transition duration-500 ease-in-out hover:scale-105">
                        <div className={`flex flex-col justify-end items-center w-32 ${heights[0]} bg-gray-800 p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                            <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-gray-800 text-lg text-white font-bold shadow-md`}>#1</div>
                            <Avatar src={top3[0].profilePicture} size="xl" className="mt-3" />
                            <div className="text-xl mt-3">{top3[0].username}</div>
                            <div className="text-lg text-gray-400 mt-1">{top3[0].solvedProblems}</div>
                        </div>
                        <div className="text-center mt-3 font-bold">{t('leaderboard.gold')}</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mb-6 md:mb-0 transform transition duration-500 ease-in-out hover:scale-105">
                        <div className={`flex flex-col justify-end items-center w-32 ${heights[0]} bg-gray-800 p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                            <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-gray-800 text-lg text-white font-bold shadow-md`}>#1</div>\
                            <div className="text-xl mt-3">-</div>
                            <div className="text-lg text-gray-400 mt-1">-</div>
                        </div>
                        <div className="text-center mt-3 font-bold">{t('leaderboard.gold')}</div>
                    </div>

                )}

                {top3[2] ? (
                    <div className="flex flex-col items-center ml-6 max-md:ml-0 transform transition duration-500 ease-in-out hover:scale-105">
                        <div className={`flex flex-col justify-end items-center w-32 ${heights[2]} bg-gray-800 p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                            <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-gray-800 text-lg text-white font-bold shadow-md`}>#3</div>
                            <Avatar src={top3[2].profilePicture} size="xl" className="mt-3" />
                            <div className="text-xl mt-3">{top3[2].username}</div>
                            <div className="text-lg text-gray-400 mt-1">{top3[2].solvedProblems}</div>
                        </div>
                        <div className="text-center mt-3 font-bold">{t('leaderboard.bronze')}</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center ml-6 max-md:ml-0 transform transition duration-500 ease-in-out hover:scale-105">
                        <div className={`flex flex-col justify-end items-center w-32 ${heights[2]} bg-gray-800 p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                            <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-gray-800 text-lg text-white font-bold shadow-md`}>#3</div>
                            <div className="text-xl mt-3">-</div>
                            <div className="text-lg text-gray-400 mt-1">-</div>
                        </div>
                        <div className="text-center mt-3 font-bold">{t('leaderboard.bronze')}</div>
                    </div>
                )}
            </motion.section>
            {rest.length > 0 && (
                <motion.section
                    className="overflow-x-auto overflow-y-hidden rounded-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <table className='w-full text-sm text-gray-300 border-collapse shadow-2xl'>
                        <thead>
                            <tr className='bg-gray-800 border-b border-gray-700'>
                                <th className='p-3 text-left'>{t('leaderboard.table.rank')}</th>
                                <th className='p-3 text-left'>{t('leaderboard.table.username')}</th>
                                <th className='p-3 text-left'>{t('leaderboard.table.solvedProblems')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rest.slice((page - 1) * 20, page * 20).map((user, index) => (
                                <tr key={user.id} className='bg-gray-800 border-b border-gray-700'>
                                    <td className='p-3'>{index + 4}</td>
                                    <td className='p-3'>
                                        <Link to={`/profile/${user.usermae}`} className='flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-400'>
                                            {user.username}
                                        </Link>
                                    </td>
                                    <td className='p-3'>{user.solvedProblems}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        total={Math.ceil(rest.length / 20)}
                        page={page}
                        onChange={setPage}
                        className='mt-5 mr-0'
                        showControls
                        loop
                    />
                </motion.section>
            )}
        </motion.main>
    );
};
