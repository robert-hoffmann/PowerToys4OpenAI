// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
import { bexContent } from 'quasar/wrappers';
import { BexBridge } from '@quasar/app-vite/types/bex';

import { IUserSettings } from 'src/js/libs/types/IUserSettings';

// Import Modules
import iframe from './modules/iframeComponent';
//import contextMenu from './modules/contextMenuComponent';

/**
 * Initialize the content script
 */
function main(bridge: BexBridge, settings: IUserSettings) {
  /**
   * Initialize Modules (loaded above)
   */
  //contextMenu(bridge);
  iframe(bridge, settings);
}

/**
 * This is the main entry point for the BEX Content Script.
 */
// BUG: This loads as many times as the page is refreshed !!!
// Warning: This will bind multiple times, fix it, or unbind before binding
export default bexContent(async (bridge: BexBridge) => {
  //console.log('LOADING:', Date.now(), 'content.ts::bexContent');

  // INFO: Fires when the background is ready, and sets userSettings from Database
  // Seems to still work, even though using once() instead of on() : mayber should use this elsewhere to prevent those double loads ?
  bridge.once('background.ready', async ({ data }) => {
    //console.log('background.ready in content', data);

    main(bridge, data.settings);
  });

});
