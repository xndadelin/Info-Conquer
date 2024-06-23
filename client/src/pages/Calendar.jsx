import { CardHeader, Card, CardBody, Link } from '@nextui-org/react';

export const Calendar = () => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const current = new Date()
    const month = current.getMonth()
    const monthName = months[month]

    const year = current.getFullYear()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0).getDate()
    const startDayOfWeek = firstDay.getDay()
    const days = []
    for(let i = 1; i <= lastDay; ++i){
        new Date(year, month, i) < current ? days.push({day:i, passed: true}) : days.push({day:i, passed: false})
    }
    return (
        <div className="container mx-auto my-5 p-5">
            <p className="text-3xl font-bold">{`${monthName} ${year}`}</p>
            <div className="grid grid-cols-7 max-md:grid-cols-4 gap-2 mt-4">
                {Array.from({ length: startDayOfWeek }, (_, index) => (
                    <Card/>
                ))}
                {days.map((day) => (
                    <Card isDisabled={day.passed} isHoverable as={Link} href={`/daily/${year}/${monthName}/${day}`} className='p-2'>
                        <CardHeader>
                            <p className='font-bold text-xl'>{day.day} {monthName}</p>
                        </CardHeader>
                        <CardBody>

                        </CardBody>
                    </Card>
                ))} 
            </div>
        </div>
    );
};
