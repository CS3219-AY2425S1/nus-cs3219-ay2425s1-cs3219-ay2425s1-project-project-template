import * as React from 'react'

function EndIcon(props) {
    return (
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M8 13.478v-.616s0-1.466 4-1.466 4 1.466 4 1.466v.388c0 .956.723 1.77 1.7 1.912l2 .294c1.21.177 2.3-.73 2.3-1.913v-2.125c0-.587-.184-1.164-.63-1.562C20.23 8.837 17.42 7 12 7c-5.749 0-8.56 2.583-9.56 3.789-.315.381-.44.864-.44 1.352v1.923c0 1.298 1.296 2.228 2.58 1.852l2-.587c.843-.247 1.42-.998 1.42-1.85z"
                fill={`${props.fill} || #1C274C`}
            />
        </svg>
    )
}

export default EndIcon
