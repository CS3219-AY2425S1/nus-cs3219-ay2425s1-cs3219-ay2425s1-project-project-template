import React, { useState, useEffect } from 'react';
import { 
    Form,
    Button,
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
import { ValidateUser } from '../services/user';
import { useTimer } from 'react-timer-hook';

interface MatchingModalProps {
    isOpen: boolean;
    close: () => void;
}

export interface MatchParams {
    topics: string[],
    difficulties: string[],
}
const MATCH_TIMEOUT = 30;
const JOIN_TIMEOUT = 5;

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, close: _close }) => {
    const matchingState = useMatching();
    const [closedType, setClosedType] = useState<"finding" | "cancelled" | "joined">("finding");
    const isClosable = ["timeout", "closed"].includes(matchingState.state);
    const { totalSeconds, pause: pauseTimer, restart: restartTimer } = useTimer({
        expiryTimestamp: new Date(Date.now() + MATCH_TIMEOUT * 1000),
        autoStart: false,
        onExpire() {
            if (matchingState.state === "matching") {
                matchingState.timeout();
                return;
            }
            if (matchingState.state === "found") {
                matchingState.ok();
                setClosedType("joined");
                return;
            }
            console.warn(`matching is in ${matchingState.state}`)
        },
    });
    const passed = MATCH_TIMEOUT - totalSeconds;

    function close() {
        // clean up matching and closedType State
        if (matchingState.state === "timeout") {
            matchingState.ok();
        }
        setClosedType("finding");
        _close();
    }

    const startMatch = matchingState.state == "closed" || matchingState.state == "timeout" ? async (params: MatchParams): Promise<void> => {
        const user = await ValidateUser();
        matchingState.start({
            email: user.data.email,
            username: user.data.username,
            type: "match_request",
            ...params
        });
    } : undefined;
    
    useEffect(() => {
        if (matchingState.state === "cancelling" || matchingState.state === "timeout") {
            pauseTimer();
            return;
        }
        if (matchingState.state === "found") {
            restartTimer(
                new Date(Date.now() + JOIN_TIMEOUT * 1000),
            )
        }
    }, [matchingState])

    const renderModalContent = () => {
        switch (matchingState.state) {
            case 'closed':
                switch (closedType) {
                    case "finding":
                        return <FindMatchContent beginMatch={params => {
                            restartTimer(
                                new Date(Date.now() + MATCH_TIMEOUT * 1000),
                            );
                            matchingState.start(params);
                        }}/>;
                    case "cancelled":
                        return <MatchCancelledContent
                            reselect={() => {
                                setClosedType("finding");
                            }}
                            canceledIn={passed}
                        />;
                    case "joined":
                        return <JoinedMatchContent 
                            cancel={() => {
                                setClosedType("cancelled");
                            }}
                            name1={matchingState.info?.myName ?? ""}
                            name2={matchingState.info?.partnerName ??""}
                        />;
                }
            case 'matching':
                return <MatchingInProgressContent 
                    cancelMatch={() => {
                        setClosedType("cancelled");
                        matchingState.cancel();
                        pauseTimer();
                    }}
                    timePassed={passed}
                />;
            case 'cancelling':
                return <MatchingInProgressContent cancelMatch={() => {}} timePassed={passed}/>;
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
                    name1={matchingState.info.myName}
                    name2={matchingState.info.partnerName}
                    joiningIn={totalSeconds}
                    />
            case 'timeout':
                return <MatchNotFoundContent reselect={matchingState.ok} timedOutIn={passed}/>;
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
            <Form<MatchParams> 
                name="match"
                onFinish={startMatch}
                initialValues={{
                    topics: [],
                    difficulties: [],
                }}>
                {renderModalContent()}
            </Form>
            {isClosable && (
                <button className="close-button" onClick={close}>Close</button>
            )}
        </Modal>
    )
}

export default MatchingModal;
