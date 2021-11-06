<template lang="pug">
p Helloworld
v-btn Main - Pug only hello 123.123
br
Sub1
br
Sub2
</template>

<script setup lang="ts">
import { ref } from 'vue'
//@ts-ignore
import Sub1 from './Sub1.vue'
//@ts-ignore
import Sub2 from './Sub2.vue'

</script>
