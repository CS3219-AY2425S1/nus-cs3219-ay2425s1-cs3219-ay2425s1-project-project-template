import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import 'typeface-montserrat';
import './styles.scss';
import { handleCancelMatch } from '../handlers';
import {formatTime} from '@/utils/DateTime';

const MatchingInProgressContent: React.FC = () => {
    return (
        <div className="matching-in-progess-content">
            <LoadingOutlined className="loading-icon"/>
            <div className="match-status-label">Matching in Progress</div>
            <div className="match-status-message">
                Please be patient as we match you with other online users<br/><br/>
                {formatTime(83)}
            </div>
            <button className="cancel-match-button"
                onClick={() => handleCancelMatch()}
            >
                Cancel
            </button>
        </div>
    )
}

export default MatchingInProgressContent;
