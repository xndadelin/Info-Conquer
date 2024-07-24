import { Input, Button, useDisclosure, Modal, ModalHeader, ModalContent, ModalBody } from "@nextui-org/react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
export const SearchBar = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { isOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <section>
        <Button
          className="bg-transparent" 
          onClick={onOpenChange}
          data-cy="search-button"
          name="search-button"
          aria-label="search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </Button>
      </section>
      
      <Modal 
        className="bg-opacity-75 backdrop-blur-md"
        size="full" 
        isOpen={isOpen} 
        onClose={onClose}
      >
        <ModalHeader>{t('search')}</ModalHeader>
        <ModalContent>
          <ModalBody>
            <Input
              classNames={{
                input: 'bg-transparent text-5xl',
                inputWrapper: 'bg-transparent border-0',
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search.placeholder')}
              className="p-20 max-md:p-10 max-sm:p-5 my-10 hover:bg-transparent"
              variant="bordered"
              onKeyDown={(e) => {
                if (e.key === 'Enter') window.location.href = `/search/${search}`;
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};