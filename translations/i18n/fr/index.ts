export default {
  translation: {
    messages: {
      hello            : 'Bonjour {{name}}',
      copiedToClipBoard: 'Contenu copié dans le presse-papier',
    },
    ui: {
      me         : 'moi',
      save       : 'Enregistrer',
      close      : 'Fermer',
      play       : 'Jouer',
      record     : 'Enregistrer',
      import     : 'Importer',
      export     : 'Exporter',
      cancel     : 'Annuler',
      delete     : 'Supprimer',
      missing    : 'manquant',
      search     : 'Poser une question',
      searchHint : 'Ou développez un sujet',
      welcome    : 'Bonjour, comment puis-je vous aider',
      authError  : 'Désolé, quelque chose s\'est mal passé avec l\'authentification, veuillez vérifier votre clé API',
      comingSoon : 'bientôt disponible',
      donate     : 'Faire un don de {{name}}',
      donateCopy : 'Adresse {{name}} copié dans le presse-papier'
    },
    searchCompanion: {
      title      : 'Compagnon de recherche',
      login      : 'Connexion',
      retry      : 'Ressayer',
      search     : 'Chercher',
      searchHint : 'Développer ce sujet',
      settings   : 'Paramètres',
      clear      : 'Effacer l\'hitorique des conversations',
      copy       : 'Copier le résultat',
      cancel     : 'Annuler'
    },
    components: {
      conversations: {
        title           : 'Conversations',
        newConversation : 'Nouvelle conversation',
      },
      profiles: {
        title         : 'Profils',
        newProfile    : 'Nouveau profil',
        selectProfile : 'Sélectionner un profil',
        upload        : 'Charger',
        cancel        : 'Annuler',
        selected      : 'Profil ({{name}}) est maintenant actif pour les nouvelles conversations',
      },
      settings: {
        settings   : 'Paramètres',
        general    : 'Général',
        global     : 'Paramètres globaux'
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
    help: {
      intro1        : 'Vous aurez besoin de votre clé API OpenAI pour utiliser cette extension.',
      intro2        : 'Cette application est entièrement auto-hébergée, et ne fait pas appel à un serveur ou un service tiers',
      intro3        : 'tout ce qui se passe ici, est entre vous et OpenAI',
      step1Title    : 'Créer un compte',
      step1Content1 : 'Créez un compte avec OpenAI, validez votre adresse email et votre numéro de téléphone.',
      step2Title    : 'Configurer la facturation',
      step2Content1 : 'Accédez à la gestion de compte, configurez vos infos de facturation et limites d\'utilisation.',
      step2Content2 : 'La tarification est basée sur le nombre de requêtes que vous faites à l\'API et la taille de la requête.',
      step2Content3 : 'En un mot, il en coûte environ $1 pour la quantité équivalente de contenu d\'un livre de 1000 pages.',
      step3Title    : 'Créer une clé API',
      step3Content1 : 'Allez dans gérer vos clés API, ajoutez-en une nouvelle, puis collez-la ci-dessous en cliquant sur « configurer »',
      step3Content2 : 'Une fois cela fait, vous pouvez fermer cette fenêtre et l\'extension fonctionnera avec les moteurs de recherche pris en charge',
      stepperNext   : 'Continuer',
      stepperBack   : 'Retour',
      stepperFinish : 'Configurer'
    },
    settings: {
      searchCompanion: {
        title                   : 'Réglages',
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
    }
  }
};
