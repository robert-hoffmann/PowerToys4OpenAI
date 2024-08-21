/**
 * Profiles as stored in the Database
 */
export interface IDBProfile {
  id?          : number,
  title        : string,
  description  : string,
  tags         : string[]
  content      : string,
  icon?        : string,
  isUserPrompt : number,
  selected     : number
}
