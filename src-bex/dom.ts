// https://quasar.dev/quasar-cli-vite/developing-browser-extensions/dom-script
// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
import { bexDom } from 'quasar/wrappers';
// import { BexBridge } from '@quasar/app-vite/types/bex';

// Quasar: internal function
export default bexDom((/* bridge: BexBridge */) => {
  //console.log('LOADING: dom.ts', bridge);
})
