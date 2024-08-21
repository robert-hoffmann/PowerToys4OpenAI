<template>
  <q-item class="q-mr-xs">
    <q-item-section>
      <q-item-label class="text-overline q-ma-md">{{ t(translation.conversations.title) }}</q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-btn
        icon="add"
        size="md"
        flat
        style="max-width: 25px;"
        :title="t(translation.conversations.newConversation)"
        @click="newConversation()"
      />
    </q-item-section>
  </q-item>
  <q-list
    bordered
    separator
    style="overflow-y: auto; height: 100%;"
  >
    <q-slide-item
      v-for="item in conversations" :key="item.id"
      @right="deleteConversation(item)"
      right-color="secondary"
    >
      <template v-slot:right>
        <q-icon name="delete" />
      </template>

      <q-item
        clickable
        :class="item.id == parseInt($route.params.conversationId as string, 10) ? 'bg-primary text-white' : ''"
        :dark="item.id == parseInt($route.params.conversationId as string, 10)"
      >
        <q-item-section top avatar>
          <q-icon :name="item.icon"  size="md" />
        </q-item-section>

        <q-item-section
          @click="displayConversation(item)"
        >
          <q-item-label :title="t(translation.global.edit)">
            {{ item.title }}
            <q-popup-edit
              v-model="item.title"
              class="bg-primary text-white"
              v-slot="scope"
              @save="(value, initialValue) => titleChanged(value, initialValue, item)"
            >
              <q-input
                dark
                color="white"
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              >
                <template v-slot:append>
                  <q-icon
                    name="keyboard_return"
                    class="cursor-pointer"
                    @click="scope.set"
                  />
                </template>
              </q-input>
            </q-popup-edit>
          </q-item-label>
          <q-item-label caption style="max-height: 15px;">
            <div class="row">
              <div class="col text-left">
                {{ item.timestamp }}
              </div>
              <div class="col text-right">
                <q-icon
                  :title="t(translation.global.copy)"
                  name="content_copy"
                  size="xs"
                  style="font-size: 1.2em;"
                  @click="copyToClipboard(item)"
                />
              </div>
            </div>
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
    name         : 'ConversationsComponent',
    inheritAttrs : false,
    customOptions: {}
  }
</script>

<script setup lang="ts">
//#region --------------------------- IMPORTS ---------------------------
import { ref, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useTimeAgo } from '@vueuse/core';
import { EventBus } from 'quasar/dist/types/utils';

import { db } from 'src/js/controllers/dbController';
import { IDBConversation } from 'src/js/libs/types/IDBConversation';

import { translation } from 'src/i18n/types';
import { useTranslation } from 'i18next-vue';
//#endregion ------------------------ IMPORTS ---------------------------

//#region --------------------------- Declarations ----------------------
const route  = useRoute();
const router = useRouter();
const { t }  = useTranslation();
const bus    = inject<EventBus>('bus');
const $q     = useQuasar();

interface IConversation {
  id?       : number;
  title     : string;
  icon      : string;
  timestamp : string;
}

const dbConversations = ref<IDBConversation[]>([]);
const conversations   = ref<IConversation[]>([]);
//#endregion ------------------------ Declarations ----------------------

//#region --------------------------- Functions -------------------------
/**
 * This function triggers in conjunction with the popup-edit component.
 */
function titleChanged(value: string, initialValue: string, item: IConversation) {
  // find the updated item
  const lastModified = conversations.value.find(c => c.id == item.id);
  if (lastModified?.id) {
    //console.log('lastModified', lastModified);

    // update conversation in db
    db.updateConversation(lastModified.id, { title: value });
  }
}

function newConversation() {
  bus?.emit('conversation::new');
  router.push('/index');
}

function deleteConversation(item: IConversation) {
  if (item.id) {
    db.deleteConversation(item.id);
  }

  loadConversations();
  bus?.emit('conversation::new');
}

function displayConversation(conversation: IConversation) {
  router.push(`/index/conversations/${conversation.id}`);
}

async function loadConversations() {
  dbConversations.value = await db.getConversations();
  conversations.value   = dbConversations.value.map(c => {
    return {
      id        : c.id,
      title     : c.title,
      icon      : 'question_answer',
      timestamp : useTimeAgo(c.timestamp),
      profileId : c.profileId
    }
  });

  //console.log('ConversationComponent.loadConversations()', conversations.value);
}

function copyToClipboard(item: IConversation) {
  if (item.id == parseInt(route.params.conversationId as string, 10)) {
    db.getConversation(item.id).then(entry => {
      if (entry) {
        let content = entry.conversation.map(message => {
          if (message.role != 'system')
            return `${message.role}:\n${message.content}`;
        })
        .join('\n\n---\n\n');

        //console.log('copyToClipboard', content)
        navigator.clipboard.writeText(content);
        $q.bex.send('background.displayNotification', {
          title  : t(translation.conversations.title),
          message: t(translation.global.copiedToClipBoard)
        });
      }
    });
  }
}
//#endregion ------------------------ Functions -------------------------

//#region --------------------------- Lifecycle -------------------------
onMounted(() => {
  bus?.on('conversations::load', () => {
    loadConversations();
    //console.log('bus.on(conversations::load)');
  });

  loadConversations();
});
//#endregion ------------------------ Lifecycle -------------------------
</script>

<style lang='scss' scoped>

</style>
