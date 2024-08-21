import { createParser } from 'eventsource-parser';
import { IPTResult, IOAIStreamedResponse } from './types/IGPTResponse';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
async function* streamAsyncIterable(stream: ReadableStream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  }
  catch (error) {
    console.log('streamAsyncIterable::error', error);
  } finally {
    reader.releaseLock();
  }
}

export async function fetchSSE(
  url     : string,
  options : RequestInit & { onMessage: (message: IPTResult) => void }
  ) {
  console.log('fetchSSE');

  const { onMessage, ...requestOptions } = options;
  const resp = await fetch(url, requestOptions);

  if (!resp.ok) {
    // do something
    console.log('fetchSSE::error', resp);
    onMessage({
      error   : true,
      status  : resp.status,
      message : resp.statusText,
      response: null
    });
  }

  const parser = createParser((event) => {
    //console.log('parser', event);
    if (event.type === 'event') {
      if (event.data === '[DONE]') {
        // all done !
        onMessage({
          error   : false,
          status  : 999,
          message: '[DONE]',
          response: null
        });
        return;
      }

      let data: IOAIStreamedResponse;
      try {
        data = JSON.parse(event.data);
        //console.log('streamed reponse', data);
      }
      catch (error) {
        console.log('Error parsing IOAIStreamedResponse json()', error);
        onMessage({
          error   : true,
          status  : resp.status,
          message : `${error}`,
          response: null
        });

        return;
      }

      onMessage({
        error   : false,
        status  : resp.status,
        message : null,
        response: data,
      });
    }
  });

  for await (const chunk of streamAsyncIterable(<ReadableStream>resp.body)) {
    const str = new TextDecoder().decode(chunk);
    parser.feed(str);
  }
}
