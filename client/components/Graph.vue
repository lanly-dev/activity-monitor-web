<template lang="pug">
svg.mx-auto(ref='graph')
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
const graph = ref()

onBeforeMount(async () => {
  let data = null
  const wsConnect = () => {
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:3000/api/ws/data')

    socket.onmessage = (event) => {
      console.log(event)
      console.log('onmessage', event.data)
    }

    socket.onopen = function (event) {
      this.send('hello')
    }
  }

  // polling
  setInterval(async () => {
    try {
     data = await fetch('/api/data').then((s) => s.text())
     console.log(data)
    } catch (error) {
      console.log(error)
    }
  }, 10000)

  try {
    wsConnect() // not sure why it doesn't work
  } catch (error) {
    console.log(error)
  }
})

onMounted(() => {
  const svg = d3.select(graph.value)
  const g = svg.append('g')

  g.append('g')
    .selectAll('g')
    .data([5, 10, 20, 40])
    .enter()
    .append('rect')
    .attr('fill', 'green')
    .attr('x', (d) => d)
    .attr('y', (d) => d)
    .attr('height', (d) => d)
    .attr('width', (d) => d)
})
</script>
