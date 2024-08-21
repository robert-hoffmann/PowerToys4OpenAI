<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-lg-9 col-md-11 col-xs-11 q-pa-md">

        <div class="column no-wrap discussion-container justify-between q-py-md q-ml-lg" style="border: 1px solid #cbcbcb; border-radius: 7px;">

            <div class="q-pa-md" ref="discussion" id="discussion">
              <template v-for="message in conversation.messages" :key="message.guid">
                <q-chat-message
                  v-if="message.role != 'system'"
                  :avatar="message.role == 'user' ? 'avatar.png' : (profile.icon ? profile.icon : 'robot.png')"
                  :stamp="message.timestamp"
                  :text-color="message.role == 'user' ? 'black' : 'white'"
                  :bg-color="message.role == 'user' ? 'amber-7' : 'secondary'"
                  :sent="message.role == 'user' ? true : false"
                >
                <span v-if="message.role == 'user'" class="gpt-prompt">{{ message.rawText }}</span>
                <span v-else class="gpt-answer" v-html="message.formattedText"></span>

                <template v-slot:name>
                  <div v-if="message.role == 'user'">
                    <div><b>{{ t(translation.conversations.me) }}</b></div>
                  </div>
                  <div v-if="message.role == 'assistant'">
                    <div><b>AI</b> ({{ profile.title || t(translation.global.missing) }})</div>
                  </div>
                </template>
                <template v-slot:stamp>
                  <div class="row">
                    <div class="col">
                      {{ message.timestamp }}
                    </div>
                    <div
                      class="col text-right"
                      style="min-width: 250px;"
                    >
                      <span class="cursor-pointer q-mr-sm" :title="t(translation.conversations.wordCount)">{{ message.wordCount }}</span>

                      <q-btn
                        :title="t(translation.global.delete)"
                        @click="deleteResult(message.guid)"
                        icon="delete"
                        size="xs"
                        flat
                        style="max-width: 25px;"
                      />
                      <q-btn
                        :title="t(translation.global.copy)"
                        @click="copyResult(message.rawText)"
                        icon="content_copy"
                        size="xs"
                        flat
                        style="max-width: 25px;"
                      />
                    </div>
                  </div>
                </template>
              </q-chat-message>
              </template>
          </div>

          <div class="q-pa-md">
            <q-input
              ref="inputElement"
              color="secondary"
              bottom-slots
              v-model="prompt"
              :label="t(translation.conversations.inputHint)"
              counter
              dense
              outlined
              autofocus
              @keydown.enter.ctrl="getOpenAIResponse()"
              @focus="scrollToBottom()"
              :loading="waiting"
              :disable="waiting"
              :autogrow="promptTokenCount < 100 ? true : false"
              :type="promptTokenCount < 100 ? 'text' : 'textarea'"
              :rows="promptTokenCount < 100 ? 1 : 6"
            >
              <template v-slot:before>
                <q-icon
                  :class="conversationIsEmpty ? 'cursor-not-allowed' : 'cursor-pointer'"
                  :name="waiting ? 'cancel' : 'save'"
                  :color="waiting || !conversationIsEmpty ? 'secondary' : ''"
                  @click="waiting ? cancel() : saveConversation()"
                  :title="waiting ? t(translation.global.cancel): t(translation.global.save)"
                />
              </template>

              <template v-slot:append>
                <q-icon
                  :name="stt ? 'mic' : 'mic_off'"
                  :color="stt ? 'secondary' : ''"
                  class="cursor-pointer"
                  @click="stt = !stt"
                  :title="t(translation.conversations.sttHint)"
                />
                <!--
                <q-icon
                  :name="tts ? 'volume_up' : 'volume_off'"
                  :color="tts ? 'green-10' : ''"
                  class="cursor-pointer"
                  @click="tts = !tts"
                  :title="t(translation.global.comingSoon)"
                />
                -->
              </template>

              <template v-slot:after>
                <q-icon
                  name="send"
                  class="cursor-pointer"
                  @click="getOpenAIResponse()"
                  :color="prompt.length ? 'secondary' : ''"
                />
              </template>

              <template v-slot:hint>
                <small
                  :class="conversationTokenCount > ((settings.model?.maxTokens || 4096) / 0.8) ? 'text-red text-bold' : 'text-grey'"
                  :title="tokenHistoryPrice">{{conversationTokenCount}}/{{ settings.model?.maxTokens || 4096 }}
                  <i>tokens</i></small
                >
              </template>

              <template v-slot:counter>
                  {{ promptTokenCount }}
              </template>
            </q-input>
          </div>

        </div>

      </div>
    </div>

    <teleport to="body">
      <q-dialog
        :model-value="settingsComponent != null"
        @update:model-value="$router.push('/index')"
        id="settings-dialog"
      >
        <component
          v-if="settingsComponent != null"
          :is="settingsComponent"
        >
        </component>
      </q-dialog>
    </teleport>
  </q-page>
</template>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, shallowRef, watch, onMounted, onBeforeUnmount, inject, computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useThrottleFn, useDebounceFn } from '@vueuse/core';
import { useTimeAgo } from '@vueuse/core';
import { useQuasar } from 'quasar';
import { EventBus } from 'quasar/dist/types/utils';

import { db } from 'src/js/controllers/dbController';
import { IDBConversation } from 'src/js/libs/types/IDBConversation';
import { IPTResult } from 'src/js/libs/types/IGPTResponse';
import { IDBProfile } from 'src/js/libs/types/IDBProfile';
import { IUserSettings } from 'src/js/libs/types/IUserSettings';

import { guid, getFullyQualifiedLanguage } from 'src/js/libs/helpers';
import { speechToText, textToSpeech } from 'src/js/controllers/speechController';

import { getTokenCount, getWordCount } from 'src/js/libs/helpers';
import { translation } from 'src/i18n/types';
import { useTranslation } from 'i18next-vue';
import MarkdownIt from 'markdown-it';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
// https://vuejs.org/guide/components/async.html#basic-usage
const SearchSettingsComponent = defineAsyncComponent(() =>
  import('src/components/SearchSettingsComponent.vue')
);

// https://vuejs.org/guide/components/async.html#basic-usage
const OpenAISettingsComponent = defineAsyncComponent(() =>
  import('src/components/OpenAISettingsComponent.vue')
);

const router = useRouter();
const $q     = useQuasar();
const bus    = inject<EventBus>('bus');
const { t, i18next } = useTranslation();

const markdown = new MarkdownIt({
  linkify: true
});

const props = defineProps({
  settings: {
    type    : String,
    required: false,
    default : null
  },
  conversationId: {
    type    : Number,
    required: false,
    default : null
  }
});

// https://stackoverflow.com/a/67095293/896849
// https://vuejs.org/api/reactivity-advanced.html#shallowref
const settingsComponent = shallowRef();
const settings = ref({} as IUserSettings);

const tts          = ref<boolean>(false);
const stt          = ref<boolean>(false);
const inputElement = ref();
const prompt       = ref('');
const response     = ref<IConversationMessage>();
const discussion   = ref<HTMLDivElement>();
const waiting      = ref<boolean>(false);
const responseRaw  = ref('');
const profile      = ref<IDBProfile>({} as IDBProfile);

// Throttle executes the function (immediately) and at most once every 250ms
// https://vueuse.org/shared/useThrottleFn/
const scrollToBottom = useThrottleFn(() => {
  discussion.value?.scrollTo({
    top     : discussion.value.scrollHeight,
    behavior: 'smooth'
  });
}, 250);

// Debounce executes the function (after) 250ms of inactivity, but at least once every 500ms
// https://vueuse.org/shared/useDebounceFn/
const setFocus = useDebounceFn(() => {
  inputElement.value?.focus();
}, 250, { maxWait: 500 });

interface IConversation {
  id      : number;
  messages: [
    IConversationMessage
  ];
}

interface IConversationMessage {
  guid          : string,
  role          : 'user' | 'assistant' | 'system',
  rawText       : string,
  formattedText : string,
  timestamp     : string,
  wordCount     : number,
}

// TODO: get from profile settings
//const systemPrompt = 'As a college teacher you will answer questions from students in a very easy to understand manner.\nLet’s think step by step.\nReply in the language that questions are asked when possible.\nReply with markdown when appropriate.';
const systemPrompt = 'Reply with markdown when appropriate';
const placeholder  = {
  id      : 0,
  messages: []
};
// INFO: had to use this stupid placeholder here. Cloning the object didn't work (kept refs), and synce using async, Suspense was buggy
const conversation = ref<IConversation>(placeholder as unknown as IConversation);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
/**
 * See if the conversation has any user contributed messages
 */
const conversationIsEmpty = computed<boolean>(() => {
  return conversation.value.messages.filter(m => m.role === 'user').length === 0;
});

// compute the current total token length of the conversation
const promptTokenCount = computed<number>(() => {
  // let's not add stuff up untill we actually want to show it
  if (!prompt.value) {
    return 0;
  }

  return getTokenCount(prompt.value);
});

// compute the current total token length of the conversation
const conversationTokenCount = computed<number>(() => {
  // let's not add stuff up untill we actually want to show it
  if (conversation.value.messages.length < 2) {
    return 0;
  }

  let counter = '';
  conversation.value.messages.forEach((message) => {
    counter += message.rawText;
  });

  return getTokenCount(counter);
});

const tokenHistoryPrice = computed<string>(() => {
  if (conversationTokenCount.value === 0) {
    return '$0.00';
  }

  const price = settings.value.model?.pricing.completion || 0.002;
  return `$${((conversationTokenCount.value/1000)*price).toFixed(5)}`;
});

/**
 * Ask question, send to OpenAI and get answer
 */
function getOpenAIResponse() {
  console.log(new Date())
  if (prompt.value === '') {
    return;
  }

  conversation.value.messages.push({
    guid          : guid(),
    role          : 'user',
    rawText       : prompt.value,
    formattedText : markdown.render(prompt.value),
    timestamp     : useTimeAgo(new Date()),
    wordCount     : getWordCount(prompt.value)
  });

  let messageHistory = mapToOpenAIConversation(conversation.value);
  //console.log('mapToOpenAIConversation', messageHistory);

  // set reference to incomming message
  response.value = {
    guid          : guid(),
    role          : 'assistant',
    rawText       : '',
    formattedText : '',
    timestamp     : useTimeAgo(new Date()),
  };

  // add future response (with reference) to conversation
  conversation.value.messages.push(response.value as IConversationMessage);

  // stop listening
  stt.value = false;

  // show waiting indicator
  waiting.value = true;

  //console.log('getOpenAIResponse', Date.now());

  $q.bex.send('background.getAnswer', {
    messages: messageHistory,
    replyTo : 'ConversationsPage.result.stream'
  })
  .then((result) => {
      if (result.data.error) {
        $q.bex.send('ConversationsPage.result.stream', result.data.error);
      }

    // make sure we are at the bottom
    scrollToBottom();
  });

  // clear prompt
  prompt.value = '';
}

function cancel() {
  $q.bex.send('background.cancelAnswer');
  waiting.value = false;
}

/**
 * Display settings
 * @param type
 */
function displaySettings(type: string) {
  //console.log('displaySettings', type);

  switch (type) {
    case 'openai':
      settingsComponent.value = OpenAISettingsComponent;
      break;

    case 'search':
      settingsComponent.value = SearchSettingsComponent;
      break;

    default:
      settingsComponent.value = null;
  }
}

/**
 * Generate a new empty conversation
 */
async function newConversation() : Promise<IConversation> {
  const result  = await db.getActiveProfile();
  profile.value = result || {} as IDBProfile;

  return {
    messages: [
      {
        guid          : guid(),
        role          : 'system',
        rawText       : result?.content || systemPrompt,
        formattedText : result?.content || systemPrompt,
        timestamp     : useTimeAgo(new Date()),
      },
      {
        guid          : guid(),
        role          : 'assistant',
        rawText       : t(translation.conversations.welcome),
        formattedText : t(translation.conversations.welcome),
        timestamp     : useTimeAgo(new Date()),
      }
    ]
  }
}

/**
 * Load conversation
 * @param conversationId
 */
async function loadConversation(conversationId: number) {
  //console.log('ConversationsPage.loadConversation()', conversationId);

  // turn off STT
  stt.value = false;

  // if we dont have a conversation id, create a new one
  if (!conversationId) {
    conversation.value = await newConversation();
    //console.log('ConversationsPage.loadConversation()', conversation.value);
    return;
  }

  // get conversation from db
  const result = await db.getConversation(conversationId);
  if (result) {
    // get profile from db
    const dbProfile = await db.getProfile(result.profileId || 0);
    profile.value   = dbProfile || {} as IDBProfile;

    // set conversation values
    conversation.value.id       = result.id || 0;
    conversation.value.messages = [];

    result.conversation.forEach((item) => {
      conversation.value.messages.push({
        guid          : guid(),
        role          : item.role,
        rawText       : item.content,
        formattedText : markdown.render(item.content),
        timestamp     : useTimeAgo(new Date(result.timestamp)),
        wordCount     : getWordCount(item.content),
      });
    });
  }

  discussion.value?.scrollTo(0, discussion.value.scrollHeight);
}

async function saveConversation() {
  //console.log('saveConversation', conversationIsEmpty.value)
  // don't save empty conversations
  if (conversationIsEmpty.value) {
    return;
  }

  const tmp = mapToOpenAIConversation(conversation.value);
  const msg = tmp.find(m => m.role === 'user');

  const dbConversation: IDBConversation = {
    timestamp    : Date.now(),
    title        : msg?.content.substring(0, 62) + '...' || 'Untitled',
    conversation : tmp,
    profileId    : profile.value.id || 1
  };

  // save conversation & get new id
  const conversationId = await db.saveConversation(dbConversation);

  // tell conversation panel to reload
  bus?.emit('conversations::load');
  bus?.emit('selectComponent', 'ConversationsComponent');

  // navigate to conversation
  router.push(`/index/conversations/${conversationId}`);
  //console.log('dbConversation', dbConversation, conversationId);
}

/**
 * Map conversation to OpenAI format
 * @param conversation
 */
function mapToOpenAIConversation(conversation: IConversation) {

  const result = conversation.messages.map((message) => {
    return {
      role   : message.role,
      content: message.rawText
    }
  });

  return result;
}

/**
 * Copy result to clipboard
 * @param text
 */
function copyResult(text: string) {
  //console.log('copyResult', text);

  navigator.clipboard.writeText(text);
  $q.bex.send('background.displayNotification', {
    title  : t(translation.conversations.title),
    message: t(translation.global.copiedToClipBoard)
  });
}

function deleteResult(guid: string) {
  let index = conversation.value.messages.findIndex(m => m.guid == guid);
  conversation.value.messages.splice(index, 1);
}

function renderContent(content?: string) {
  if (content) {
      responseRaw.value += content;

      if (response.value) {
        response.value.rawText       = responseRaw.value;
        response.value.formattedText = markdown.render(responseRaw.value);
        response.value.wordCount     = getWordCount(responseRaw.value);
      }
   }
}

function keyDownHandler(event: KeyboardEvent) {
  //console.log('keyDownHandler', event)

  // if ctrl+space was pressed, toggle STT
  if (event.ctrlKey && event.code === 'Space') {
    stt.value = !stt.value;
  }
  else if (event.ctrlKey) {
    setFocus();
  }

  // if shift+space was pressed, toggle TTS
  if (event.shiftKey && event.code === 'Space') {
    //tts.value = !tts.value;
  }
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(async () => {
  // TODO: now assign to variable, also need handler to update when changed via selection
  //let result = await db.getActiveProfile();

  //console.log('active Profiles', result);

  // load settings
  settings.value = await db.getUserSettings();

  if (props.conversationId) {
    loadConversation(props.conversationId);
  }
  else {
    loadConversation(0);
  }

  if (props.settings) {
    displaySettings(props.settings);
  }

  setFocus();
  document.addEventListener('keydown', keyDownHandler);
});

onBeforeUnmount(() => {
  // make sure STT is off
  if (stt.value) {
    stt.value = false;
    document.dispatchEvent(new Event('toggle-record'));
  }

  document.removeEventListener('keydown', keyDownHandler);
});

/**
 * Display settings when route changes
 */
watch(() => props.settings, () => {
  displaySettings(props.settings);
});

/**
 * Load conversation when route changes
 */
watch(() => props.conversationId, (value) => {
  loadConversation(value);
});

/**
 * Scroll conversation to bottom
 */
watch(() => conversation.value, () => {
  discussion.value?.scrollTo(0, discussion.value.scrollHeight);
});

watch(() => stt.value, (value) => {
  //console.log('ConversationsPage.watch(stt)', value);

  if (value) {
    // setup speech to text recognition
    $q.notify({
      message  : t(translation.conversations.sttOn),
      color    : 'secondary',
      icon     : 'mic',
      timeout  : 1000,
      position : 'bottom-right'
    });

    speechToText({
      language: getFullyQualifiedLanguage(i18next.language),
      callback: (result: string) => {
        if (result) {
          // get prompt text
          prompt.value = result;

          // send request to OpenAI
          getOpenAIResponse();
        }
      }
    });
  }
  else {
    $q.notify({
      message  : t(translation.conversations.sttOff),
      color    : 'secondary',
      icon     : 'mic_off',
      timeout  : 1000,
      position : 'bottom-right'
    });
  }

  document.dispatchEvent(new Event('toggle-record'));
});

watch(() => tts.value, (value) => {
  //console.log('ConversationsPage.watch(tts)', value);

  // setup text to speech playback
  if (value) {
    $q.notify({
      message  : t(translation.global.comingSoon),
      color    : 'secondary',
      icon     : 'volume_up',
      timeout  : 1000,
      position : 'bottom-right'
    });
    return;
    textToSpeech({
      language: getFullyQualifiedLanguage(i18next.language),
      sentence: response.value?.rawText
    });
  }
});
//#endregion ------------------------ Lifecycle -------------------------

//#region --------------------------- Event Handlers -------------------------
// TODO: mode new/delete to routes, and seperate settings from this page

/**
 * Start a new conversation
 */
bus?.on('conversation::new', () => {
  //console.log('ConversationsPage.conversation::new');

  // make sure nothing is in progress
  cancel();

  // load an empty conversation
  loadConversation(0);

  // set focus to prompt
  setFocus();
});

/**
 * Apply new settings
 */
bus?.on('settings::changed', async (newSettings: IUserSettings) => {
  //console.log('ConversationsPage.settings::changed', newSettings);
  settings.value = newSettings;
});

/**
 * Display the results of the response from OpenAI
 */
$q.bex.on('ConversationsPage.result.stream', ({ data }) => {
  //console.log(data);

  let result: IPTResult = data.response;
  switch (true) {
    // this is the incomming data
    case result.status > 199 && result.status < 400:
      let content = result.response?.choices[0].delta.content;
      renderContent(content);
      break;

    // Auth problems
    case result.status > 399 && result.status < 500:
      renderContent(t(translation.global.authError, { statusCode: result.status }));
      responseRaw.value = '';
      waiting.value     = false;
      break;

    // Errors
    case result.status > 499 && result.status < 600:
      renderContent(t(translation.global.authError, { statusCode: result.status }));
      responseRaw.value = '';
      waiting.value     = false;
      break;

    // TODO: Whats this ?
    case result.status === 600:
      renderContent(t(translation.global.authError, { statusCode: result.status }));
      responseRaw.value = '';
      waiting.value     = false;
      break;

    // this is when we are [DONE] ...or use the stop tag
    case result.status === 999:
      responseRaw.value = '';
      waiting.value     = false;

      // dump conversation history
      //console.log('[DONE]', Date.now());

      setFocus();
      break;

    default:
      //console.log(`something else: ${result.status}`);
      //error.value = true;
      break;
  }

  scrollToBottom();
  //console.log('content.result.stream', result.content);
});

$q.bex.on('background.selectedText', ({ data }) => {
  //console.log('page.searchCompanion.onSelectedText', data);

  prompt.value = data;
});
//#endregion ------------------------ Event Handlers -------------------------
</script>

<style lang="scss">
  #settings-dialog .q-dialog__inner--minimized > div {
      max-width: 900px !important;
  }

  .gpt-prompt {
    white-space: pre-wrap;
  }

  .gpt-answer {
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

    h1, h2, h3, h4, h5, h6 {
      font-size   : revert;
      font-weight : revert;
      line-height : revert;
    }
  }

  #discussion {
    overflow-y: scroll;
  }

  .discussion-container {
    // make sure the discussion container is always full height
    height: calc(var(--fullheight) - 32px) !important;
  }
</style>
