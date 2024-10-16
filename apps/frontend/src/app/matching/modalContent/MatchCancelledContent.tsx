import React, { useState } from 'react';
import { 
    Modal,
    Tag,
    Select,
    Space,
    Avatar,
 } from 'antd';
import {
    LoadingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    DifficultyOption,
    CategoriesOption,
} from '@/utils/SelectOptions';
import type { SelectProps } from 'antd';
import 'typeface-montserrat';
import './styles.scss';
import { handleReselectMatchOptions, handleRetryMatch } from '../handlers';
import { formatTime } from '@/utils/DateTime';

const MatchCancelledContent: React.FC = () => {
    return (
        <div className="match-cancelled-content">
            <div className="cancel-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg"
                    height="24px" 
                    viewBox="0 -960 960 960" 
                    width="24px"
                    fill="#e8eaed"
                    className="cancel-icon"
                >
                    <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
            </div>
            <div className="match-status-label">Match Cancelled!</div>
            <div className="match-status-message">
                Your match request has been cancelled after waiting {formatTime(83)}
            </div>
            <button className="retry-match-button"
                onClick={() => handleRetryMatch()}
            >
                Retry
            </button>
            <button className="reselect-match-options-button"
                onClick={() => handleReselectMatchOptions()}
            >
                Reselect Options
            </button>
        </div>
    )
}

export default MatchCancelledContent;
