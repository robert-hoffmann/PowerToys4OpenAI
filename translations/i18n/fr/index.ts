export default {
  translation: {
    global: {
      save              : 'Enregistrer',
      close             : 'Fermer',
      edit              : 'Modifier',
      play              : 'Jouer',
      record            : 'Enregistrer',
      import            : 'Importer',
      export            : 'Exporter',
      upload            : 'Charger',
      cancel            : 'Annuler',
      delete            : 'Supprimer',
      retry             : 'Ressayer',
      missing           : 'manquant',
      settings          : 'Settings',
      search            : 'Poser une question',
      searchHint        : 'Ou développez un sujet',
      authError         : 'Désolé, quelque chose s\'est mal passé avec l\'authentification, veuillez vérifier votre clé API',
      comingSoon        : 'bientôt disponible',
      donate            : 'Faire un don de {{name}}',
      donateCopy        : 'Adresse {{name}} copié dans le presse-papier',
      copiedToClipBoard : 'Contenu copié dans le presse-papier',
    },
    components: {
      searchCompanion: {
        title      : 'Compagnon de recherche',
        login      : 'Connexion',
        search     : 'Chercher',
        searchHint : 'Développer ce sujet',
        clear      : 'Effacer l\'hitorique des conversations',
        copy       : 'Copier le résultat',
      },
      conversations: {
        me              : 'moi',
        welcome         : 'Bonjour, comment puis-je vous aider',
        title           : 'Conversations',
        newConversation : 'Nouvelle conversation',
        sttHint         : 'Vous pouvez l\'activer/désactiver avec CTRL+Espace',
        sttOn           : 'Reconnaissance Vocale: Activée',
        sttOff          : 'Reconnaissance Vocale: Désactivée',
        inputHint       : 'Vous pouvez valider avec CTRL+Entrée, ou utiliser la reconnaissance vocale avec CTRL+Espace',
        wordCount       : 'Nombre de mots',
      },
      profiles: {
        title         : 'Profils',
        newProfile    : 'Nouveau profil',
        selectProfile : 'Sélectionner un profil',
        selected      : 'Profil Actif: {{name}}'
      },
      settings: {
        general : 'Général',
        global  : 'Paramètres globaux'
      },
      searchSettings: {
        interfaceLanguage       : 'Langue de l\'interface',
        triggerModeTitle        : 'Mode de déclenchement',
        triggerModeManual       : 'Manuel',
        triggerModeManualHint   : 'Déclenchement uniquement sur clic manuel',
        triggerModeQuestion     : 'Question',
        triggerModeQuestionHint : 'Déclenchement uniquement si se termine par : ?',
        triggerModeAuto         : 'Automatique',
        triggerModeAutoHint     : 'Interroger systématiquement le moteur de recherche',
        apiKeyTitle             : 'Clé API',
        apiKeyHint              : 'Votre clé API OpenAI',
      }
    },
    pages : {
      profiles: {
        title       : 'Profils',
        active      : 'Actif',
        tags        : 'Tags',
        description : 'Déscription',
        prompt      : 'Invité de commande'
      }
    },
  }
};
