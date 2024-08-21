import { IPTChatMessages } from './IPTChatRequest';

/**
 * Conversations as stored in the Database
 */
export interface IDBConversation {
  id?         : number,
  timestamp   : number,
  title       : string,
  conversation: IPTChatMessages[],
  profileId   : number
}
