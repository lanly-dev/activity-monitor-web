<template lang="pug">
.flex.justify-center(ref='graph')
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
      // console.log(data)
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
  // set the dimensions and margins of the graph
  const width = 450
  const height = 450
  const margin = 40

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin

  const svg = d3
    .select(graph.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  const dummyData = { a: 12, b: 19, c: 55, d: 85 }

  // const color = d3.scaleOrdinal().domain(['a', 'b', 'c', 'd']).range(['red', 'green', 'blue', 'white'])
  const color = d3.scaleOrdinal().range(d3.schemeDark2)

  // Compute the position of each group on the pie:
  //@ts-ignore
  const pie = d3
    .pie()
    //@ts-ignore
    .value((d) => d[1])
    .sort(null)
  //@ts-ignore
  const data_ready = pie(Object.entries(dummyData))

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  const dArc = d3
    .arc()
    .innerRadius(100) // This is the size of the donut hole
    .outerRadius(radius)

  svg
    .selectAll('whatever')
    .data(data_ready)
    .join('path')
    .attr('d', dArc)
    .attr('fill', (d) => color(d.data[0]))
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('opacity', 0.7)
})
</script>
