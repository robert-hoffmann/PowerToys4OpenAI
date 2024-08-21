/**
 * Settings stored in IndexedDB
 */
export interface IUserSettings {
  id          : number,
  triggerMode : number,
  darkMode    : boolean,
  apiKey?     : string,
  licenseKey? : string,
  showSidebar?: boolean,
  model?      : IGPTModel
}

export interface IGPTModel {
  label    : string,
  value    : string,
  maxTokens: number,
  pricing: {
    prompt     : number,
    completion : number
  }
}
