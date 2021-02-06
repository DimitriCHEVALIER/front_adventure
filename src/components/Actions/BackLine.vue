<template>
  <v-row class="line-back">
    <v-col @click="back">
      <v-icon>mdi-chevron-left</v-icon> Back
      <v-divider></v-divider>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component()
class BackLine extends Vue {
  back() {
    this.$router.back();
  }
}
export default BackLine;
</script>
<style scoped>
.line-back {
  cursor: pointer;
}
</style>
