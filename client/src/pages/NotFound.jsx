import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto flex items-center justify-center h-screen p-16">
            <div className="grid gap-2">
                <p className="text-5xl">{t('notFound.title')}</p>
                <p className="text-default-500">{t('notFound.description')}</p>
                <Button className="self-start" onClick={() => navigate(-1)}>{t('notFound.buttonText')}</Button>
            </div>
        </div>
    );
};
