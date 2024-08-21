/**
 * INFO: This is the background script for the extension.
 *
 * It's loaded once when the extension is installed.
 * It has access to the chrome.* APIs.
 *
 */
import { bexBackground } from 'quasar/wrappers';
import { BexBridge } from '@quasar/app-vite/types/bex';
import { openAi } from 'src/js/api/openai.api';

import { db } from 'src/js/controllers/dbController';
import defaultProfiles from 'src/js/data/default-profiles.json';

// Used to cancel the Fetch request if the user closes the popup.
// https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
let controller: AbortController | null = null;

chrome.runtime.onInstalled.addListener((details) => {
  // open options on first install
  if (details.reason === 'install') {
    // open settings
    chrome.runtime.openOptionsPage();

    // load defaults
    loadDefaults();
  }

  // open when updated
  if(details.reason === 'update') {
    // show changelog
    chrome.tabs.create({url: 'https://github.com/robert-hoffmann/PowerToys4OpenAI/blob/main/CHANGELOG.md'});

    // load defaults
    loadDefaults();
  }
});

// Opend feedback URL on extension uninstall
chrome.runtime.setUninstallURL('https://airtable.com/shrqYoLYGNPzqUHMD');

/* INFO: this can reload the extension if there is an update
chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload();
});
*/

chrome.action.onClicked.addListener((/* tab */) => {
  // Opens the chat interface in a new tab.
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL('www/index.html#/index'),
    },
    (/* newTab */) => {
      // Tab opened.
    }
  );
});

/**
 * Insert default settings into the database
 */
async function loadDefaults() {
  const profiles = await db.getProfiles();

  if (!profiles.length) {
    db.insertProfiles(defaultProfiles);
  }

  //console.log('background.loadDefaults()', profiles);
}

/**
 * Send userSettings to the content script
 * @param bridge
 */
async function sendSettingsToContent(bridge: BexBridge) {
  const settings = await db.getUserSettings();
  //console.log('background.sendSettingsToContent()', settings);
  bridge.send('background.ready', {
    settings: settings,
  });
}

declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log    : [{ message: string; data?: any[] }, never];
    getTime: [never, number];

    'storage.get'   : [{ key: string | null }, any];
    'storage.set'   : [{ key: string; value: any }, any];
    'storage.remove': [{ key: string }, any];
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

export default bexBackground((bridge: BexBridge /* , allActiveConnections */) => {
  //console.log('LOADING:', Date.now(), 'background.ts::bexBackground');

  //#region Quasar Bridge
  bridge.on('log', ({ data, respond }) => {
    console.log(`[BEX] ${data.message}`, ...(data.data || []));
    respond();
  });

  bridge.on('storage.get', ({ data, respond }) => {
    const { key } = data;
    if (key === null) {
      chrome.storage.local.get(null, (items) => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        respond(Object.values(items));
      });
    } else {
      chrome.storage.local.get([key], (items) => {
        respond(items[key]);
      });
    }
  });
  // Usage:
  // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  bridge.on('storage.set', ({ data, respond }) => {
    chrome.storage.local.set({ [data.key]: data.value }, () => {
      respond();
    });
  });
  // Usage:
  // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  bridge.on('storage.remove', ({ data, respond }) => {
    chrome.storage.local.remove(data.key, () => {
      respond();
    });
  });
  // Usage:
  // await bridge.send('storage.remove', { key: 'someKey' })
  //#endregion

  //#region ----------------------- OpenAI -----------------------
  /**
   * @description Get the answer from OpenAI
   */
  bridge.on('background.getAnswer', async ({ data /*, respond */ }) => {
    console.log('background.getAnswer');

    const session = await openAi.getSession();
    if (session.error) {
      console.log('session error', session);
      bridge.send(data.replyTo, { response: session, context: data.context });
      //respond(session);
      return;
    }

    controller = new AbortController();
    await openAi.getAnswerStreamed(
      data.messages,
      session.content.accessToken,
      controller.signal,
      (response) => {
        //console.log('background.getAnswer response', response);
        //respond(response);
        bridge.send(data.replyTo, { response: response, context: data.context });
      }
    );
  });

  bridge.on('background.cancelAnswer', async ({ data, respond }) => {
    controller?.abort();
    respond(data);
  });

  bridge.on('background.openTabUrl', ({ data, respond }) => {
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL(`www/index.html#${data.url}`)
      },
      (/*newTab*/) => {
        // Tab opened
        // do something with it (cross tab messaging ?)
        //console.log('background.openTabUrl', data);

        // TODO: this works, but we need a better system that takes into account the asynchronous nature of this
        if (data.content) {
          setTimeout(() => {
            bridge.send('background.selectedText', data.content);
          }, 1000);
        }
      }
    );

    respond(data);
  });

  /**
   * @description Send a notification to the user via Chrome's built-in notification system
   * @param {object} { data.title, data.message, data.icon }
   */
  bridge.on('background.displayNotification', ({ data }) => {
    chrome.notifications.create('', {
      title   : data.title,
      message : data.message,
      iconUrl : data.icon ? data.icon : 'www/logo.png',
      silent  : true,
      type    : 'basic'
    });
  });

  // TODO we need a wrapper that can pass trhough background and back to content
  // https://quasar.dev/quasar-cli-vite/developing-browser-extensions/bex-communication#communication-rules
  /*
  bridge.on('background.proxyEvent', ({ data }) => {
    bridge.send(data.destination, {
      payload: data.payload,
      replyTo: data.replyTo
    });
  });
  */

  sendSettingsToContent(bridge);
  //#endregion -------------------- OpenAI -----------------------
});
