import { Button, Chip, DateRangePicker, Input, Textarea } from "@nextui-org/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectItem } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { CREATE_CONTEST, GET_PROBLEMS_TITLE } from "../../utils/Queries";


export const CreateConstest = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext)
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [languages, setLanguages] = useState([]);
    const languagesDef = [
        { value: 'JavaScript' }, { value: 'Python' }, { value: 'Java' }, { value: 'C#' },
        { value: 'C++' }, { value: 'TypeScript' }, { value: 'Rust' }, { value: 'PHP' }, { value: 'C' }
    ];
    const [date, setDate] = useState({
        startDate: {
            year: undefined,
            month: undefined,
            day: undefined,
            hour: undefined,
            minute: undefined
        },
        endDate: {
            year: undefined,
            month: undefined,
            day: undefined,
            hour: undefined,
            minute: undefined
        }
    });
    const navigate = useNavigate();

    const { error: errorProblems } = useQuery(GET_PROBLEMS_TITLE, {
        variables: {
            subcategory: 'none',
            category: ''
        },
        onCompleted: (data) => {
            setProblems(data.getProblems.map((problem) => problem.title));
        }
    });

    const [createContest, { loading }] = useMutation(CREATE_CONTEST, {
        onCompleted: (data) => {
            if (data.createContest.success) {
                navigate('/contests');
            }
        },
        onError: (error) => {
            setError(error.message);
        },
        variables: {
            name,
            description,
            endDate: new Date(date.endDate.year, date.endDate.month, date.endDate.day, date.endDate.hour, date.endDate.minute),
            startDate: new Date(date.startDate.year, date.startDate.month, date.startDate.day, date.startDate.hour, date.startDate.minute),
            problems: [...selectedProblems],
            languages
        }
    });

    const handleLanguagesChange = (language) => {
        const languages = language.target.value.split(",");
        setLanguages(languages);
    };
    if(!user || !user.getUser || !user.getUser.admin) return <NotFound/>
    return (
        <main className="container mx-auto my-5 mb-[400px] p-5">
            <h1 className="text-4xl font-bold">{t('createContest.title')}</h1>
            {error && (
                <Chip className="mt-5" color="danger" variant="flat">{error}</Chip>
            )}
            <form className="mt-5 flex flex-col gap-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} label={t('createContest.name')} />
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} label={t('createContest.description')} />
                <div className="flex gap-5">
                    <DateRangePicker
                        hourCycle={24}
                        label={t('createContest.contestDuration')}
                        labelPlacement="outside"
                        granularity="minute"
                        onChange={(e) => setDate({ startDate: e.start, endDate: e.end })}
                    />
                </div>
                <Select label={t('createContest.problems')} selectionMode="multiple" placeholder={t('createContest.problems_label')} onSelectionChange={setSelectedProblems}>
                    {problems.map((problem) => (
                        <SelectItem key={problem}>
                            {problem}
                        </SelectItem>
                    ))}
                </Select>
                <Select onChange={(e) => handleLanguagesChange(e)} items={languagesDef} label={t('createContest.languages')} isRequired isMultiline selectionMode="multiple" renderValue={(languages) => {
                    return (
                        <div className="flex flex-wrap gap-3">
                            {languages.map((language) => (
                                <Chip key={language.key}>{language.key}</Chip>
                            ))}
                        </div>
                    )
                }}>
                    {(language) => <SelectItem key={language.value}>{language.value}</SelectItem>}
                </Select>
                <Button isDisabled={!name || !date.startDate || !date.endDate || !problems || !languages} variant="flat" isLoading={loading} color="primary" onClick={() => createContest()}>{t('createContest.createButton')}</Button>
            </form>
        </main>
    );
};

