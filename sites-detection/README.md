### Configuration file for detecting sites

This file holds all the information needed to inject the Search Companion into a site and how it should be injected

**Walkthrough:**

- Detect URL to see if we have a match
- Should it be injected as a sidebar or inline
  - If inline, we see if we have a match to get the user input query
- Look if we have a container to attach to
  - If so, get the configuration info to apply
    - append / prepend
    - any classes to add
    - any styles to apply
