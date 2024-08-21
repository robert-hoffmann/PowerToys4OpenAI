// db.js
import Dexie, { IndexableType } from 'dexie';
import { IUserSettings, } from 'src/js/libs/types/IUserSettings';
import { IDBConversation } from 'src/js/libs/types/IDBConversation';
import { IDBProfile } from 'src/js/libs/types/IDBProfile';

import { triggerMode } from 'src/js/data/triggerMode';
import { gptModels } from 'src/js/data/gpt-models';

// INFO: database works in background.js
// You cannot see the data from the serviceworker dev tools panel
// However you can see the data from the content.js dev tools panel
class dbController extends Dexie {
  //#region ------------------------ Setup ---------------------
  userSettings! : Dexie.Table<IUserSettings  , number>;
  conversations!: Dexie.Table<IDBConversation, number>;
  profiles!: Dexie.Table<IDBProfile, number>;

  constructor() {
    super('powertoys.oai');

    // INFO: See indexable types: https://dexie.org/docs/Indexable-Type
    this.version(1).stores({
      // INFO: Normally only declare items that we want indexed
      userSettings : '++id, triggerMode, darkMode, apiKey, licenseKey',
      conversations: '++id, timestamp, title, conversation'
    });

    this.version(2).stores({
      // INFO: Normally only declare items that we want indexed
      userSettings : '++id, triggerMode, darkMode, apiKey, licenseKey',
      conversations: '++id, timestamp, title, conversation',
      profiles     : '++id, *tags, selected'
    });

    // v0.2.2
    this.version(3).stores({
      // INFO: Normally only declare items that we want indexed
      userSettings : '++id, triggerMode, darkMode, apiKey, licenseKey',
      conversations: '++id, timestamp, title, conversation, profileId',
      profiles     : '++id, *tags, selected'
    });
  }
  //#endregion --------------------- Setup ---------------------

  //#region ------------------------ DB Operations ---------------------
  /**
   * Delete Database
   */
  async deleteDatabase() {
    return this.delete();
  }

  /**
   * Delete an entry from the database
   * @param {String} table Name of the table
   * @param {Mixed} key Key or Composite key
   */
  async deleteItem(table: string, key: IndexableType) {
    this.table(table).delete(key);
  }
  //#endregion --------------------- DB Operations ---------------------

  //#region ------------------------ User Settings ---------------------
  async getUserSettings() : Promise<IUserSettings> {
    const userSettings = await this.userSettings.get({id: 0});

    // set default values for items that may not exist (e.g. after updates)
    if (userSettings) {
      if (!userSettings.model) {
        userSettings.model = gptModels[0];
      }

      return userSettings;
    }

    // no user settings found, return default values
    return {
      id         : 0,
      darkMode   : false,
      triggerMode: triggerMode.QUESTION,
      apiKey     : '',
      licenseKey : '',
      showSidebar: false,
      model      : gptModels[0]
    };
  }

  async saveUserSettings(settings: IUserSettings) {
    //console.log('db.saveUserSettings()', settings);

    return this.userSettings
    //https://stackoverflow.com/questions/57087581/dexiedb-put-method-not-working-when-adding-primary-key-as-argument
    .put(settings)
    .then(() => {
      return settings;
    })
    .catch(() => {
      return false;
    });
  }
  //#endregion --------------------- User Settings ---------------------


  //#region ------------------------ Conversations ---------------------
  async getConversation(conversationId: number) : Promise<IDBConversation | undefined> {
    return await this.conversations.get({id: conversationId}) || undefined;
  }

  async getConversations() : Promise<IDBConversation[]> {
    return await this.conversations.orderBy('timestamp').reverse().toArray() ?? [];
  }

  async saveConversation(conversation: IDBConversation) : Promise<number> {
    //console.log('db.saveConversation()', conversation);

    // https://dexie.org/docs/Table/Table.put()
    // https://stackoverflow.com/questions/57087581/dexiedb-put-method-not-working-when-adding-primary-key-as-argument
    return this.conversations
      .put(conversation)
      .then((conversationId: number) => {
        //console.log('db::savedConversation', conversation, conversationId);
        return conversationId;
      })
      .catch((error) => {
        console.log('db::saveConversationError', error);
        return 0;
      });
  }

  async updateConversation(id: number, changes: {[keyPath: string]: any }) : Promise<number> {
    //console.log('db.updateConversation()', key, changes);
    return this.conversations
      .update(id, changes)
      .catch((error) => {
        console.log('db::updateConversation', error);
        return 0;
      });
  }

  async deleteConversation(conversationId: number) {
    return await this.conversations.delete(conversationId);
  }
  //#endregion --------------------- Conversations ---------------------

  //#region ------------------------ Profiles ---------------------
  async getProfiles() : Promise<IDBProfile[]> {
    return await this.profiles.orderBy('id').toArray() ?? [];
  }

  async getProfile(profileId: number) : Promise<IDBProfile | 0> {
    //console.log('db.getProfile()', profileId);
    if (!profileId) {
      return 0;
    }

    return await this.profiles.get({id: profileId}) || 0;
  }

  async saveProfile(profile: IDBProfile) : Promise<number> {
    //console.log('db.saveProfile()', profile);

    if (profile.selected) {
      // make sure this is the only profile that is selected
      await this.profiles.where({ selected: 1 }).modify({ selected: 0 });
    }

    // https://dexie.org/docs/Table/Table.put()
    // https://stackoverflow.com/questions/57087581/dexiedb-put-method-not-working-when-adding-primary-key-as-argument
    return this.profiles
      .put(profile)
      .then((profileId: number) => {
        //console.log('db::savedProfile', profile, profileId);
        return profileId;
      })
      .catch((error) => {
        console.log('db::saveProfileError', error);
        return 0;
      });
  }

  async insertProfiles(profiles: IDBProfile[]) : Promise<number> {
    //console.log('db.insertProfiles()', profiles);
    // https://dexie.org/docs/Table/Table.put()
    // https://stackoverflow.com/questions/57087581/dexiedb-put-method-not-working-when-adding-primary-key-as-argument
    return this.profiles
      .bulkPut(profiles)
      .then((profileId: number) => {
        //console.log('db::insertProfiles', profiles, profileId);
        return profileId;
      })
      .catch((error) => {
        console.log('db::insertProfileError', error);
        return 0;
      });
  }

  async getActiveProfile() {
    return await this.profiles.where({ selected: 1 }).first();
  }

  async setAsDefaultProfile(profileId: number) {
    // set all other profiles to false
    await this.profiles.where({ selected: 1 }).modify({ selected: 0 });

    return this.profiles
      .update(profileId, { selected: 1 })
      .catch((/*error*/) => {
        //console.log('db::setAsDefaultProfileError', error);
        return 0;
    });
  }

  async deleteProfile(profileId: number) {
    return await this.profiles.delete(profileId);
  }
//#endregion --------------------- Profiles ---------------------
}

// export
export const db = new dbController();
