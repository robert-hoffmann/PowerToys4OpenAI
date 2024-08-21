<template>
  <!-- content -->
  <div class="q-pa-md bg-white" style="min-width:800px">
    <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>OpenAI Settings</q-toolbar-title>
    </q-toolbar>

    <div class="row q-my-md">
      <div class="col q-mx-md">
        <label class="text-bold">
          model
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-model"
            target="openai"
            round
            flat
          />
        </label>
        <q-select
          color="secondary"
          v-model="settings.model"
          :options="['text-davinci-003', 'text-curie-001', 'text-babbage-001']"
          outlined
        />
      </div>
      <div class="col q-mx-md">
        <label class="text-bold">
          logprobs
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-logprobs"
            target="openai"
            round
            flat
          />
        </label>
        <br />
        <q-btn-toggle
          v-model="settings.logprobs"
          toggle-color="secondary"
          spread
          :options="[
            { label: 'False'  , value: false },
            { label: 'Default', value: undefined },
            { label: 'True'   , value: true }
          ]"
        />
      </div>
    </div>

    <div class="row q-my-md">
      <div class="col q-mx-md">
        <label class="text-bold">
          suffix
            <q-btn
              size="xs"
              icon="launch"
              href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-suffix"
              target="openai"
              round
              flat
            />
        </label>
        <q-input
          color="secondary"
          label="suffix"
          type="text"
          v-model="settings.suffix"
          outlined
          clearable
          dense
        />
      </div>
      <div class="col q-mx-md">
        <label class="text-bold">
          echo
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-echo"
            target="openai"
            round
            flat
          />
        </label>
        <br />
        <q-btn-toggle
          v-model="settings.echo"
          toggle-color="secondary"
          spread
          :options="[
            { label: 'False'  , value: false },
            { label: 'Default', value: undefined },
            { label: 'True'   , value: true }
          ]"
        />
      </div>
    </div>

    <div class="row q-my-md">
      <div class="col q-mx-md">
        <label class="text-bold">
          max tokens
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-max_tokens"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="max_tokens"
          type="number"
          v-model="settings.max_tokens"
          :rules="[val => val == null || val > 0 && val <= 4096 || 'max_tokens must be between 0 and 4096, or empty']"
          outlined
          clearable
          dense
        />
      </div>
      <div class="col q-mx-md">
          <label class="text-bold">
            stop
            <q-btn
              size="xs"
              icon="launch"
              href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-stop"
              target="openai"
              round
              flat
            />
          </label>
          <br />
          <q-btn-toggle
            v-model="settings.stop"
            toggle-color="secondary"
            spread
            :options="[
              { label: 'False'  , value: false },
              { label: 'Default', value: undefined },
              { label: 'True'   , value: true }
            ]"
          />
      </div>
    </div>

    <div class="row q-my-md">
      <div class="col q-mx-md">
        <label class="text-bold">
          temperature
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-temperature"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="temperature"
          type="number"
          v-model="settings.temperature"
          :rules="[val => val == null || val <= 2 || 'temperature must be between 0 and 2, or empty']"
          outlined
          clearable
          dense
        />
      </div>
      <div class="col q-mx-md">
        <label class="text-bold">
          presence_penalty
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-presence_penalty"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="presence_penalty"
          type="number"
          v-model="settings.presence_penalty"
          :rules="[val => val == null || val >= -2 && val <= 2 || 'presence_penalty must be between -2.0 and 2.0, or empty']"
          outlined
          clearable
          dense
        />
      </div>
    </div>

    <div class="row q-my-md">
      <div class="col q-mx-md">
        <label class="text-bold">
          top_p
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-top_p"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="top_p"
          type="number"
          v-model="settings.top_p"
          :rules="[val => val == null || val >= 0 && val <= 1 || 'top_p must be between 0 and 1, or empty']"
          outlined
          clearable
          dense
        />
      </div>
      <div class="col q-mx-md">
        <label class="text-bold">
          frequency_penalty
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-frequency_penalty"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="frequency_penalty"
          type="number"
          v-model="settings.frequency_penalty"
          :rules="[val => val == null || val >= -2 && val <= 2 || 'frequency_penalty must be between -2 and 2, or empty']"
          outlined
          clearable
          dense
        />
      </div>
    </div>

    <div class="row q-my-md">
      <div class="col q-mx-md">
        <label class="text-bold">
          n
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-n"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="n"
          type="number"
          v-model="settings.n"
          :rules="[val => val == null || val >= 1 || 'n must be between 1 or above, or empty']"
          outlined
          clearable
          dense
        />
      </div>
      <div class="col q-mx-md">
        <label class="text-bold">
          best_of
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-best_of"
            target="openai"
            round
            flat
          />
        </label>
        <q-input
          color="secondary"
          label="best_of"
          type="number"
          v-model="settings.best_of"
          :rules="[val => val == null || val > settings.n || 'best_of must be greater than n, or empty']"
          clearable
          outlined
          dense
        />
      </div>
    </div>

    <div class="row">
      <div class="col q-ma-md">
        <label class="text-bold">
          stream
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-stream"
            target="openai"
            round
            flat
          />
        </label>
        <br />
        <q-btn-toggle
          v-model="settings.stream"
          toggle-color="secondary"
          spread
          :options="[
            { label: 'False'  , value: false },
            { label: 'Default', value: undefined },
            { label: 'True'   , value: true }
          ]"
        />
      </div>
      <div class="col q-ma-md">
        <label class="text-bold">
          logit_bias
          <q-btn
            size="xs"
            icon="launch"
            href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-logit_bias"
            target="openai"
            round
            flat
          />
        </label>
        <br />
        <q-btn-toggle
          v-model="settings.logit_bias"
          toggle-color="secondary"
          spread
          :options="[
            { label: 'False'  , value: false },
            { label: 'Default', value: undefined },
            { label: 'True'   , value: true }
          ]"
        />
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col text-right">
        <q-btn color="primary" v-close-popup>Close</q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // https://stackoverflow.com/a/68377928/896849
  export default {
    // name is set here, so it can be cached by keep-alive
    name         : 'OpenAISettingsComponent',
    inheritAttrs : false,
    customOptions: {}
  }
</script>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, watch, onMounted } from 'vue';

import { IPTChatRequest } from 'src/js/libs/types/IPTChatRequest'
import { db } from 'src/js/controllers/dbController';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const settings = ref<IPTChatRequest>({
	model    : 'gpt-3.5-turbo',
	messages : {
    role   : 'user',
    content: 'Hello, how are you?'
  },
  temperature       : undefined,
	top_p             : undefined,
	n                 : undefined,
	stream            : undefined,
	stop              : undefined,
	max_tokens        : undefined,
	presence_penalty  : undefined,
	frequency_penalty : undefined,
	logit_bias        : undefined,
	user              : undefined
});
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------

//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  // code
  db.getUserSettings().then((/*data*/) => {
    //console.log(data);
    //settings.value = data;
  })
});

watch(() => settings.value, (/*value*/) => {
  //db.saveUserSettings(toRaw(value));
  //store.userSettings = value;
}, { deep: true });
//#endregion ------------------------ Lifecycle -------------------------
</script>

<style lang='scss' scoped>

</style>
