import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Link } from '@nextui-org/react';
import { gql, useQuery } from '@apollo/client' 
import { NotFound } from './NotFound';
import { Loading } from '../components/Loading';
import { useTranslation } from 'react-i18next';

const GET_DAILIES = gql`
    query GetDailies {
        getDailies {
            problem
            date
            solved
        }
    }
`;

export const Calendar = () => {
    const { t } = useTranslation(); 
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

    const dailies = data.getDailies;
    const dailiesMap = dailies.reduce((acc, d) => {
        const dailyDate = new Date(d.date);
        const key = `${dailyDate.getFullYear()}-${dailyDate.getMonth() + 1}-${dailyDate.getDate()}`;
        acc[key] = d;
        return acc;
    }, {});

    return (
        <div className="container mx-auto my-5 p-5">
            <p className="text-3xl font-bold">{`${monthName} ${currentMonth.year}`}</p>
            <div className="grid grid-cols-7 max-md:grid-cols-3 gap-2 mt-4">
                {Array.from({ length: new Date(currentMonth.year, currentMonth.month).getDay() }).map((_, index) => (
                    <div className="invisible">
                        <Card />
                    </div>
                ))}
                {days.map((day) => {
                    const key = `${currentMonth.year}-${currentMonth.month + 1}-${day.day}`;
                    const daily = dailiesMap[key];
                    return (
                        <Card
                            isDisabled={!day.passed}
                            as={Link}
                            href={`/daily/${daily && daily.problem}/${currentMonth.year}/${currentMonth.month + 1}/${day.day}`}
                            className={`p-2 hover:opacity-75 ${daily?.problem ? daily.solved ? 'bg-green-500 text-black' : 'bg-red-500 text-black hover:opacity-75 ' : 'bg-gray-800'} ${day.day === current.getDate() ? 'bg-yellow-400 text-black' : ''}`}
                        >
                            <CardHeader className='flex flex-col items-start'>
                                <p className="font-bold text-xl">{day.day}</p>
                                <p className='font-bold'>{Days[new Date(currentMonth.year, currentMonth.month, day.day).getDay()]}</p>
                            </CardHeader>
                            <CardBody>
                                {daily ? (
                                    <p>{daily.problem}</p>
                                ) : (
                                    day.passed ? (
                                        <p>{t('calendar.noDailyAvailable')}</p>
                                    ) : (
                                        <p>{t('calendar.noDailyYet')}</p>
                                    )
                                )}
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
