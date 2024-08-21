<template>
  <router-view />
</template>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { onMounted, ref, provide } from 'vue';
import { useQuasar, EventBus } from 'quasar';
import { useRouter } from 'vue-router';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const $q     = useQuasar();
const bus    = new EventBus();
const router = useRouter();
const timeout = ref(0);

// INFO: this is used to communicate between VUE components and pages (not content.ts or background.ts)
provide('bus', bus);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
function resizeEvent() {
  if (timeout.value !== 0) {
    return;
  }

  timeout.value = window.setTimeout(function() {
    timeout.value = 0;
    bus.emit('resizeEvent');

    //console.log('App::resizeEvent');
  }, 100);
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  // initialize context menu in BEX mode
  $q.bex?.send('init-contextmenu')
    .then((/*res*/) => {
      //console.log('bex response:init-contextmenu', res);
    }
  );
}),

router.afterEach(() => {
  resizeEvent();
});
window.addEventListener('resize', resizeEvent, { passive: true });
//#endregion ------------------------ Lifecycle -------------------------
</script>
