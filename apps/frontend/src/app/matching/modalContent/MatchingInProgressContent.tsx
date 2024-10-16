import React, { useState } from 'react';
import { 
    Modal,
    Tag,
    Select,
    Space,
 } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
    DifficultyOption,
    CategoriesOption,
} from '@/utils/SelectOptions';
import type { SelectProps } from 'antd';
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
