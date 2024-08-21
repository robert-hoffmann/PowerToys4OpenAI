// We create a new folder + file:
// src-bex/dom/detect-quasar.js
// https://quasar.dev/quasar-cli-vite/developing-browser-extensions/dom-script
import { BexBridge } from '@quasar/app-vite/types/bex';

//#region --------------------------- Behavioral Modules ---------------------------
function main(bridge: BexBridge) {

  function displayContextMenu(e: MouseEvent) {
    //console.log('displayContextMenu', e.target);

    // ctrl is not pressed, do not open context menu
    if (!e.ctrlKey) {
      return;
    }
    e.preventDefault();

    // get existing context menu
    let contextMenu = document.getElementById('ptoia-context-menu');

    // create context menu if it does not exist
    if (contextMenu === null) {
      contextMenu    = document.createElement('div');
      contextMenu.id = 'ptoia-context-menu';
      contextMenu.classList.add('ptoia-context-menu');

      contextMenu.addEventListener('click', (ev: MouseEvent) => {
        //console.log('contextMenu click', ev);

        bridge.send('content::context-action', { clientX: ev.clientX, clientY: ev.clientY })
        .then((response) => {
          console.log({
            file  : 'contentClick.ts',
            method: {
              name: 'content::context-action',
              type: 'send'
            },
            result: response
          });
        });
      });

      contextMenu.addEventListener('click', (ev: MouseEvent) => {
        const target = ev.target as HTMLElement;

        target.style.display = 'none';
        //console.log('target', target.dataset.action);
        getSelectedText(ev);
      });

      document.body.appendChild(contextMenu);
    }

    function populateContextMenu(menu: HTMLElement) {
      menu.innerHTML = '';

      actions.forEach((action) => {
        const item = document.createElement('div');
        item.dataset.action = action.action;

        item.innerText = action.name;
        item.classList.add('ptoia-context-menu-item');

        menu.appendChild(item)
      });
    }

    // display
    populateContextMenu(contextMenu);
    contextMenu.style.display = 'block';
    contextMenu.style.top     = `${e.pageY}px`;
    contextMenu.style.left    = `${e.pageX}px`;

  }

  function detectKeyDown(e: KeyboardEvent) {
    //console.log('detectKeyDown', e);

    if (e.key === 'Escape') {
      const contextMenu = document.getElementById('ptoia-context-menu');
      if (contextMenu !== null) {
        contextMenu.style.display = 'none';
      }
    }
  }

  // may want to use this to manipulmate the DOM
  function detectClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    //console.log('detectClick', e.target);

    // dont close if we click on the context menu
    if (target.closest('.ptoia-context-menu') !== null) {
      return;
    }

    const contextMenu = document.getElementById('ptoia-context-menu');
    if (contextMenu !== null) {


      contextMenu.style.display = 'none';
    }
  }


  function getSelectedText(e: MouseEvent) {
    const selectedText = window.getSelection()?.toString();

    if (!!selectedText) {
      //console.log('getSelectedText', selectedText);
    }
  }

  // bind context
  document.addEventListener('contextmenu', (e: MouseEvent)    => displayContextMenu(e));
  //document.addEventListener('mouseup'    , (e: MouseEvent)    => getSelectedText(e));
  document.addEventListener('click'  , (e: MouseEvent)    => detectClick(e));
  document.addEventListener('keydown', (e: KeyboardEvent) => detectKeyDown(e));
}
//#endregion ------------------------ Behavioral Modules ---------------------------

const actions = [
  {
    name   : 'getTargetText',
    action : 'getTargetText'
  },
  {
    name   : 'action2',
    action : 'action2'
  },
  {
    name   : 'action3',
    action : 'action3'
  },
  {
    name   : 'action4',
    action : 'action4'
  }
];


// Export module
export default function contextMenu(bridge: BexBridge) {
  main(bridge);
}
