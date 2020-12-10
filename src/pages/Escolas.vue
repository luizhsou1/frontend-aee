<template>
  <q-page padding class="flex flex-center">
    <div class="events-page">
      <dt-escolas />
    </div>
    <di-escolas/>
  </q-page>
</template>

<script>
import dtescolas from 'src/components/escolas/dt-escolas.vue'
import diescolas from 'src/components/escolas/di-escolas.vue'

export default {
  name: 'page-escolas',
  components: {
    'dt-escolas': dtescolas,
    'di-escolas': diescolas
  }
}
</script>

<style lang="stylus">
.events-page {
  width: 100%;
  min-height: 80vmin;
  border-radius: 6px;
  border: none;
}
</style>
