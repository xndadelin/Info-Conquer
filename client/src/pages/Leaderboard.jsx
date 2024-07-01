import { gql, useQuery } from '@apollo/client';
import { Loading } from '../components/Loading';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export const Leaderboard = () => {
    const { t } = useTranslation();

    const GET_LEADERBOARD = gql`
        query getLeaderboard {
            getLeaderboard {
                username
                solvedProblems
            }
        }
    `;

    const { data, loading } = useQuery(GET_LEADERBOARD);

    if (loading) return <Loading />;

    const top3 = data.getLeaderboard.slice(0, 3);
    const rest = data.getLeaderboard.slice(3);

    const heights = ['h-60', 'h-40', 'h-50'];
    
    return (
        <div className="container flex flex-col px-5 mx-auto mt-20 gap-10 mb-[100vh] text-white">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-red-500">{t('leaderboard.header')}</h1>
                <p className="text-xl text-gray-400 mt-4">{t('leaderboard.description')}</p>
            </div>

            
            <div className="flex flex-col items-end md:flex-row mx-auto mb-16">
                <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-6">
                    <div className={`flex flex-col justify-end items-center w-32 ${heights[1]} bg-[#1E1E24] p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                        <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-[#FF5555] text-lg text-white font-bold shadow-md`}>#2</div>
                        <div className="text-xl mt-3">{top3[1].username}</div>
                        <div className="text-lg text-gray-400 mt-1">{top3[1].solvedProblems}</div>
                    </div>
                    <div className="text-center mt-3 font-bold">{t('leaderboard.silver')}</div>
                </div>

                <div className="flex flex-col items-center mb-6 md:mb-0">
                    <div className={`flex flex-col justify-end items-center w-32 ${heights[0]} bg-[#1E1E24] p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                        <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-[#FF5555] text-lg text-white font-bold shadow-md`}>#1</div>
                        <div className="text-xl mt-3">{top3[0].username}</div>
                        <div className="text-lg text-gray-400 mt-1">{top3[0].solvedProblems}</div>
                    </div>
                    <div className="text-center mt-3 font-bold">{t('leaderboard.gold')}</div>
                </div>

               <div className="flex flex-col items-center ml-6 max-md:ml-0">
                    <div className={`flex flex-col justify-end items-center w-32 ${heights[2]} bg-[#1E1E24] p-5 rounded-t-lg border border-gray-700 shadow-lg relative`}>
                        <div className={`absolute top-0 -mt-5 px-4 py-1 rounded-full bg-[#FF5555] text-lg text-white font-bold shadow-md`}>#3</div>
                        <div className="text-xl mt-3">{top3[2].username}</div>
                        <div className="text-lg text-gray-400 mt-1">{top3[2].solvedProblems}</div>
                    </div>
                    <div className="text-center mt-3 font-bold">{t('leaderboard.bronze')}</div>
                </div>
            </div>


            {rest.length > 0 && (
                <div className="overflow-x-auto">
                    <Table isCompact>
                        <TableHeader className="bg-[#1E1E24] text-gray-300">
                            <TableColumn className="border-b border-gray-700">{t('leaderboard.table.rank')}</TableColumn>
                            <TableColumn className="border-b border-gray-700">{t('leaderboard.table.username')}</TableColumn>
                            <TableColumn className="border-b border-gray-700">{t('leaderboard.table.solvedProblems')}</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {rest.map((user, index) => (
                                <TableRow key={index} className="hover:bg-[#292929]">
                                    <TableCell className="border-b border-gray-700">{index + 4}</TableCell>
                                    <TableCell className="border-b border-gray-700">{user.username}</TableCell>
                                    <TableCell className="border-b border-gray-700">{user.solvedProblems}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};
