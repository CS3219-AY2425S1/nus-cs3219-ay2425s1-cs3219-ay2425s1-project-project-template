import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { 
    Modal,
 } from 'antd';
import 'typeface-montserrat';
import './styles.scss';
import FindMatchContent from './modalContent/FindMatchContent';
import MatchingInProgressContent from './modalContent/MatchingInProgressContent';
import MatchFound from './modalContent/MatchFoundContent';
import JoinedMatchContent from './modalContent/JoinedMatchContent';
import MatchNotFoundContent from './modalContent/MatchNotFoundContent';
import MatchCancelledContent from './modalContent/MatchCancelledContent';

interface MatchingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, onClose }) => {
    // TODO: placehoder for now, to be replaced my useContext
    const [matchingState, setMatchingState] = useState('finding');

    // TODO: remove this after testing
    useEffect(() => {
        // Uncomment the following lines to test the different matching states
        // setMatchingState('finding');
        // setMatchingState('matching');
        // setMatchingState('found');
        // setMatchingState('joined');
        // setMatchingState('notFound');
        // setMatchingState('cancelled');
    }, []);

    // TODO: modify by using matchingState via useContext
    const isClosableMatchingState = () => {
        return matchingState === 'finding' || matchingState === 'notFound' || matchingState === 'cancelled';
    };

    const renderModalContent = () => {
        switch (matchingState) {
            case 'finding':
                return <FindMatchContent/>;
            case 'matching':
                return <MatchingInProgressContent />;
            case 'found':
                return <MatchFound />;
            case 'joined':
                return <JoinedMatchContent />;
            case 'notFound':
                return <MatchNotFoundContent />;
            case 'cancelled':
                return <MatchCancelledContent />;
            default:
                throw new Error('Invalid matching state.');
        }
    };

    return (
        <Modal open={isOpen}
            onCancel={onClose}
            footer={null}
            closable={false}
            maskClosable={isClosableMatchingState()}
            className="modal"
        >
            {renderModalContent()}
            {isClosableMatchingState() && (
                <button className="close-button" onClick={onClose}>Close</button>
            )}
        </Modal>
    )
}

export default MatchingModal;
