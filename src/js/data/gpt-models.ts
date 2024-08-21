export const gptModels = [
  {
    label    : 'GPT 3.5 (4 096 tokens)',
    value    : 'gpt-3.5-turbo',
    maxTokens: 4096,
    pricing: {
      prompt     : 0.0015,
      completion : 0.002
    }
  },
  {
    label    : 'GPT 3.5 (16 384 tokens)',
    value    : 'gpt-3.5-turbo-16k',
    maxTokens: 16384,
    pricing: {
      prompt     : 0.003,
      completion : 0.004
    }
  },
  {
    label    : 'GPT 4 (8 192 tokens)',
    value    : 'gpt-4',
    maxTokens: 8192,
    pricing: {
      prompt     : 0.03,
      completion : 0.06
    }
  },
  {
    label    : 'GPT 4 (32 768 tokens)',
    value    : 'gpt-4-32k',
    maxTokens: 32768,
    pricing: {
      prompt     : 0.06,
      completion : 0.12
    }
  }
]
