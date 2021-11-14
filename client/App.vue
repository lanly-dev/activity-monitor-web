<template lang="pug">
//- TODO color doens't works
nav.font-sans.flex.py-4.px-6.shadow(class='sm:flex-row sm:text-left sm:justify-between sm:items-baseline')
  .mb-2(class='sm:mb-0'): router-link.text-2xl.text-grey-darkest(to='/' class='hover:text-blue-dark') Home
  div: router-link.text-lg.no-underline.text-grey-darkest.ml-2(to='/about' class='hover:text-blue-dark') About
.m-5
  router-view(v-slot='{ Component }'): suspense: component(:is='Component')
</template>

<style>
@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('./assets/fonts/Inter-Italic.woff2#iefix') format('woff2'),
    url('./assets/fonts/Inter-Italic.woff') format('woff');
}
.inter {
  font-family: 'Inter';
}
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
</style>