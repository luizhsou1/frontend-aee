<template>
  <q-layout view="lHh Lpr lFf">
    <q-page class="flex flex-center bottom-walpaper">
      <router-view class="area-content" />
    </q-page>
  </q-layout>
</template>

<script>
export default {
  name: 'PageExternal'
}
</script>

<style lang="stylus">
.bottom-walpaper {
  background-image: url('https://picsum.photos/1920/1080?random');
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-position: top;
  background-size: cover;
  margin: 0;
  padding: 0;
  border: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.bottom-walpaper::before {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  left: 0;
  top: 0;
  content: '';
  background: rgba(0, 0, 0, 0.6);
}

.area-content {
  z-index: 9999 !important;
}
</style>
