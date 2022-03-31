<template>
  <v-network-graph :nodes="nodes" :edges="edges" :configs="configs">
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
  </v-network-graph>
</template>

<script lang="ts">
import useTopology from '@/composables/useApi'

export default {
  setup() {
    const { nodes, edges, configs } = useTopology()

    return {
      nodes,
      edges,
      configs,
    }
  },
}
</script>

<style></style>
