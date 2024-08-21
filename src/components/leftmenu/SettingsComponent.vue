<template>
  <q-list bordered separator>
    <q-item>
      <q-item-section>
        <q-item-label class="text-overline q-ma-md">{{ t(translation.global.settings) }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator></q-separator>

    <q-item
      v-for="item in settings" :key="item.title"
      clickable
      @click="() => $router.push(item.route)"
    >
      <q-item-section v-if="item.icon" avatar>
        <q-icon :name="item.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ item.title }}</q-item-label>
        <q-item-label caption>{{ item.caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
  // https://stackoverflow.com/a/68377928/896849
  export default {
    // name is set here, so it can be cached by keep-alive
    name         : 'SettingsComponent',
    inheritAttrs : false,
    customOptions: {}
  }
</script>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, watch, onMounted } from 'vue';

import { translation } from 'src/i18n/types';
import { useTranslation } from 'i18next-vue';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const { t }  = useTranslation();

const settings = ref([
  {
    title   : t(translation.settings.general),
    caption : t(translation.settings.global),
    icon    : 'settings',
    route   : '/index/settings/search'
  }
]);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------

//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  // code
})

watch(() => '', (value) => {
 //console.log('watch', value)
});
//#endregion ------------------------ Lifecycle -------------------------
</script>

<style lang='scss' scoped>

</style>
