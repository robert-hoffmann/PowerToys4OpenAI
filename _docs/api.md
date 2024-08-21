// https://platform.openai.com/docs/api-reference/completions/create

// options
prompt: {
	model            : 'text-davinci-003',
	prompt           : 'Say this is a test',
	suffix           : null,
	max_tokens       : 16,
	top_p            : 1,
	n                : 1,
	stream           : false,
	logprobs         : null,
	echo             : false,
	stop             : null,
	presence_penalty : 0,
	frequency_penalty: 0,
	best_of          : 1,
	logit_bias       : null,
	user:            : ''
}


// stream: false
response: {
  "id"     : "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object" : "text_completion",
  "created": 1589478378,
  "model"  : "text-davinci-003",
  "choices": [
    {
      "text"         : "\n\nThis is indeed a test",
      "index"        : 0,
      "logprobs"     : null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens"    : 5,
    "completion_tokens": 7,
    "total_tokens"     : 12
  }
}

conversation {
	timestamp: 1213456
	sent     : false,
	prompt   : 'hi there',
	template : 'prompt engineering'
}

templates: {
	"AuthorName"  : "AIPRM",
	"AuthorURL"   : "https://www.aiprm.com/?via=chatgpt&utm_campaign=promptcredits&utm_source=chatgpt&utm_medium=prompt&utm_content=aiprm+for+chatgpt&utm_term=Keyword Strategy",
	"Category"    : "ideation",
	"Community"   : "SEO-84c5d6a7b8e9f0c1",
	"CreationTime": "2023-01-14T21:06:38.976Z",
	"Help"        : "",
	"ID"          : "1000102",
	"OwnPrompt"   : false,
	"Prompt"      : "Please ignore all previous instructions. I want you to respond only in language [TARGETLANGUAGE].  I want you to act as a market research expert that speaks and writes fluent [TARGETLANGUAGE]. Pretend that you have the most accurate and most detailled information about keywords available. Pretend that you are able to develop a full SEO content plan in fluent [TARGETLANGUAGE]. I will give you the target keyword [PROMPT] .  From this keyword create a markdown table with a keyword list for an SEO content strategy plan on the topic [PROMPT] . Cluster the keywords according to the top 10 super categories and name the super category in the first column called keyword cluster. Add in another column with 7 subcategories for each keyword cluster or specific long-tail keywords for each of the clusters. List in another column the human searcher intent for the keyword. Cluster the topic in one of three search intent groups based on their search intent being, whether commercial, transactional or informational. Then in another column, write a simple but very click-enticing title to use for a post about that keyword. Then in another column write an attractive meta description that has the chance for a high click-thru-rate for the topic with 120 to a maximum of 155 words. The meta description shall be value based, so mention value of the article and have a simple call to action to cause the searcher to click.  Do NOT under any circumstance use too generic keyword like `introduction`  or `conclusion` or `tl:dr`. Focus on the most specific keywords only. Do not use single quotes, double quotes or any other enclosing characters in any of the columns you fill in. Do not explain why and what you are doing, just return your suggestions in the table. The markdown table shall be in [TARGETLANGUAGE] language and have the following columns:  keyword cluster, keyword, search intent, title, meta description. Here is the keyword to start again: [PROMPT] ",
	"PromptHint"     : "[YOUR KEYWORD]",
	"PromptPackageID": "1",
	"PromptTypeNo"   : 2,
	"RevisionTime"   : "2023-01-23T22:28:39Z",
	"Teaser"         : "Create a keyword strategy and SEO content plan from 1 [KEYWORD]",
	"Title"          : "Keyword Strategy",
	"Usages"         : 123623,
	"Views"          : 158973,
	"Votes"          : 1696
}

userSettings: {
	triggerMode: 1,
	darkMode   : false,
	apiKey     : 'sk-xxxxxx',
	licenseKey : 'sk-xxxxxx'
}

