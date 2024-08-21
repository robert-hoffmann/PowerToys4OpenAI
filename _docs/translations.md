### How to translate (or fix a typo)

* **i18n/en/index.ts** contains all the english translations
* **i18n/fr/index.ts** contains all the french translations
* **i18n/types.ts** is used in the application to provide **strongly typed** translations, instead of using *magic strings*
* **_docs/store-listing** contains the translations for the app store (full description)
* **src-bex/_locales contains** translations for the for the app store (name, title, short description)


#### To add a translation, you must

* Fork the project
* Duplicate the existing folders or files, for example copy en/* to de/*
* Translate all entries to the new language
* Make a pull request

_**i18n/types.ts should not need to be touched, unless adding new entries**_
