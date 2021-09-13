import { PubSub } from 'apollo-server';

import * as MESSAGE_EVENTS from './api/message/message.subscription';

export const EVENTS = {
    MESSAGE: MESSAGE_EVENTS,
};

export default new PubSub();
