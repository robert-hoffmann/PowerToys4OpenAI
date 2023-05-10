export interface SearchEngines {
  /** Website name */
  name: string,

  /** If URL matches, then module will be loaded */
  url: RegExp,

  /** Possible target containers */
  targets: Configuration[],

  /** If site supports sidebar injection **/
  addSidebar: boolean
}[]

export interface Configuration {
  /**
   * From where to extract the users search phrase
   * @type {query selector}
   * */
  userInputs: string[],

  /** Array of possible targets of where the module will be attached to in the DOM */
  containers: string[],

  /** How to add the module to the selector */
  method: 'append' | 'prepend',

  /** Classes to add to the component */
  classes?: string[],

  /** Styles to apply to the component  */
  styles?: {
    [key: string]: string
  }[]
}

export const config: SearchEngines[] = [
  {
    name       : 'Google Search',
    url        : /https?:\/\/.*(google)\.[a-z]{2,3}\/search\?.*(q=.*)/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "input[name='q']",
          "textarea[name='q']"
        ],
        containers: [
          '#rhs'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ]
      },
      {
        userInputs : [
          "input[name='q']",
          "textarea[name='q']"
        ],
        containers: [
          '#rcnt'
        ],
        method    : 'append',
        classes   : [
          'ptoia-companion-sidecontent',
          'append'
        ],
        styles: [
          { marginLeft: '30px' },
          { width     : '367px' }
        ]
      }
    ],
  },
  {
    name       : 'Bing Search',
    url        : /https?:\/\/.*(bing)\.[a-z]{2,3}\/search\?.*(q=.*)/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "[name='q']"
        ],
        containers: [
          '#b_context'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ],
        styles: [
          { margin: '0px 0px 20px -20px' },
          { width : '108%' }
        ]
      }
    ],
  },
  {
    name       : 'Yahoo Search',
    url        : /https?:\/\/.*(search\.yahoo)\.[a-z]{2,3}\/search\?.*(p=.*)/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "[name='p']"
        ],
        containers: [
          '#right',
          '.Contents__inner.Contents__inner--sub'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ],
        styles: [
          { margin: '0px 0px 20px 0px' },
          { width : '370px' }
        ]
      },
      {
        userInputs : [
          "[name='p']"
        ],
        containers: [
          '#cols',
          '#contents__wrap'
        ],
        method    : 'append',
        classes   : [
          'ptoia-companion-sidecontent',
          'append'
        ],
        styles: [
          { margin: '0px 0px 20px 0px' },
          { width : '370px' }
        ]
      }
    ],
  },
  {
    name       : 'DuckDuckGo Search',
    url        : /https?:\/\/.*(duckduckgo)\.[a-z]{2,3}\/\?.*(q=.*)/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "input[name='q']"
        ],
        containers: [
          '.results--sidebar.js-results-sidebar'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ],
        styles: [
          { margin: '0 0 10px 0' },
          { width : '100%' }
        ]
      },
      {
        userInputs : [
          "input[name='q']"
        ],
        containers: [
          '#links_wrapper'
        ],
        method    : 'append',
        classes   : [
          'ptoia-companion-sidecontent',
          'append'
        ],
        styles: [
          { margin: '0 0 10px 0' },
          { width : '100%' }
        ]
      }
    ],
  },
  {
    name       : 'Baidu Search',
    url        : /https?:\/\/.*(baidu)\.[a-z]{2,3}\/s?.*/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "input[name='wd']"
        ],
        containers: [
          '#content_right'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ],
        styles: [
          { width     : '367px' }
        ]
      },
      {
        userInputs : [
          "input[name='wd']"
        ],
        containers: [
          '#container'
        ],
        method    : 'append',
        classes   : [
          'ptoia-companion-sidecontent',
          'append'
        ],
        styles: [
          { width     : '367px' }
        ]
      }
    ],
  },
  {
    name       : 'Yandex Search',
    url        : /https?:\/\/.*(yandex)\.[a-z]{2,3}\/search\/\?.*(text=.*)/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "input[name='text']"
        ],
        containers: [
          '#search-result-aside'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ],
        styles: [
          { margin: '0 0 10px 0' },
          { width : '100%' }
        ]
      }
    ],
  },
  {
    name       : 'Naver Search',
    url        : /https?:\/\/.*(search\.naver)\.[a-z]{2,3}\/search.naver\?.*/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "input[name='query']"
        ],
        containers: [
          '#sub_pack'
        ],
        method    : 'prepend',
        classes   : [
          'ptoia-companion-prepend'
        ],
        styles: [
          { margin: '0px 0px 15px 16px' },
          { width : '400px' }
        ]
      },
      {
        userInputs : [
          "input[name='query']"
        ],
        containers: [
          '#content'
        ],
        method    : 'append',
        classes   : [
          'ptoia-companion-sidecontent',
          'append'
        ],
        styles: [
          { margin: '0px 0px 15px 16px' },
          { width : '400px' }
        ]
      }
    ],
  },
  {
    name       : 'Brave Search',
    url        : /https?:\/\/.*(search\.brave)\.[a-z]{2,3}\/search\?.*(q=.*)/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "[name='q']"
        ],
        containers: [
          '#side-right'],
        method    : 'prepend',
        styles: [
          { margin: '0px 0px 20px 0px' },
          { width : '370px' }
        ]
      }
    ],
  },
  {
    name       : 'SearX Search',
    url        : /https?:\/\/.*(searx\.thegpm)\.[a-z]{2,3}\/.*/,
    addSidebar : false,
    targets: [
      {
        userInputs : [
          "input[name='q']"
        ],
        containers: [
          '#sidebar_results'],
        method    : 'prepend',
        styles: [
          { width : '360px' }
        ]
      }
    ],
  },
  {
    name       : 'Other Sites',
    url        : /https?:\/\/(.*)\.[a-z]{2,3}/i,
    addSidebar : true,
    targets: [
      {
        userInputs : [],
        containers : [
          'body'
        ],
        method    : 'append',
        styles: [
          { margin   : '0px 0px 20px 0px' },
          { width    : '450px' },
          { position : 'absolute' },
          { top      : '150px' },
          { right    : '0' },
          { zIndex   : '9999' },
        ]
      }
    ],
  },
]
