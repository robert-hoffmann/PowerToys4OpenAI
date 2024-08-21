# Todo (later)
* Knowledge graph: type question, generate 3 ansers, click an answer, and generate 3 more ..etc
  * https://visjs.github.io/vis-network/
  * https://twitter.com/hturan/status/1641780868640374784
* implement writing interface like youwrite, with customizable templating language
* use whisper to generate transcripts automatically ?
  * you can query them, but probably run into limitations, unless linked to pinecone or something
* add these settings directly to search companion, IE
    * change language
    * change profile
      * OpenAI settings should be linked to profile
      * Thus profile should be linked to conversation history
* add tts support (listen)
* link profile to OpenAI settings
* save/update (previous) conversation
* add token price to db & settings (should probably be updated after each [DONE] event)
* make translation loadable on demand insted of embedding them in the code
* Add word count to search companion (..or not)

# Refactoring
* move (when possible) event handlers, to routes with arguments
* in settings add: (always reply in selected language) toggle
* add a little animation to show you can delete via swipe
* see what error 600 is
* redo openAI web service to handle errors and stuff
  - https://platform.openai.com/docs/guides/error-codes/api-errors
* move db intialization directly to dbController ?

# Todo (0.3.0)
* Fixed and error with some status code not being handled correctly (done)
* Added some language codes for PT and ZH, see how this works out on next app store submission
* Make the text selection with ALT+C more useful
* Sometimes the open sidebar button becomes unresponsive, see why (done, but needs improvement)
  * some strange binding error that doubles every time the conversation panel is opened
  * RXJS has some problems, better to use an event handler when settings change and broadcast the event
  * temporarily fixed by using a throttle()
* Add popup for ratings, with setting to forget or remind
* Sync settings with Search Companion
* Clean up the way showing/hiding certain buttons work in the Search Companion
* Sometimes OpenAI response is unresponsive, see why, and add a timout with error if possible
* exploit system./user type prompts
  * verify DB
  * verify default profiles file
* there is a problem that if a message is in progress and you click new conversation, that some stuff stays in memory
* Verify if getFullyQualifiedLanguage() really needs to return en-US, etc (if so, update all supported languages)
  * https://www.andiamo.co.uk/resources/iso-language-codes/
* Use a timeout when sending a request to detect that something is wrong and do a retry

# Bugs
* DONE :: input.focus() doesn't work always in ConversationsPage
* Extension does not work in Brave (need to use event system for storage)
