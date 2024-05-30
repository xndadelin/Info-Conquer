import { Input, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { Link } from "@nextui-org/react";
export const SearchBar = () => {
    const [search, setSearch] = useState('');
    return (
        <Tooltip text="Search for problems, articles, contests, etc." placement="bottom" content={
            <Input onKeyDown={(e) => {
                if(e.key === 'Enter'){
                    window.location.href = `/search/${search}`
                }
            }} label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for problems, articles, contests, etc." />
        }>
            <Link isBlock color="danger">Search</Link>
        </Tooltip>
    )
}