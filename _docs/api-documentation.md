# Usage nomenclature

## To call a function in a library use the following syntax:

`bridge.send('destination.function', data)`

```js
bridge.send('background.displayNotification', {
  title  : 'Hello',
  message: 'World'
})
.then(response => {
  // do something
  console.log(response.success);
})
```

* To listen for a function in a library use the following syntax:

(this should be in the appropriate library file)
```js
  bridge.on('background.displayNotification', ({ data, respond }) => {
    chrome.notifications.create('', {
      title   : data.title,
      message : data.message,
      iconUrl : data.icon ? data.icon : 'www/logo.png',
      type    : 'basic'
    });

    respond({ success: true });
  });
```

## To listen to an event use the following syntax:

`bridge.send('origin::event', data)`

```js
bridge.send('companionPage::onMounted', {
  title  : 'Hello',
  message: 'World'
})
.then(response => {
  // do something
  console.log(response.success);
})
```

(this can be anywhere in the project)
```js
  bridge.on('companionPage::onMounted', ({ data, respond }) => {
    // do something

    respond({ success: true });
  });
```
