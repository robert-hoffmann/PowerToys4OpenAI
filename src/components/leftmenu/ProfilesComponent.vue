<template>
  <q-item class="q-mr-xs">
    <q-item-section>
      <q-item-label class="text-overline q-ma-md">{{ t(translation.profiles.title) }}</q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-btn
        icon="add"
        size="md"
        flat
        style="max-width: 25px;"
        :title="t(translation.profiles.newProfile)"
        @click="newProfile()"
      />
    </q-item-section>
  </q-item>
  <q-list
    bordered
    separator
    style="overflow-y: auto; height: 100%;"
  >
    <q-slide-item
      v-for="item in profiles" :key="item.id"
      @right="deleteProfile(item)"
      right-color="secondary"
      clickable
    >
      <template v-slot:right>
        <q-icon name="delete" />
      </template>

      <q-item
        clickable
        :class="item.selected ? 'bg-primary text-white' : ''"
        :dark="item.selected === 1"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon ? `img:${item.icon}` : 'school'" size="md" />
        </q-item-section>

        <q-item-section
          @click="selectProfile(item)"
        >
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>
            {{ item.description }}
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>
            <q-btn
              icon="edit"
              size="xs"
              @click="() => $router.push(`/index/profiles/${item.id || 0}`)"
              :title="t(translation.global.edit)"
              flat
              round
              outline
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-slide-item>
  </q-list>
</template>

<script lang="ts">
  // https://stackoverflow.com/a/68377928/896849
  export default {
    // name is set here, so it can be cached by keep-alive
    name         : 'ProfilesComponent',
    inheritAttrs : false,
    customOptions: {}
  }
</script>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

import { EventBus } from 'quasar/dist/types/utils';
import { db } from 'src/js/controllers/dbController';
import { IDBProfile } from 'src/js/libs/types/IDBProfile';

import { translation } from 'src/i18n/types';
import { useTranslation } from 'i18next-vue';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const router = useRouter();
const bus    = inject<EventBus>('bus');
const { t }  = useTranslation();

const defaultProfile = {
      title       : 'Default',
      description : 'Default profile',
      tags        : ['other'],
      content     : 'Reply with markdown when appropriate.',
      icon        : 'data:image/png;base64,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',
      selected    : 1
    }
const profiles = ref<IDBProfile[]>([{...defaultProfile}]);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
async function selectProfile(profile: any) {
    //console.log('selectProfile');

    // wait for db to set the profile as default
    await db.setAsDefaultProfile(profile.id);

    // show that the profile is selected
    Notify.create({
      message : t(translation.profiles.selected, { name: profile.title }),
      color   : 'secondary',
      icon    : 'check_circle_outline',
      timeout : 1000,
      position: 'bottom-right'
    });

    // reload profile list
    await loadProfiles();

    // go to conversations
    router.push('/index');

    // create new conversation, using current profile
    bus?.emit('conversation::new');
}

async function loadProfiles() {
    //console.log('ProfilesComponent.loadProfiles()');

    // get profiles from db
    let dbProfiles = await db.getProfiles();

    // if no profiles
    if (dbProfiles.length === 0) {
      // create default profile
      await db.insertProfiles([{...defaultProfile}]);

      // get profiles from db
      dbProfiles = await db.getProfiles();
    }

    // set profiles
    profiles.value = dbProfiles;
}

function newProfile() {
    router.push('/index/profiles/0');
    bus?.emit('profile::new');
}

async function deleteProfile(item: IDBProfile) {
  //console.log('ProfilesComponent.deleteProfile()', item);
  if (item.id) {
    await db.deleteProfile(item.id);
  }

  loadProfiles();
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  loadProfiles();
});
//#endregion ------------------------ Lifecycle -------------------------

//#region --------------------------- Event Handlers -------------------------
bus?.on('profiles::reload', () => {
  //console.log('ProfilesComponent.bus.on(profiles::reload)');
  loadProfiles();
});
//#endregion ------------------------ Event Handlers -------------------------
</script>

<style lang='scss' scoped>

</style>
