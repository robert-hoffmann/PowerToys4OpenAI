### How to translate

* i18n/en/index.ts contains all the english translations
* i18n/fr/index.ts contains all the french translations
* i18n/types.ts is used in the application to provide strongly typed translations, instead of using magic strings


#### To add a translation, you must

* Duplicate one of the existing folders, for example copy en/* to de/*
* Translate all entries to the new language

types.ts should not need to be touched, unless adding new entries