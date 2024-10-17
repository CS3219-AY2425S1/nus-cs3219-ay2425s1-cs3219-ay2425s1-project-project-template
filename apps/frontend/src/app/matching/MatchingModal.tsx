import React, { useState, useEffect } from 'react';
import { 
    Modal,
 } from 'antd';
import 'typeface-montserrat';
import './styles.scss';
import FindMatchContent from './modalContent/FindMatchContent';
import MatchingInProgressContent from './modalContent/MatchingInProgressContent';
import MatchFoundContent from './modalContent/MatchFoundContent';
import JoinedMatchContent from './modalContent/JoinedMatchContent';
import MatchNotFoundContent from './modalContent/MatchNotFoundContent';
import MatchCancelledContent from './modalContent/MatchCancelledContent';
import useMatching from '../services/use-matching';

interface MatchingModalProps {
    isOpen: boolean;
    close: () => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, close: _close }) => {
    const matchingState = useMatching();
    const [closedType, setClosedType] = useState<"finding" | "cancelled" | "joined">("finding");
    const isClosable = ["timeout", "closed"].includes(matchingState.state);

    function close() {
        // clean up matching and closedType State
        if (matchingState.state === "timeout") {
            matchingState.ok();
        }
        _close();
    }

    const renderModalContent = () => {
        switch (matchingState.state) {
            case 'closed':
                switch (closedType) {
                    case "finding":
                        return <FindMatchContent beginMatch={matchingState.start}/>;
                    case "cancelled":
                        return <MatchCancelledContent
                            reselect={() => {
                                setClosedType("finding");
                            }}
                            retry={() => {}}
                        />;
                    case "joined":
                        return <JoinedMatchContent cancel={() => {
                            setClosedType("cancelled");
                        }}/>;
                }
            case 'matching':
                return <MatchingInProgressContent cancelMatch={() => {
                    matchingState.cancel();
                    setClosedType("cancelled");
                }}/>;
            case 'cancelling':
                return <MatchingInProgressContent cancelMatch={() => {}}/>;
            case 'starting':
                return <FindMatchContent beginMatch={() => {}}/>
            case 'found':
                return <MatchFoundContent 
                    cancel={() => {
                        matchingState.ok();
                        setClosedType("cancelled");
                    }}
                    join={() => {
                        matchingState.ok();
                        setClosedType("joined");
                    }}
                />
            case 'timeout':
                return <MatchNotFoundContent reselect={matchingState.ok} retry={() => {}}/>;
            default:
                throw new Error('Invalid matching state.');
        }
    };

    return (
        <Modal open={isOpen}
            onCancel={close}
            footer={null}
            closable={false}
            maskClosable={false}
            className="modal"
        >
            {renderModalContent()}
            {isClosable && (
                <button className="close-button" onClick={close}>Close</button>
            )}
        </Modal>
    )
}

export default MatchingModal;
