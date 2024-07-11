import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { NotFound } from '../components/Miscellaneous/NotFound';
import { Loading } from '../components/Miscellaneous/Loading';
import { useTranslation } from 'react-i18next';
import { GET_DAILIES } from '../utils/Queries';
import { Error } from '../components/Miscellaneous/Error';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { LoginRequired } from '../components/Miscellaneous/LoginRequired';

export const Calendar = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const current = new Date();
    const [currentMonth, setCurrentMonth] = useState({ year: current.getFullYear(), month: current.getMonth() });
    const [days, setDays] = useState([]);
    const [monthName, setMonthName] = useState('');

    useEffect(() => {
        const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();

        const newDays = Array.from({ length: lastDay }, (_, i) => ({
            day: i + 1,
            passed: new Date(currentMonth.year, currentMonth.month, i + 1) < current,
        }));

        setDays(newDays);
        setMonthName(months[currentMonth.month]);
    }, [currentMonth]);

    const { data, loading, error } = useQuery(GET_DAILIES);
    if (loading) return <Loading />;
    if (!data || error) return <NotFound />;
    if(!user.getUser) return <LoginRequired />;

    const dailies = data.getDailies;
    const dailiesMap = dailies.reduce((acc, d) => {
        const dailyDate = new Date(d.date);
        const key = `${dailyDate.getFullYear()}-${dailyDate.getMonth() + 1}-${dailyDate.getDate()}`;
        acc[key] = d;
        return acc;
    }, {});


    return (
        <main className="container mx-auto my-5 p-5">
            <h1 className="text-3xl font-bold">{`${monthName} ${currentMonth.year}`}</h1>
            <section className="grid grid-cols-7 max-md:grid-cols-3 gap-2 mt-4">
                {Array.from({ length: new Date(currentMonth.year, currentMonth.month).getDay() }).map((_, index) => (
                    <div key={`empty-${index}`} className="invisible"></div>
                ))}
                {days.map((day) => {
                    const key = `${currentMonth.year}-${currentMonth.month + 1}-${day.day}`;
                    const daily = dailiesMap[key];
                    return (
                        <motion.div
                            key={day.day}
                            className={`p-5 rounded-lg ${daily?.problem ? (daily.solved ? 'bg-green-500 text-black' : 'bg-red-500 text-black hover:opacity-75') : 'bg-gray-800'} ${day.day === current.getDate() ? 'bg-yellow-400 text-black' : ''}`}
                            onClick={() => window.location.href = `/daily/${daily && daily.problem}/${currentMonth.year}/${currentMonth.month + 1}/${day.day}`}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05, rotate:2 }}
                        >
                            <div className="w-full h-full">
                                <div className='flex flex-col items-start'>
                                    <h1 className="font-bold text-xl">{day.day}</h1>
                                    <h3 className='font-bold'>{Days[new Date(currentMonth.year, currentMonth.month, day.day).getDay()]}</h3>
                                </div>
                                <div className='mt-3'>
                                    {daily ? (
                                        <p>{daily.problem}</p>
                                    ) : (
                                        day.passed ? (
                                            <p>{t('calendar.noDailyAvailable')}</p>
                                        ) : (
                                            <p>{t('calendar.noDailyYet')}</p>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>
        </main>
    );
};
