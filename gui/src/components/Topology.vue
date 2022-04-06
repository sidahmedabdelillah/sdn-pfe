<template>
  <v-network-graph :nodes="nodes" :edges="edges" >
    <!-- Use CSS to define references to external fonts.
         To use CSS within SVG, use <defs>. -->
    <defs>
      <!-- Cannot use <style> directly due to restrictions of Vue. -->
      <component is="style">
        @font-face { font-family: 'Material Icons'; font-style: normal;
        font-weight: 400; src:
        url(https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)
        format('woff2'); }
      </component>
    </defs>

    <!-- Replace the node component -->
    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <!-- circle for filling background -->
      <circle
        class="face-circle"
        :r="config.radius * scale"
        fill="#ffffff"
        v-bind="slotProps"
      />
      <!--
        The base position of the <image /> is top left. The node's
        center should be (0,0), so slide it by specifying x and y.
      -->
      <image
        class="face-picture"
        :x="-config.radius * scale"
        :y="-config.radius * scale"
        :width="config.radius * scale * 2"
        :height="config.radius * scale * 2"
        :xlink:href="nodes[nodeId].icon"
        clip-path="url(#faceCircle)"
      />
      <!-- circle for drawing stroke -->
      <circle
        class="face-circle"
        :r="config.radius * scale"
        fill="none"
        stroke="#808080"
        :stroke-width="1 * scale"
        v-bind="slotProps"
      />
    </template>

    <template #edge-label="{ edgeId, edge, scale, ...slotProps }">
      <v-edge-label
        :text="`${traffics[edge.source][edge.target]}`"
        align="source"
        vertical-align="above"
        v-bind="slotProps"
        fill="#ff5500"
        :font-size="12 * scale"
      />
    </template>

    <template #edges-label="{ edges, ...slotProps }">
      <v-edge-label
        :text="summarizedEdgeLabel(edges)"
        align="center"
        vertical-align="above"
        v-bind="slotProps"
      />
    </template>
  </v-network-graph>
</template>

<script lang="ts">
import useTopology from '@/composables/useApi.ts'

import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { HostType } from '@/types/responses/hostType'

import { formatBytes } from '@/lib/helpers'
export default {
  setup() {
    const hostsData = ref<HostType[]>([])

    const { nodes, edges, configs, traffics } = useTopology()

    const webSocket = new WebSocket('ws://127.0.0.1:8080/simpleswitch/ws')

    onMounted(async () => {
      const { data }: AxiosResponse<HostType[]> = await axios.get(
        'http://127.0.0.1:8080/v1.0/topology/hosts'
      )

      hostsData.value = data
    })

    webSocket.onmessage = function (event) {
      const d = JSON.parse(event.data)
      if (d.method == 'event_switch-stats') {
        const { data } = d

        const trafic = traffics.value[data.switch]

        const switchId = data.switch.replace('switch-', '')

        const host = hostsData.value.find((i: HostType) => {
          return i.port.dpid == switchId && i.port.port_no == data.port
        })

        if (host) {
          traffics.value[data.switch][`host-${host.mac}`] = formatBytes(
            data.speed_in
          )
        }
      }
    }
    

    const  summarizedEdgeLabel =  (edges: Record<string, Edge>) =>  {
        const edgeList = Object.values(edges)
        return ``
    }
    return {
      nodes,
      edges,
      configs,
      traffics,
      hostsData,
      summarizedEdgeLabel
    }
  },
}
</script>

<style></style>
