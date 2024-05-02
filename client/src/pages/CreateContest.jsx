import { Button, Chip, DateInput, Input, Textarea } from "@nextui-org/react"
import { useState } from "react"
export const CreateConstest = () => {
    const [problems, setProblems] = useState([])
    const [currentProblem, setCurrentProblem] = useState('')
    const onAddProblem = (id) => {
        setProblems([...problems, id])
        setCurrentProblem('')
    }
    const onRemoveProblem = (id) => {
        setProblems(problems.filter(problem => problem !== id))
    }
    return (
        <div className="container mx-auto my-5">
            <p className="text-4xl font-bold">Create contest </p>
            <form className="mt-5 flex flex-col gap-4">
                <Input label="Name"/>
                <Textarea label="Description"/>
                <div className="flex gap-5">
                    <DateInput label="Start Date"/>
                </div>
                <Input label="End Time"/>
                <Input label="Duration"/>
                <Input value={currentProblem} onChange={(e) => setCurrentProblem(e.target.value)} endContent={
                    <Button disabled={currentProblem == ''} variant="flat" color="success" onClick={() => onAddProblem(currentProblem)}>Add problem</Button>
                } label="Problems"/>
                {problems.map((problem, index) => (
                    <Chip key={index} className="cursor-pointer" onClick={() => onRemoveProblem(problem)}>{problem}</Chip>
                ))}
            </form>
        </div>
    )
}