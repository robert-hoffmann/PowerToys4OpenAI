<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="settings"
          @click="$router.push('/index/settings/search')"
        />

        <q-space />

        PowerToys for OpenAI ™

        <q-space />

        <q-btn
          flat
          dense
          round
          icon="img:socials/twitter.svg"
          target="_blank"
          href="https://twitter.com/itechnologynet"
        />

        <q-btn
          flat
          dense
          round
          icon="img:socials/linkedin.svg"
          target="_blank"
          href="https://www.linkedin.com/in/hoffmannrobert"
        />

        <q-btn
          flat
          dense
          round
          icon="img:socials/github.svg"
          target="_blank"
          href="https://github.com/robert-hoffmann/PowerToys4OpenAI"
        />

        -

        <q-btn
          flat
          dense
          round
          icon="bug_report"
          target="_blank"
          href="https://github.com/robert-hoffmann/PowerToys4OpenAI/issues"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerLeftOpen"
      behavior="desktop"
      bordered
      side="left"
    >
      <MenuLeftComponent />
    </q-drawer>

    <teleport to="body">
      <div class="row fixed-bottom-right q-mr-md">
        <div class="column">
          <q-btn
            flat
            dense
            round
            icon="img:donations/bitcoin.png"
            :title="t(translation.global.donate, { name: 'BTC' })"
            @click="copyAdress('bc1qjl52gkartspdc7s8zcfxpsnvus6cm76uf4dl9w', 'bitcoin')"
            class="q-mb-sm"
          />

          <q-btn
            flat
            dense
            round
            icon="img:donations/ethereum.png"
            :title="t(translation.global.donate, { name: 'ETH' })"
            @click="copyAdress('0xfd50701ef47fd8da09e9d38f19d2535dfeb8cc38', 'ethereum')"
            class="q-mb-sm"
          />

          <q-btn
            flat
            dense
            round
            icon="img:donations/paypal.png"
            :title="t(translation.global.donate, { name: 'PayPal' })"
            target="_blank"
            href="https://paypal.me/itechnology"
            class="q-mb-sm"
          />
        </div>
      </div>
    </teleport>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, onMounted, inject, defineAsyncComponent } from 'vue';

import { useQuasar } from 'quasar';
import { EventBus } from 'quasar/dist/types/utils';

import { translation } from '../i18n/types';
import { useTranslation } from 'i18next-vue';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const $q     = useQuasar();
const bus    = inject<EventBus>('bus');
const { t }  = useTranslation();

// https://vuejs.org/guide/components/async.html#basic-usage
const MenuLeftComponent = defineAsyncComponent(() =>
  import('src/components/leftmenu/MenuLeftComponent.vue')
);

const drawerLeftOpen  = ref(true);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
function onResize() {
  // INFO: -50 is the height of the header
  document.documentElement.style.setProperty('--fullheight', `${window.innerHeight - 50}px`);
}

function copyAdress(text: string, type: string) {
  navigator.clipboard.writeText(text);
  $q.bex.send('background.displayNotification', {
    title  : 'PowerToys for OpenAI™',
    message: t(translation.global.donateCopy, { name: type }),
    icon   : `www/donations/${type}.png`,
  });
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  onResize();
  bus?.on('resizeEvent', onResize);
});
//#endregion ------------------------ Lifecycle -------------------------
</script>
