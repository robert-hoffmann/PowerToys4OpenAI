/**
 * Final message sent back to UI backend (internal)
 */
export interface IPTResult {
  error     : boolean,
  status    : number,
  message   : string | null,
  response  : IOAIStreamedResponse | null,
}

/**
 * Streaming response format (from OpenAI)
 */
export interface IOAIStreamedResponse {
  id     : string,
  model  : string,
  created: number,
  choices: {
    index         : number,
    delta         : IOAIResponseMessage,
    finish_reason : null | 'stop',
  }[]
}

export interface IOAIResponseMessage {
  role?   : 'system' | 'assistant' | 'user',
  content?: string,
}
