<template>
  <v-container fluid>
    <v-row class="line-back">
      <v-col cols="1">
        <v-btn text class="" @click="back">
          <v-icon>mdi-chevron-left</v-icon> Retour
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-container>
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
