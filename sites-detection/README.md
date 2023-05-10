### Configuration file for detecting sites

This file holds all the information needed to inject the Search Companion into a site and *how* it should be injected

**Walkthrough:**

- Detect URL to see if we have a match
- Should it be injected as a sidebar or inline
  - If inline, see if we have a match to get the user input query
- Look if we have a container to attach to
  - If so, get the configuration info to apply for that container
    - append / prepend
    - any classes to add
    - any styles to apply
      - this is how we make sure padding, etc is ok

*Maybe in a future version we can add this directly to the interface*
