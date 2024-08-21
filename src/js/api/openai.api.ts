import { fetchSSE } from '../libs/fetch-sse';
import { IPTResult } from '../libs/types/IGPTResponse';
import { IPTChatMessages } from '../libs/types/IPTChatRequest';
import { db } from '../controllers/dbController';
class OpenAi {
  constructor() {
    // do something
  }

  // TODO: session status can be 200, yet content is empty: handle this case
  // https://chat.openai.com/api/auth/session
  async getSession() {
    //console.log('openai.api.getSession()');

    // try to get settings from database
    return await db.getUserSettings().then((data) => {
      //console.log('getSession()::getUserSettings()', data);

      if (data.apiKey) {
        return {
          error  : false,
          status : 200,
          content: {
            accessToken: data.apiKey
          }
        }
      }
      else {
        return {
          error  : true,
          status : 401,
          content: {
            accessToken: '',
            message    : 'No API key found'
          }
        }
      }
    });
  }

  async getAnswerStreamed(
    messages   : IPTChatMessages[],
    accessToken: string,
    abortSignal: AbortSignal,
    callBack   : (response: IPTResult) => void
  ) {
    console.log('openai.api.getAnswerStreamed()');

    // https://platform.openai.com/docs/api-reference/completions/create
    // TODO: add dynamic question prefix/suffix

    const userSettings = await db.getUserSettings();
    //console.log('getAnswerStreamed::userSettings', userSettings);

    const api = {
      'model'       : userSettings.model?.value || 'gpt-3.5-turbo',
      'messages'    : messages,
      'temperature' : 1,
      'stream'      : true
    }

    //console.log('getAnswerStreamed', api);

    const requestOptions = {
      signal : abortSignal,
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(api),
      onMessage(message: IPTResult) {
        //console.log('onMessage', message);
        callBack(message)
      },
    };

    try {
      await fetchSSE('https://api.openai.com/v1/chat/completions', requestOptions);
    } catch (error) {
      console.log('getAnswerStreamed error', error);
    }
  }
}

export const openAi = new OpenAi();
