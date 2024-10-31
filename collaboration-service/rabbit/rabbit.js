const amqp = require('amqplib');

const REQUEST_EXCHANGE = 'REQUEST-EXCHANGE'
const RESULT_EXCHANGE = 'RESULT-EXCHANGE'

const MATCH_REQUEST_QUEUE = 'MATCH-REQUEST-QUEUE'
const MATCH_RESULT_QUEUE = 'MATCH-RESULT-QUEUE'
const MATCH_REQUEST_ROUTING = 'MATCH-REQUEST-ROUTING'
const MATCH_RESULT_ROUTING = 'MATCH-RESULT-ROUTING'

const CANCEL_REQUEST_QUEUE = 'CANCEL-REQUEST-QUEUE'
const CANCEL_RESULT_QUEUE = 'CANCEL-RESULT-QUEUE'
const CANCEL_REQUEST_ROUTING = 'CANCEL-REQUEST-ROUTING'
const CANCEL_RESULT_ROUTING = 'CANCEL-RESULT-ROUTING'

const MATCH_TO_QUESTION_QUEUE = 'MATCH-TO-QUESTION-QUEUE'
const MATCH_TO_QUESTION_ROUTING = 'MATCH-TO-QUESTION-ROUTING'