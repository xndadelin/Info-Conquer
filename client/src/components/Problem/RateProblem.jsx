import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { Star } from '../../utils/Star';
import { useTranslation } from 'react-i18next';
import { RATE_PROBLEM } from '../../utils/Queries';

export const RateProblem = ({ isOpen, onClose, problem, onOpenChange, setUserHasRated }) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(1);
    const [stars, setStars] = useState({
        'star-1': { hovered: false, selected: false },
        'star-2': { hovered: false, selected: false },
        'star-3': { hovered: false, selected: false },
        'star-4': { hovered: false, selected: false },
        'star-5': { hovered: false, selected: false }
    });

    const [rate, { loading }] = useMutation(RATE_PROBLEM, {
        onCompleted: () => {
            onClose();
            setUserHasRated(true);
        },
    });

    const submit = () => {
        rate({ variables: { id: problem.title, rating } });
    };

    const onMouseEnter = (_, index) => {
        const updatedStars = {};
        for (let i = 1; i <= 5; i++) {
            updatedStars[`star-${i}`] = {
                ...stars[`star-${i}`],
                hovered: i <= index
            };
        }
        setStars(updatedStars);
    };

    const onMouseLeave = () => {
        const updatedStars = {};
        for (let i = 1; i <= 5; i++) {
            updatedStars[`star-${i}`] = {
                ...stars[`star-${i}`],
                hovered: false
            };
        }
        setStars(updatedStars);
    };

    const onClickStar = (_, index) => {
        const updatedStars = {};
        for (let i = 1; i <= 5; i++) {
            updatedStars[`star-${i}`] = {
                ...stars[`star-${i}`],
                hovered: false,
                selected: i <= index
            };
        }
        setStars(updatedStars);
        setRating(index);
    };

    return (
        <section className="p-5">
            <Modal className="bg-gray-800" size="md" onOpenChange={onOpenChange} isOpen={isOpen} onClose={onClose} title={t('rateProblemPage.rateProblemTitle')}>
                <ModalContent>
                    <ModalHeader>{t('rateProblemPage.rateProblemHeader')}</ModalHeader>
                    <ModalBody>
                        <div className='flex'>
                            {Object.keys(stars).map((star, index) => (
                                <Star
                                    key={star}
                                    number={index + 1}
                                    hovered={stars[star].hovered}
                                    onMouseEnter={() => onMouseEnter(star, index + 1)}
                                    onMouseLeave={onMouseLeave}
                                    selected={stars[star].selected}
                                    onClick={() => onClickStar(star, index + 1)}
                                />
                            ))}
                        </div>
                    </ModalBody>
                    <ModalFooter align="right">
                        <Button color='primary' variant='flat' onClick={submit} isLoading={loading}>
                            {t('rateProblemPage.submitButton')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </section>
    );
};