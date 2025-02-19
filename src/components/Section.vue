<template lang="">
  <section>
    <!-- SECTION START -->
    <router-view></router-view>
    <!-- SECTION END -->
    <div class="gg">
      알림 Section
    </div>
  </section>
</template>
<script>
export default {
  name: "Section",
};
</script>
<style>
section {
  position: relative;
}
.gg {
  margin-left: 300px;
  font-size: 300px;
}
</style>
