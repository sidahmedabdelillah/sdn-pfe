<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import SidePanel from '@/components/SideNav.vue'
</script>

<template>
  <main class="grid">
    <HelloWorld class="col-8"  />
    <div class="col-4" style="padding : 0 ;">
      <SidePanel />
    </div>
  </main>
</template>
