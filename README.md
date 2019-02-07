# vue-pug
Converts Vue template in **HTML** to **Pug** templating language (_formerly Jade_).  

## Install
Get it on [npm](https://www.npmjs.com/package/vue-pug):
```bash
npm i -g vue-pug
```
# Usage
```bash
vue-pug <Vue File>
```
or if you want to process all vue files recursively under the directory use
```bash
vue-pug <Directory>
```
# Example
```bash
vue-pug App.vue
```
Turns this :unamused:

*App.vue*
```html
<template>
  <div id="app">
    <img width="25%" src="./assets/logo.png">
    <hr/>
  </div>
</template>

<script>
  export default {
    name: "App"
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;    
  }
</style>
```

Into this :tada:

*App.vue*
```pug
<template lang="pug">
  #app
    img(width="25%", src="./assets/logo.png")
    hr
</template>

<script>
  export default {
    name: "App"
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }
</style>
```
