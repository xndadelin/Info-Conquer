import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-2xl">
        <section className="text-center">
          <h1 className="text-6xl font-extrabold animate-bounce">
            404
          </h1>
          <h2 className="mt-6 text-3xl font-bold">
            {t('notFound.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t('notFound.description')}
          </p>
        </section>
        <section className="mt-8 space-y-6">
          <Button 
            color="primary"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out transform hover:scale-105"
            onClick={() => navigate(-1)}
          >
            {t('notFound.buttonText')}
          </Button>
        </section>
      </div>
    </main>
  );
};