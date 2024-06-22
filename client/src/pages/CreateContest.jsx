import { Button, Chip, DateRangePicker ,Input, Textarea } from "@nextui-org/react"
import {gql, useMutation, useQuery} from "@apollo/client"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import { Select, SelectItem } from "@nextui-org/react"
const GET_PROBLEMS = gql`
    query GetProblems($category: String, $subcategory: String){
        getProblems(category: $category, subcategory: $subcategory){
            title
        }
    }   
`
export const CreateConstest = () => {
    const [problems, setProblems] = useState([])
    const [selectedProblems, setSelectedProblems] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [error, setError] = useState('')
    const [languages, setLanguages] = useState([])
    const languagesDef = [
        { value: 'JavaScript' }, { value: 'Python' }, { value: 'Java' }, { value: 'C#' },
        { value: 'C++' }, { value: 'TypeScript' }, { value: 'Rust' }, { value: 'PHP' }, { value: 'C' }
    ]
    const navigate = useNavigate()
    const {error: errorProblems} = useQuery(GET_PROBLEMS, {
        variables : {
            subcategory: 'none',
            category: ''
        },
        onCompleted:(data) => {
            setProblems(data.getProblems.map((problem) => {
                return problem.title
            }))
        }
    })
    const createContestMutation = gql`
        mutation CreateContest($name: String, $description: String, $startDate: ContestDateInput, $endDate: ContestDateInput, $problems: [ProblemInput], $languages: [String]) {
            createContest(name: $name, description: $description, startDate: $startDate, endDate: $endDate, problems: $problems, languages: $languages) {
                success
            }
        }
    `
    const [createContest, {loading}] = useMutation(createContestMutation, {
        onCompleted: (data) => {
            if(data.createContest.success) {
                navigate('/contests')
            }
        },
        onError: (error) => {
            setError(error.message)
        }, 
        variables: {
            name,
            description,
            startDate : {
                year: startDate && startDate.year,
                month: startDate && startDate.month,
                day: startDate && startDate.day,
                hour: startDate && startDate.hour,
                minute: startDate && startDate.minute,
            },
            endDate : {
                year: endDate && endDate.year,
                month: endDate && endDate.month,
                day: endDate && endDate.day,
                hour: endDate && endDate.hour,
                minute: endDate && endDate.minute,
            },
            problems: selectedProblems,
            languages
        }
    })
    const handleLanguagesChange = (language) => {
        const languages = language.target.value.split(",")
        setLanguages(languages)
    }
    return (
        <div className="container mx-auto my-5 mb-[400px] p-5">
            <p className="text-4xl font-bold">Create contest </p>
            {error && (
                <Chip className='mt-5' color="danger" variant='flat'>{error}</Chip>
            )}
            <form className="mt-5 flex flex-col gap-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} label="Name"/>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} label="Description"/>
                <div className="flex gap-5">
                <DateRangePicker
                    hourCycle={24}
                    label="Contest duration"
                    visibleMonths={2}
                    labelPlacement="outside"
                    granularity="minute"
                />
                </div>
                <Select label="Problems" selectionMode="multiple" placeholder="Choose problems" onSelectionChange={setSelectedProblems}>
                    {problems.map((problem) => (
                        <SelectItem key={problem}>
                            {problem}
                        </SelectItem>
                    ))}
                </Select>
                <Select onChange={(e) => handleLanguagesChange(e)} items={languagesDef} label="Languages" isRequired isMultiline selectionMode="multiple" renderValue={(languages) => {
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
                <Button isDisabled={!name || !name || !startDate || !endDate || !problems || !languages} variant="flat" isLoading={loading} color="danger" onClick={() => createContest()} >Create contest</Button>
            </form>
        </div>
    )
}