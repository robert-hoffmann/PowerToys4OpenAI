export default {
  translation: {
    messages: {
      copiedToClipBoard: 'Content copied to clip-board',
    },
    ui: {
      me         : 'me',
      save       : 'Save',
      close      : 'Close',
      edit       : 'Edit',
      play       : 'Play',
      record     : 'Record',
      import     : 'Import',
      export     : 'Export',
      cancel     : 'Cancel',
      delete     : 'Delete',
      missing    : 'missing',
      search     : 'Ask a question',
      searchHint : 'Or expand on a topic',
      welcome    : 'Hi there, how may i assist you',
      authError  : 'Sorry, something went wrong with authentication, please check your API key',
      comingSoon : 'coming soon',
      donate     : 'Donate {{name}}',
      donateCopy : '{{name}} address copied to clipboard'
    },
    searchCompanion: {
      title      : 'Search Companion',
      login      : 'Login',
      retry      : 'Retry',
      search     : 'Search',
      searchHint : 'Expand on this topic',
      settings   : 'Settings',
      clear      : 'Clear conversation history',
      copy       : 'Copy the result',
      cancel     : 'Cancel'
    },
    components: {
      conversations: {
        title           : 'Conversations',
        newConversation : 'New conversation',
        sttHint         : 'Toggle listening with CTRL+SpaceBar',
        sttOn           : 'Speech Recognition: Activated',
        sttOff          : 'Speech Recognition: Deactivated',
        inputHint       : 'You can validate with CTRL+Enter, or use speech recognition with CTRL+SpaceBar',
      },
      profiles: {
        title        : 'Profiles',
        newProfile   : 'New profile',
        selectProfile: 'Select a profile',
        upload       : 'Upload',
        cancel       : 'Cancel',
        selected     : 'Active Profile: {{name}}'

      },
      settings: {
        settings   : 'Settings',
        general    : 'General',
        global     : 'Global settings'
      }
    },
    pages : {
      profiles :  {
        title       : 'Title',
        active      : 'Active',
        tags        : 'Tags',
        description : 'Description',
        prompt      : 'System prompt',
      }
    },
    help: {
      intro1        : 'You will need your OpenAI API key to use this extension.',
      intro2        : 'This application is fully self hosted, and does not use a server or third party service',
      intro3        : 'everything that happens here, is between you and OpenAI',
      step1Title    : 'Create account',
      step1Content1 : 'Create an account with OpenAI, validate your email address and your phone number.',
      step2Title    : 'Configure billing',
      step2Content1 : 'Go to account management, add your billing information, and set your usage limits.',
      step2Content2 : 'Pricing is based on the number of requests you make to the API, and the size of the request.',
      step2Content3 : 'In a nutshell, it costs about $1 for the equivalent amount of content of a 1000 page book.',
      step3Title    : 'Create API key',
      step3Content1 : 'Go to manage your API keys, add a new one, then paste it below by clicking on « configure »',
      step3Content2 : 'Once this is done, you can close this window and the extension will work with supported search engines',
      stepperNext   : 'Continue',
      stepperBack   : 'Back',
      stepperFinish : 'Configure'
    },
    settings: {
      searchCompanion: {
        title                   : 'Settings',
        interfaceLanguage       : 'Interface language',
        triggerModeTitle        : 'Trigger Mode',
        triggerModeManual       : 'Manual',
        triggerModeManualHint   : 'Only trigger search on manual click',
        triggerModeQuestion     : 'Question',
        triggerModeQuestionHint : 'Only trigger search if ending with: ?',
        triggerModeAuto         : 'Automatic',
        triggerModeAutoHint     : 'Systematically query the search engine',
        apiKeyTitle             : 'API Key',
        apiKeyHint              : 'Your OpenAI API key'
      }
    }
  }
};
