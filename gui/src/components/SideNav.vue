<template>
  <div class="side-panel">
    <label for="">true / active</label>
    <vs-switch v-model="checked" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  name: 'sidePanel',
  components: {},

  setup() {
    const checked = ref<boolean>(false)

    return {
      checked,
    }
  },
}
</script>
