<template lang="pug">
p.text-4xl.font-bold CPU ACTIVITY
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

  // // polling
  // setInterval(async () => {
  //   try {
  //     data = await fetch('/api/data').then((s) => s.text())
  //     // console.log(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, 10000)

  // try {
  //   wsConnect() // not sure why it doesn't work
  // } catch (error) {
  //   console.log(error)
  // }
  data = await fetch('/api/data').then((s) => s.json())
  makePies(data)
})

function makePies(data) {
  data = normalizeData(data)
  const width = 500
  const height = 500
  const margin = 40
  const donutWidth = 10
  const donutCenter = 10
  // console.log(data)
  let svg = d3.select(graph.value).append('svg').attr('width', width).attr('height', height)
  for (let threadCount = 0; threadCount < data.times.length; threadCount++) {
    const radius = Math.min(width, height) / 2 - donutWidth * threadCount - margin
    const color = d3.scaleOrdinal().range(d3.schemeDark2)
    // const color = d3.scaleOrdinal().domain(['a', 'b', 'c', 'd']).range(['red', 'green', 'blue', 'white'])

    const timesData = data.times[threadCount]

    svg.append('g')

    // Compute the position of each group on the pie:
    //@ts-ignore
    const pie = d3
      .pie()
      //@ts-ignore
      .value((d) => d[1])
      .sort(null)
    //@ts-ignore
    const pieData = pie(timesData)

    const innerRadius = donutWidth
    const arc = d3
      .arc()
      .innerRadius(radius - innerRadius)
      .outerRadius(radius)

    svg
      .selectAll('hello')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data[0]))
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .attr('transform', `translate(${width / 2},${height / 2})`)
  }
  //@ts-ignore
  function normalizeData(data) {
    const { model, speed } = data[0]
    const nData = { model, speed, times: <any>[] }
    for (const d of data) {
      const temp = []
      for (const type in d.times) temp.push([type, d.times[type]])
      nData.times.push(temp)
    }
    return nData
  }
}
</script>
