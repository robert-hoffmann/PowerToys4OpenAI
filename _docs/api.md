* https://platform.openai.com/docs/api-reference/completions/create

```js
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
```

```js
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
```

```js
conversation {
	timestamp: 1213456
	sent     : false,
	prompt   : 'hi there',
	template : 'prompt engineering'
}
```

```js
userSettings: {
	triggerMode: 1,
	darkMode   : false,
	apiKey     : 'sk-xxxxxx',
	licenseKey : 'sk-xxxxxx'
}
```
