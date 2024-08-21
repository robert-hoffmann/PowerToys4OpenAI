// We create a new folder + file:
// src-bex/dom/detect-quasar.js
// https://quasar.dev/quasar-cli-vite/developing-browser-extensions/dom-script
import { BexBridge } from '@quasar/app-vite/types/bex';
import { useDebounceFn } from '@vueuse/core';
import { config, Configuration } from '../libs/sites-detection';
import { IUserSettings } from 'src/js/libs/types/IUserSettings';

//console.log('iframeComponent.ts');

const
component             = document.createElement('div'),
iFrame                = document.createElement('iframe'),
defaulContainerHeight = '56px',
defaulContainerWidth  = '370px';

let selectedText = '';

/**
* Set the height of our container housing our BEX
* @param height
*/
const setContainerHeight = (height: string) => {
  component.style.height = `${height}px`;
}

/**
 * The code below will get everything going. Initialize the iFrame with defaults and add it to the page.
 * @type {string}
 */
component.id = 'ptoia-companion-container';
iFrame.allow = 'clipboard-write';

// Default settings for container
Object.assign(component.style, {
  overflow: 'hidden',
  height  : defaulContainerHeight,
  width   : defaulContainerWidth,
});

// Default settings for Iframe
Object.assign(iFrame.style, {
  overflow: 'hidden',
  height  : '100%',
  width   : '100%',
  border  : '0'
});

/**
 * This is a workaround to events triggering multiple times
 */
const toggleCompanion = useDebounceFn(() => {
  component.classList.toggle('ptoia-sidebar-closed');
}, 250);

/**
 * Inject a module into the DOM
 */
function injectContentModule(bridge: BexBridge, configuration: Configuration, asSidebar: boolean) {
  //console.log('injectContentModule::content.ts', configuration);

  // INFO: find the element we want to append to
  let container: Element | undefined;
  configuration.containers.forEach((selector) => {
    const element = document.querySelector(selector);

    if (element) {
      container = element;
      return;
    }
  });

  if (container) {
    // INFO: Wrap in shadow DOM to prevent CSS conflicts
    // Also keeps certain sites from blocking iframes
    // https://stackoverflow.com/a/67613697/896849

    // BUG: was having random this error randomly
    // Shadow root cannot be created on a host which already hosts a shadow tree
    // So for now, just wrapping in a try/catch
    try {
      const shadowDom = component.attachShadow({ mode:'closed' });
      shadowDom.appendChild(iFrame);
    } catch (e) {
      console.error('Error attaching shadow DOM', e);
      // could not attach to shadow DOM, so just append it to the container...
      component.appendChild(iFrame);
    }

    // When the page loads, insert our browser extension app.
    iFrame.src = chrome.runtime.getURL('www/index.html#/search-companion');

    // -------------------------------------------------------------------

    // append or prepend the container to the page
    container[configuration.method](component);

    // Add any classes to the container if needed
    if (configuration.classes) {
      configuration.classes.forEach((className) => {
        component.classList.add(className);
      });
    }

    // Apply any styles to the container if needed
    if (configuration.styles) {
      configuration.styles.forEach((style) => {
        //console.log('style', style);

        const styleName : string = Object.entries(style)[0][0];
        const styleValue: string = Object.entries(style)[0][1];
        component.style[styleName] = styleValue;
      });
    }

    // if we should display as a sidebar (starts in closed position)
    if (asSidebar) {
      component.classList.add('ptoia-sidebar-closed');
    }

    let prompt = '';
    if (configuration.userInputs) {
      // Get the user input
      configuration.userInputs.forEach((selector) => {
        const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);

        // if we find a match, assign it and break out of the loop
        if (input) {
          prompt = input?.value || '';
          return;
        }
      });
    }

    // INFO: listen for page ready
    bridge.on('content.pageReady', () => {
      // Set the value of the user input, to the SearchCompanion input field
      bridge.send('page.searchCompanion.initialize', {
        prompt : prompt    || '',
        sidebar: asSidebar || false,
      });
    });
  }
}

//#region --------------------------- Behavioral Modules ---------------------------
function main(bridge: BexBridge, settings: IUserSettings) {
  // see if the site we are on is in our list of supported sites
  const website = config.find((item) => {
    const match = window.location.href.match(item.url);
    return match && match[1];
  });

  //console.log('website', website);

  // only insert content on supported websites
  if (website) {
    //console.log('we found a URL match', website);

    // Attach a listener to open the Conversation Manager when the user presses Alt+C
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.altKey && event.code === 'KeyC') {
        bridge.send('background.openTabUrl',
          {
            url    : '/index',
            content: selectedText
          }
        );
      }
    });

    // attach an event listener to see if text has been selected
    // INFO: ask GPT about: Selection API (and an event listener example)
    document.addEventListener('mouseup', (/* event */) => {
      selectedText = window.getSelection()?.toString() || '';

      if (selectedText !== '') {
        //console.log('Text has been selected: ' + selectedText, event);
        // do something with the selected text
      }
    });

    // loop over all posssible targets
    const configuration = website.targets.find((target) => {
      // loop over all possible containers
      const container = target.containers.find((selector) => {
        return document.querySelector(selector);
      });

      // if we have a container to attach to for this target, return the target
      if (container) {
        return target;
      }
    });

    if (configuration) {
      //console.log('website.addSidebar'  , website.addSidebar);
      //console.log('settings.showSidebar', settings.showSidebar);

      // Dont add sidebar if user has it disabled
      if (website.addSidebar == true && settings.showSidebar == false) {
        // just exit and add nothing
        return;
      }

      // inject module if we found a match
      injectContentModule(bridge, configuration, website.addSidebar);
    }
  }
}
//#endregion ------------------------ Behavioral Modules ---------------------------
// Export module
export default function iframe(bridge: BexBridge, settings: IUserSettings) {
  //console.log('LOADING:', Date.now(), 'iframeComponent.export');

  main(bridge, settings);

  bridge.on('content.onResize', async ({ data }) => {
    //console.log('content.onResize', data);
    setContainerHeight(data.height);
  });

  // INFO: Event when the sidebar should be shown/hidden
  bridge.on('content.toggleCompanion', async () => {
    // INFO: This is a workaround to events triggering multiple times
    toggleCompanion();
  });

  bridge.on('content.scrollToTop', () => {
    window.scrollTo(0, 0);
  });

  bridge.on('content.copyToClipboard', ({ data }) => {
    //console.log('content.copyToClipboard', data);
    navigator.clipboard.writeText(data || '');
  });
}
