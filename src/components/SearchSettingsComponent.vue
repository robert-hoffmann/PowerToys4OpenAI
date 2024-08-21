<template>
  <!-- content -->
  <q-card class="bg-white">
    <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title>{{ $t(translation.global.settings) }}</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
          :title="$t(translation.global.close)"
        />
    </q-toolbar>

    <q-card-section horizontal>

      <q-card-section style="width: 400px;">
        <div class="row q-mt-md">
          <div class="col text-bold">
            {{ $t(translation.searchSettings.interfaceLanguage) }}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-select
              outlined
              v-model="languageSelected"
              :options="languageOptions"
            >
              <template v-slot:after>
                <q-icon
                  name="language"
                  color="secondary"
                  class="cursor-pointer"
                  size="lg"
                  @click="navigateTo('translations')"
                />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">
            {{ $t(translation.searchSettings.model) }}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-select outlined v-model="settings.model" :options="gptModels">
              <template v-slot:after>
                  <q-icon
                    name="link"
                    color="secondary"
                    class="cursor-pointer"
                    size="lg"
                    @click="navigateTo('models')"
                  />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">
            {{ $t(translation.searchSettings.apiKeyTitle) }}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input
              color="secondary"
              outlined
              v-model="settings.apiKey"
              label="sk-xxxxx"
              :type="showApiKey ? 'text': 'password'"
              :hint="$t(translation.searchSettings.apiKeyHint)"
            >
              <template v-slot:prepend>
                <q-icon name="key" />
              </template>

              <template v-slot:append>
                <q-icon
                  :name="showApiKey ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showApiKey = !showApiKey"
                />
              </template>

              <template v-slot:after>
                <q-btn round outline icon="question_mark" @click="navigateTo('apiKey')" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator vertical />

      <q-card-section style="width: 400px;">
        <div class="row q-mt-md">
          <div class="col text-bold">
            {{ $t(translation.searchSettings.showSidebarOnAllSites) }}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-btn-toggle
            v-model="settings.showSidebar"
            spread
            no-caps
            toggle-color="secondary"
            color="white"
            text-color="black"
            :options="[
              { label: t(translation.global.no)  , value: false },
              { label: t(translation.global.yes) , value: true },
            ]"
          />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">
            {{ $t(translation.searchSettings.triggerModeTitle) }}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-list>
              <!--
                Rendering a <label> tag (notice tag="label")
                so QCheckboxes will respond to clicks on QItems to
                change Toggle state.
              -->
              <q-item tag="label">
                <q-item-section avatar top>
                  <q-radio v-model.number="settings.triggerMode" size="lg" color="secondary" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="0" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t(translation.searchSettings.triggerModeManual) }}</q-item-label>
                  <q-item-label caption>{{ $t(translation.searchSettings.triggerModeManualHint) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label">
                <q-item-section avatar top>
                  <q-radio v-model.number="settings.triggerMode" size="lg" color="secondary" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="1" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t(translation.searchSettings.triggerModeQuestion) }}</q-item-label>
                  <q-item-label caption>{{ $t(translation.searchSettings.triggerModeQuestionHint) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model.number="settings.triggerMode" size="lg" color="secondary" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="2" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t(translation.searchSettings.triggerModeAuto) }}</q-item-label>
                  <q-item-label caption>{{ $t(translation.searchSettings.triggerModeAutoHint) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  // https://stackoverflow.com/a/68377928/896849
  export default {
    // name is set here, so it can be cached by keep-alive
    name         : 'SearchSettingsComponent',
    inheritAttrs : false,
    customOptions: {}
  }
</script>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, toRaw, watch, onMounted, inject } from 'vue';
import { EventBus } from 'quasar/dist/types/utils';

import { translation } from 'src/i18n/types';
import { useTranslation } from 'i18next-vue';

import { IUserSettings } from 'src/js/libs/types/IUserSettings';
import { db } from 'src/js/controllers/dbController';

import { triggerMode } from 'src/js/data/triggerMode';
import { gptModels } from 'src/js/data/gpt-models';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const bus = inject<EventBus>('bus');

const settings = ref<IUserSettings>({
  id          : 0,
  darkMode    : false,
  triggerMode : triggerMode.QUESTION,
  apiKey      : '',
  licenseKey  : '',
  showSidebar : false,
  model       : gptModels[0]
});

const showApiKey = ref<boolean>(false);

const { i18next, t }   = useTranslation();
const languageSelected = ref({ label: 'English' , value: 'en' });
const languageOptions = [
  { label: 'Deutsch'  , value: 'de' },
  { label: 'English'  , value: 'en' },
  { label: 'Español'  , value: 'es' },
  { label: 'Français' , value: 'fr' },
  { label: 'हिन्दी'     , value: 'hi' },
  { label: '日本語'   , value: 'ja' },
  { label: 'Português', value: 'pt' },
  { label: 'Русский'  , value: 'ru' },
  { label: 'Türkçe'   , value: 'tr' },
  { label: '中文'     , value: 'zh' },
];
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
function navigateTo(key: string) {
  switch (key) {
    case 'apiKey':
      window.open('https://www.onmsft.com/how-to/how-to-get-an-openai-api-key/', '_blank');
      break;

      case 'models':
      window.open('https://platform.openai.com/docs/models/', '_blank');
      break;

      case 'translations':
      window.open('https://github.com/robert-hoffmann/PowerToys4OpenAI/tree/main/translations/', '_blank');
      break;

    default:
      break;
  }
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  // code
  db.getUserSettings().then((data) => {
    //console.log(data);
    settings.value = data;
  });

  languageSelected.value = languageOptions.find((x) => x.value === i18next.resolvedLanguage) || languageOptions[0];
});

watch(() => settings.value, (value) => {
  db.saveUserSettings(toRaw(value));
  bus?.emit('settings::changed', toRaw(value));
}, { deep: true });

watch(() => languageSelected.value, (value) => {
  i18next.changeLanguage(value.value);
});
//#endregion ------------------------ Lifecycle -------------------------
</script>

<style lang='scss' scoped>

</style>
