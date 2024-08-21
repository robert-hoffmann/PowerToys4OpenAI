<template>
  <q-page>
    <div class="row items-center">

      <div class="col col-4-lg q-pa-md">
        <span id="sidebar-button" class="bg-secondary" @click="toggleCompanion()"></span>
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-1">
                <q-icon
                  name="img:/icons/icon-48x48.png"
                  size="sm"
                  class="cursor-pointer"
                  @click="displayRoute('/index')"
                />
              </div>
              <div class="col">
                <div class="q-ml-sm q-mb-none" style="text-decoration: underline">
                  {{ t(translation.searchCompanion.title) }}
                </div>
                <div class="q-ml-sm q-mt-none text-caption">
                  <small>({{ profile?.title ? profile.title : t(translation.global.missing) }})</small>
                </div>
              </div>

              <div class="col-1">
                <q-btn
                  v-if="displaySearchBox"
                  @click="openConversation()"
                  icon="launch"
                  size="xs"
                  round
                  flat
                />
              </div>

              <div class="col-1">
                <q-btn
                  :title="t(translation.global.settings)"
                  @click="displayRoute('/index/settings/search')"
                  icon="settings"
                  size="xs"
                  round
                  flat
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row" v-if="responseRaw">
          <div class="col q-mt-md">
            <span id="gpt-answer" v-html="response"></span>
          </div>
        </div>

        <div class="row text-center" v-if="displayLoadingSpinner">
          <div class="col q-mt-md">
            <q-spinner-tail
              color="black"
              size="2em"
            />
          </div>
        </div>

        <div class="row text-center" v-if="displaySearchBox">
          <div class="col q-mt-md">
            <q-input
              color="secondary"
              bottom-slots
              v-model="prompt.curentValue"
              :label="t(translation.searchCompanion.search)"
              counter
              dense
              outlined
              :autogrow="promptTokenCount < 150 ? true : false"
              :type="promptTokenCount < 150 ? 'text' : 'textarea'"
              @keydown.enter.ctrl="search(true)"
            >
              <template v-slot:after>
                <q-icon
                  :title="t(translation.searchCompanion.search)"
                  name="send"
                  class="cursor-pointer"
                  @click="search(true)"
                />
              </template>

              <template v-slot:hint>
                {{ t(translation.searchCompanion.searchHint) }}
              </template>

              <template v-slot:counter>
                  {{ promptTokenCount }}
              </template>
            </q-input>
          </div>
        </div>

        <div class="row text-center" v-if="displaySettingsButton">
          <div class="col q-mt-md">
            <q-btn
              color="black"
              icon="settings"
              :label="t(translation.global.settings)"
              @click="displayRoute('/index/settings/search')"
              outline
            />
          </div>
        </div>

        <div class="row text-center" v-if="displayRetryButton">
          <div class="col q-mt-md">
            <q-btn
              color="black"
              icon="cloud_off"
              :label="t(translation.global.retry)"
              @click="retry()"
              target="_blank"
              outline
            />
          </div>
        </div>

        <div class="row text-center" v-if="listenForResponse">
          <div class="col q-mt-md">
            <q-btn
              color="black"
              icon="cloud_off"
              :label="t(translation.global.cancel)"
              @click="cancel()"
              target="_blank"
              outline
            />
          </div>
        </div>

        <div class="row">
          <div class="col q-mt-md text-left" v-if="displaySearchBox">
            <small class="text-grey" :title="tokenHistoryPrice">{{conversationTokenCount}}/{{ settings.model?.maxTokens || 4096 }} <i>tokens</i></small>
          </div>
          <div class="col q-mt-md text-right" v-if="responseRaw && displaySearchBox">

            <q-btn
              :title="t(translation.searchCompanion.clear)"
              @click="clearConversation()"
              icon="delete_outline"
              size="sm"
              flat
            />
            <q-btn
              :title="t(translation.global.copy)"
              @click="copyResult()"
              icon="content_copy"
              size="sm"
              flat
            />
          </div>
        </div>

      </div>

      <q-resize-observer
        debounce="50"
        @resize="onResize"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, onMounted, computed, toRaw } from 'vue';
import { useQuasar } from 'quasar';
import MarkdownIt from 'markdown-it';

import { useTranslation } from 'i18next-vue';
import { translation } from 'src/i18n/types';

import { db } from 'src/js/controllers/dbController';
import { IPTResult } from 'src/js/libs/types/IGPTResponse';
import { IPTChatMessages } from 'src/js/libs/types/IPTChatRequest';
import { IDBProfile } from 'src/js/libs/types/IDBProfile';
import { IDBConversation } from 'src/js/libs/types/IDBConversation';

import { endsWithQuestionMark, getTokenCount } from 'src/js/libs/helpers';
import { IUserSettings } from 'src/js/libs/types/IUserSettings';
import { triggerMode } from 'src/js/data/triggerMode';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const $q    = useQuasar();
const { t } = useTranslation();

const markdown = new MarkdownIt({
  linkify: true
});

const prompt = ref({
  curentValue  : '',
  previousValue: ''
});

const settings = ref({} as IUserSettings);

const displayLoadingSpinner  = ref(false);
const displayRetryButton     = ref(false);

const listenForResponse     = ref(false);
const displaySearchBox      = ref(true);
const displaySettingsButton = ref(false);

// pricing does not work properly when set to shallowRef
const messages = ref<IPTChatMessages[]>([
  {
    role   : 'system',
    content: 'Reply with markdown where appropriate.'
  }
]);

const profile     = ref<IDBProfile>();
const responseRaw = ref('');
const response    = computed<string>(() => {
  return markdown.render(responseRaw.value);
});

// compute the current total token length of the conversation
const promptTokenCount = computed<number>(() => {
  // let's not add stuff up untill we actually want to show it
  if (!prompt.value.curentValue) {
    return 0;
  }

  return getTokenCount(prompt.value.curentValue);
});

// compute the current total token length of the conversation
const conversationTokenCount = computed<number>(() => {
  // let's not add stuff up untill we actually want to show it
  if (!displaySearchBox.value || messages.value.length < 2) {
    return 0;
  }

  let conversation = '';
  messages.value.forEach((message) => {
    conversation += message.content;
  });

  return getTokenCount(conversation);
});

const tokenHistoryPrice = computed<string>(() => {
  if (conversationTokenCount.value === 0) {
    return '$0.00';
  }

  const price = settings.value.model?.pricing.completion || 0.002;
  return `$${((conversationTokenCount.value/1000)*price).toFixed(5)}`;
});
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
/**
 * Used to open a new tab with the given route
 * @param route
 */
function displayRoute(route: string) {
  $q.bex
    .send('background.openTabUrl', { url: route })
    .then((/*res*/) => {
      //console.log('response:background.openTabUrl', res);
    }
  )
}

/**
 * Used to copy current result to clipboard
 */
function copyResult() {
  $q.bex.send('content.copyToClipboard', responseRaw.value || '');
  $q.bex.send('background.displayNotification', {
    title  : t(translation.searchCompanion.title),
    message: t(translation.global.copiedToClipBoard)
  });
}

function onResize (size: {
  width : number,
  height: number
}
) {
  $q.bex.send('content.onResize', size);
}

function retry() {
  displayRetryButton.value  = false;
  search(true);
}

async function search(force: boolean) {
  if (prompt.value.curentValue === '') {
    return;
  }

  if (!force && settings.value.triggerMode === triggerMode.QUESTION && !endsWithQuestionMark(prompt.value.curentValue))
  {
      //console.log('no question mark, no answer');
      displaySearchBox.value = true;
      return;
  }

  // remove question mark, and any unneeded spaces if present
  if (endsWithQuestionMark(prompt.value.curentValue)) {
    prompt.value.curentValue = prompt.value.curentValue.slice(0, -1).trim();
  }

  listenForResponse.value     = true;
  displayLoadingSpinner.value = true;
  displaySearchBox.value      = false;
  displayRetryButton.value    = false;

  prompt.value.previousValue  = prompt.value.curentValue;
  messages.value.push({
    'role'    : 'user',
    'content' : prompt.value.previousValue
  });

  prompt.value.curentValue = '';
  responseRaw.value        = '';

  // TODO: make into a real search function
  $q.bex.send('background.getAnswer', {
    messages: messages.value,
    replyTo : 'content.result.stream'
  })
  .then((result) => {
      if (result.data.error) {
        $q.bex.send('content.result.stream', result.data.error);
      }
  });

  $q.bex.send('content.scrollToTop');
}

/**
 * Clear the current conversation
 */
function clearConversation() {
  //console.log(messages);

  // remove all messages except the system message
  messages.value.splice(1, messages.value.length);
  prompt.value.curentValue = '';
  responseRaw.value        = '';

  $q.bex.send('content.scrollToTop');

  //console.log(messages);
}

/**
 * Open the conversation in the conversation manager
 */
async function openConversation() {
  // only save if there is more than one message
  if (messages.value.length > 1) {
    const conversation: IDBConversation = {
      timestamp    : Date.now(),
      title        : messages.value[1].content.substring(0, 30) + '...' || 'untitled',
      conversation : toRaw(messages.value),
      // TODO: set this to an actual value
      profileId    : profile.value?.id || 1
    };

    const result = await db.saveConversation(conversation);

    clearConversation();
    displayRoute(`/index/conversations/${result}`);
    return;
  }

  displayRoute('/index');
}

/**
 * Cancel the current search result, event in progress
 */
function cancel() {
  $q.bex
  .send('background.cancelAnswer')
  .then(() => {
    clearConversation();

    // TODO: should be way cleaner to toggle these different display states
    displaySearchBox.value      = true;
    displaySettingsButton.value = false;
    displayLoadingSpinner.value = false;
    displayRetryButton.value    = false;
  });
}

/**
 * Toggle the side companion panel on or off
 */
function toggleCompanion() {
  //console.log('companionPage.toggleCompanion');
  $q.bex.send('content.toggleCompanion');
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
// INFO: displays streamed result
$q.bex.on('content.result.stream', ({ data }) => {
  displayLoadingSpinner.value = false;

  // we are not in listening mode, so return (prevents double display across tabs)
  if (listenForResponse.value == false) {
    return;
  }

  let result: IPTResult = data.response;
  switch (true) {
    // this is the incomming data
    case result.status > 199 && result.status < 400:
      if (result.response?.choices[0].delta.content) {
        responseRaw.value += result.response?.choices[0].delta.content;
      }
      break;

    // Auth problems
    case result.status > 399 && result.status < 500:
      console.log(`error: ${result.status}`);

      responseRaw.value          += t(translation.global.authError, { statusCode: result.status })
      listenForResponse.value     = false;
      displaySettingsButton.value = true;
      break;

    // Errors
    case result.status > 499 && result.status < 600:
      console.log(`error: ${result.status}`);
      responseRaw.value          += t(translation.global.authError, { statusCode: result.status })
      listenForResponse.value     = false;
      displaySettingsButton.value = true;
      break;

    // TODO: Whats this ?
    case result.status === 600:
      console.log(`error: ${result.status}`);

      responseRaw.value      += t(translation.global.authError, { statusCode: result.status })
      listenForResponse.value = false;
      displaySearchBox.value  = true;
      break;

      // this is when we are done ...or use the stop tag
    case result.status === 999:
      //console.log(`DONE: ${data.status}`);

      displaySearchBox.value  = true;
      listenForResponse.value = false;

      // TODO: add to conversation database
      messages.value.push({
        'role'   : 'assistant',
        'content': responseRaw.value
      });

      //console.log(messages);
      break;

    default:
      //console.log(`something else: ${result.status}`);
      displayRetryButton.value = true;
      break;
  }
});

// INFO: This is executed AFTER onMounted()
$q.bex.on('page.searchCompanion.initialize', async ({ data }) => {
  //console.log('page.searchCompanion.onInitialize', data);

  prompt.value.curentValue   = data.prompt;
  prompt.value.previousValue = data.prompt;

  // should we display the toggle button
  if (data.sidebar) {
    document.querySelector('#sidebar-button')?.classList.add('display-button');
  }

  // load profile
  const dbProfile = await db.getActiveProfile();
  if (dbProfile) {
    profile.value             = dbProfile;
    messages.value[0].content = dbProfile.content;
  }

  // load settings
  settings.value = await db.getUserSettings();
  if (!settings.value.apiKey)
  {
      // no api key ...configure it
      displaySettingsButton.value = true;
      displaySearchBox.value      = false;
  }

  search(false);
});

/**
 * Set up the page
 */
onMounted(() => {
  //console.log('LOADING:', Date.now(), 'CompanionPage.onMounted');

  // cancel any outstanding request
  $q.bex
  .send('background.cancelAnswer')
  .then(() => {
    // inform that the page is ready
    $q.bex.send('content.pageReady');
  });

  // https://stackoverflow.com/a/2656798/896849
  let base    = document.createElement('base');
  base.target = '_blank';
  document.head.append(base);
});
//#endregion ------------------------ Lifecycle -------------------------
</script>

<style lang='scss'>
  html, body {
    overflow: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size   : revert;
    font-weight : revert;
    line-height : revert;
  }

  #gpt-answer {
    pre {
      background-color : #000;
      color            : #fff;
      padding          : 10px;
      border-radius    : 5px;
    }

    code {
      white-space: pre-wrap;
      word-break : break-all;
    }

    img {
        max-width: 100%;
      }
  }

  #sidebar-button {
    position      : absolute;
    top           : 25px;
    height        : 75px;
    width         : 8px;
    margin        : 0 0 0 -16px;
    border-radius : 0 8px 8px 0;
    cursor        : pointer;
    display       : none;

    &.display-button {
      display: block;
    }
  }
</style>
