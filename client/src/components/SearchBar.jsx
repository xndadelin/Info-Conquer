import { Input, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { Link } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';

export const SearchBar = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    return (
        <Tooltip text={t('searchBar.text')} className="p-0" placement="bottom" content={
            <Input
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        window.location.href = `/search/${search}`;
                    }
                }}
                label={t('searchBar.label')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchBar.text')}
            />
        }>
            <Link isBlock color="primary">{t('searchBar.label')}</Link>
        </Tooltip>
    );
};
