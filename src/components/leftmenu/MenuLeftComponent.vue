<template>
  <!--
    https://codepen.io/robert-hoffmann/pen/poZmaEz
  -->
  <div class="column no-wrap justify-between" style="height: 100%;">
      <!--
        https://vuejs.org/guide/built-ins/keep-alive.html#basic-usage
      -->
      <keep-alive include="ConversationsComponent">
        <component v-bind:is="selectedComponent"></component>
      </keep-alive>

      <div class="q-pa-md text-center">
        <q-btn
          icon="o_question_answer"
          @click="selectComponent('ConversationsComponent')"
          :disable="selectedItem == 'ConversationsComponent'"
        />

        <q-btn
          icon="o_school"
          class="q-ml-sm"
          @click="selectComponent('ProfilesComponent')"
          :disable="selectedItem == 'ProfilesComponent'"
        />

        <q-btn
          icon="o_settings"
          class="q-ml-sm"
          @click="$router.push('/index/settings/search')"
          :disable="selectedItem == 'SettingsComponent'"
        />

        <q-fab
          id="language-selection"
          class="q-ml-sm"
          icon="language"
          direction="up"
          square
        >
          <q-fab-action
            color="secondary"
            label="de"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('de')"
          />
          <q-fab-action
            color="secondary"
            label="en"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('en')"
          />
          <q-fab-action
            color="secondary"
            label="es"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('es')"
          />
          <q-fab-action
            color="secondary"
            label="fr"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('fr')"
          />
          <q-fab-action
            color="secondary"
            label="hi"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('hi')"
          />
          <q-fab-action
            color="secondary"
            label="jp"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('ja')"
          />
          <q-fab-action
            color="secondary"
            label="pt"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('pt')"
          />
          <q-fab-action
            color="secondary"
            label="ru"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('ru')"
          />
          <q-fab-action
            color="secondary"
            label="tr"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('tr')"
          />
          <q-fab-action
            color="secondary"
            label="zn"
            outline
            class="bg-white"
            @click="i18next.changeLanguage('zh')"
          />
        </q-fab>
      </div>
  </div>
</template>

<script lang="ts">
  // https://stackoverflow.com/a/68377928/896849
  export default {
    // name is set here, so it can be cached by keep-alive
    name         : 'MenuLeftComponent',
    inheritAttrs : false,
    customOptions: {}
  }
</script>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, onMounted, inject, shallowRef, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { EventBus } from 'quasar/dist/types/utils';

import { useTranslation } from 'i18next-vue';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const router = useRouter();
const bus    = inject<EventBus>('bus');

// https://vuejs.org/guide/components/async.html#basic-usage
const Conversations = defineAsyncComponent(() =>
  import('./ConversationsComponent.vue')
);

// https://vuejs.org/guide/components/async.html#basic-usage
const Profiles = defineAsyncComponent(() =>
  import('./ProfilesComponent.vue')
);

// https://vuejs.org/guide/components/async.html#basic-usage
const Settings = defineAsyncComponent(() =>
  import('./SettingsComponent.vue')
);

// https://stackoverflow.com/a/67095293/896849
// https://vuejs.org/api/reactivity-advanced.html#shallowref
const selectedComponent = shallowRef(Conversations);
const selectedItem      = ref('ConversationsComponent')

const { i18next } = useTranslation();
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
function selectComponent(component: string) {
  selectedItem.value = component;

  switch (component) {
    case 'ConversationsComponent':
      selectedComponent.value = Conversations;

      if (router.currentRoute.value.params.conversationId) {
        router.push(`/index/conversations/${router.currentRoute.value.params.conversationId}`);
      } else {
        router.push('/index');
      }
      break;

    case 'ProfilesComponent':
      selectedComponent.value = Profiles;
      break;


    case 'SettingsComponent':
      selectedComponent.value = Settings;
      break;

    default:
      selectedComponent.value = Conversations;
      break;
  }
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  //console.log('MenuLeftComponent mounted', Date.now());
});

// allow loading components via events (basically just used in the event of a manual page reload)
bus?.on('selectComponent', (component: string) => {
  //console.log('selectComponent', component);
  selectComponent(component);
});
//#endregion ------------------------ Lifecycle -------------------------
</script>

<style lang='scss'>
  #language-selection {
    > .q-btn--fab {
      min-height: 2.572em !important;
      min-width : initial !important;
      padding   : 4px 16px !important;
    }
  }
</style>


