<template lang="pug">
svg.mx-auto(ref='graph')
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
const graph = ref()
onMounted(() => {

  console.log(graph)
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
