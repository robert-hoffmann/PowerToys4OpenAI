export interface IPTChatRequest {
	model              : string,
	messages           : IPTChatMessages,
  temperature?       : number,
	top_p?             : number,
	n?                 : number,
	stream?            : boolean,
	stop?              : string | string[],
	max_tokens?        : number,
	presence_penalty?  : number,
	frequency_penalty? : number,
	logit_bias?        : object,
	user?              : string
}

export interface IPTChatMessages {
  role   : 'system' | 'assistant' | 'user',
  content: string
}
