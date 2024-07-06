import { Modal, ModalBody, ModalContent, ModalHeader, Spinner, Chip, Snippet, Divider } from "@nextui-org/react"
import { useContext } from "react"
import { UserContext } from '../context/UserContext'
import { useTranslation } from "react-i18next";
import { getStatusColor } from "../utils/getStatusColor";
import { Link } from "react-router-dom";

export const TestingSolution = ({ onClose, isOpen, loading, tests }) => {
    const { t } = useTranslation();
    const user = useContext(UserContext);

    if (!loading && !tests || !user) return null;

    const getColor = (score) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 80) return 'bg-green-400';
        if (score >= 70) return 'bg-yellow-500';
        if (score >= 60) return 'bg-yellow-400';
        if (score >= 50) return 'bg-yellow-300';
        if (score >= 40) return 'bg-orange-500';
        if (score >= 30) return 'bg-orange-400';
        if (score >= 20) return 'bg-orange-300';
        if (score >= 10) return 'bg-red-400';
        return 'bg-red-500';
    };
    
    const testsTable = () => {
        return (
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-0 pb-8">
            <div className="bg-gray-900 shadow-xl rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.index')}</th>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.time')}</th>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.memory')}</th>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.score')}</th>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.status')}</th>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.exitcode')}/{t('testingSolution.tests.exitsig')}</th>
                      <th scope="col" className="px-6 py-4">{t('testingSolution.tests.message')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {tests.tests && tests.tests.map((test, index) => (
                      <tr className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">{test.executionTime} s</td>
                        <td className="px-6 py-4">{parseFloat(test.memoryUsed / 1024).toFixed(3)} MB</td>
                        <td className="px-6 py-4">{test.score}</td>
                        <td className="px-6 py-4">
                          <Chip variant="flat" color={getStatusColor(test.status)} className="font-semibold">{test.status}</Chip>
                        </td>
                        <td className="px-6 py-4">{test.exitcode != null ? test.exitcode : test.exitsig ? test.exitsig : '-'}</td>
                        <td className="px-6 py-4">{test.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 space-y-6">
              {tests.score === "100" ? (
                <div className="bg-green-900 text-green-100 rounded-lg p-4 shadow-md">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">{t('testingSolution.tests.allTestsPassed')}</span>
                  </div>
                </div>  
              ) : (
                <div className="bg-yellow-900 text-yellow-100 rounded-lg p-4 shadow-md">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold">{t('testingSolution.tests.failedTestsMessage')}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-300">Score: 
                    <span className={`ml-2 px-3 py-1 rounded-full ${getColor(tests.score)} text-white`}>
                      {tests.score}
                    </span>
                  </p>
                  <Link 
                    to={`/solution/${tests.username}/${tests.id_solution}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    View Solution
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      }

    const compilationError = () => {
        return (
            <Snippet hideSymbol color="danger" className="w-[100%]"> 
                <pre className="whitespace-pre-wrap">
                    {tests.compilationError}
                </pre>
            </Snippet>
        )
    }

    return (
        <div className="p-5">
            <Modal
                scrollBehavior="inside"
                size="3xl"
                isOpen={isOpen}
                onClose={onClose}
                hideCloseButton={loading}
                isDismissable={!loading}
                isKeyboardDismissDisabled={loading}
                placement="center"
                backdrop="blur"
                classNames={{
                    body: 'bg-gray-900 rounded-xl rounded-b-xl',
                    header: 'bg-gray-900 rounded-t-xl',
                }}
            >
                <ModalContent>
                    <ModalHeader>
                      <div className="text-2xl font-extrabold text-gray-300">
                        {t('testingSolution.modalHeader')}
                        <p className="text-sm text-gray-400">User: {tests.username}</p>
                        <p className="text-sm text-gray-400">ID: {tests.id_solution}</p>
                        <p className="text-sm text-gray-400">Problem: {tests.problem}</p>
                        <p className="text-sm text-gray-400">Language: {tests.language}</p>
                      </div>
                    </ModalHeader>
                    <ModalBody className="rounded-sm p-0">
                        {loading && <div className="min-h-[200px] flex justify-center self-center"><Spinner color="default" /></div>}
                        {tests.compilationError && (
                            <div>
                                <p className="text-lg font-semibold mb-3">{t('testingSolution.compilationError.title')}</p>
                                {compilationError()}
                            </div>
                        )}
                        {tests.tests && testsTable(user)}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
