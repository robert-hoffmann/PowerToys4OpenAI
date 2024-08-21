<template>
  <!--
    Try this:
    https://medium.com/swlh/how-to-build-a-text-editor-like-notion-c510aedfdfcc
  -->
  <q-page>
    <div class="row flex justify-center profile-container">
      <div class="col-md-9 col-xs-11 q-pa-md q-gutter-sm">
        <q-btn
          :label="t(translation.global.import)"
          @click="uploadDialog = true"
          icon="cloud_download"
          color="secondary"
          size="sm"
        />
        <q-btn
          :label="t(translation.global.export)"
          icon="cloud_upload"
          color="secondary"
          size="sm"
          :href="'data:text/json;charset=utf-8,' + JSON.stringify(profile, null, 2)"
          target="_blank"
          download="profile.json"
        />
        <hr />
        <div class="column">
          <div class="row">
            <div class="col">
              <q-file
                color="secondary"
                label="icon"
                v-model="file"
                clearable
                @update:model-value="onFileChange"
              >
                <template v-slot:prepend>
                  <q-avatar>
                    <img :src="profile.icon">
                  </q-avatar>
              </template>
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            </div>
            <div class="col text-right">
              <q-toggle
                v-model="profile.selected"
                :true-value="1"
                :false-value="0"
                color="secondary"
                checked-icon="check"
                unchecked-icon="clear"
                :label="t(translation.profiles.active)"
              />
            </div>
          </div>
        </div>
        <div class="column">
          <label class="text-bold">Tags</label>
          <q-select
            ref="tagQSelect"
            v-model="profile.tags"
            :options="selectedTags"
            @keydown.enter="addTag"
            @filter="filterTags"
            input-debounce="100"
            label="tags/categories"
            color="secondary"
            bg-color="white"
            stack-label
            use-chips
            multiple
            square
            outlined
            use-input
        />
        </div>
        <div class="column">
          <label class="text-bold">{{ t(translation.profiles.name) }}</label>
          <q-input
            v-model="profile.title"
            outlined
          />
        </div>
        <div class="column">
          <label class="text-bold">{{ t(translation.profiles.description) }}</label>
          <q-input
            v-model="profile.description"
            type="textarea"
            rows="2"
            outlined
          />
        </div>
        <div class="column">

          <div class="row items-center">
            <span class="text-bold q-mr-sm">Prompt type:</span>
            system
            <q-toggle
            v-model="profile.isUserPrompt"
            color="secondary"
            :false-value="0"
            :true-value="1"
            />
            user
          </div>

          <q-input
            v-model="profile.content"
            bg-color="white"
            outlined
            type="textarea"
            max
            autogrow
            counter
          >
            <template v-slot:counter>
                Tokens ({{ promptTokenCount }})
            </template>
          </q-input>
        </div>
        <div class="column">
          <q-btn
            :label="t(translation.global.save)"
            @click="saveProfile()"
            color="secondary"
          />
        </div>
      </div>
    </div>
  </q-page>
  <teleport to="body">
    <q-dialog v-model="uploadDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="text-white" style="width: 300px">
        <q-card-section class="bg-secondary">
          {{ t(translation.profiles.selectProfile) }}
        </q-card-section>

        <q-card-section>
          <q-file
            v-model="uploadedFile"
            accept="application/json"
            class="bg-white"
            hint="JSON file"
            outlined
            dense
            counter
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :label="t(translation.global.upload)"
            color="secondary"
            @click="importProfile"
            v-close-popup
          />
          <q-btn
            :label="t(translation.global.cancel)"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </teleport>
</template>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, toRaw, watch, inject, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { EventBus } from 'quasar/dist/types/utils';
import { db } from 'src/js/controllers/dbController';
import { IDBProfile } from 'src/js/libs/types/IDBProfile';
import defaultTags from 'src/js/data/default-tags.json';

import { getBase64 } from 'src/js/libs/helpers';
import { getTokenCount } from 'src/js/libs/helpers';

import { translation } from 'src/i18n/types';
import { useTranslation } from 'i18next-vue';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const { t }  = useTranslation();
const router = useRouter();
const bus    = inject<EventBus>('bus');
const props  = defineProps({
  id: {
    type    : Number,
    required: true
  }
});

const defaultIcon = 'data:image/png;base64,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';
const file        = ref<File>();

const onFileChange = (file: Blob | null) => {
  profile.value.icon = file ? window.URL.createObjectURL(file) : defaultIcon;
};

const defaultProfile =   {
  title        : 'Default',
  description  : 'Default profile',
  tags         : ['other'],
  content      : 'Reply with markdown when appropriate.',
  icon         : defaultIcon,
  isUserPrompt : 0,
  selected     : 1,
}
const profile      = ref<IDBProfile>({...toRaw(defaultProfile)});
const selectedTags = ref<string[]>([...defaultTags]);
const currentInput = ref('');

const tagQSelect = ref<any>(null);

const uploadDialog = ref(false);
const uploadedFile = ref(null);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
const promptTokenCount = computed<number>(() => {
  // let's not add stuff up untill we actually want to show it
  if (!profile.value.content) {
    return 0;
  }

  return getTokenCount(profile.value.content);
});

async function getBase64Icon() {
  if (file.value) {
    return await getBase64(file.value);
  }

  return profile.value.icon;
}

function filterTags(val: string, update: (callback: () => void) => void): void {
  //console.log('filterTags', val, update);

  if (val === '') {
    update(() => {
      selectedTags.value = defaultTags;
    });
    return;
  }

  currentInput.value = val;
}

function addTag() {
  tagQSelect.value?.add(currentInput.value, true);
  //console.log('addTag', tagQSelect.value);
}

function loadProfile(profileId: number) {
  //console.log('loadProfile', profileId, props.id)

  // load defaults
  if (profileId) {
    db.getProfile(profileId).then((dbProfile) => {
      profile.value = dbProfile || {...toRaw(defaultProfile)};

      // set some defaults if missing
      profile.value.icon         = profile.value.icon || defaultIcon;
      profile.value.isUserPrompt = profile.value.isUserPrompt == undefined ? 0 : profile.value.isUserPrompt;
    });
    return;
  }

  profile.value = {...toRaw(defaultProfile)};
}

async function saveProfile() {
  // clone and map icon
  let profileToSave  = {...toRaw(profile.value)};
  profileToSave.icon = await getBase64Icon();

  db.saveProfile(profileToSave).then((newProfileId) => {
    //console.log('profileToSave', profileToSave, props.id, newProfileId);
    bus?.emit('profiles::reload', newProfileId);

    // go back to conversations
    router.push('/index');
  });
}

function importProfile() {
  //console.log('importProfile', uploadedFile.value);
  if (uploadedFile.value) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!e.target?.result) return;

      let profileToImport = JSON.parse(e.target.result as string);

      // remove id, so we don't update an existing profile
      delete profileToImport?.id;
      profile.value = profileToImport;
    };
    fileReader.readAsText(uploadedFile.value);

    // reset file input
    uploadedFile.value = null;
  }
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  loadProfile(props.id);
});

watch(() => props.id, () => {
  loadProfile(props.id);
});
//#endregion ------------------------ Lifecycle -------------------------

//#region --------------------------- Event Handlers -------------------------
bus?.on('profile::new', () => {
  profile.value = {...toRaw(defaultProfile)};
});
//#endregion ------------------------ Event Handlers -------------------------
</script>

<style lang="scss">
  .profile-container {
    // make sure the profile container is always full height
    overflow-y: scroll;
    height: calc(var(--fullheight) - 32px) !important;
  }
</style>
