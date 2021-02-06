<template>
  <div class="hello">
    <back-line></back-line>
    <v-row>
      <v-col cols="6">
        <v-text-field label="Name*" outlined v-model="test"></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import BackLine from "@/components/Actions/BackLine";

@Component({
  components: { BackLine }
})
class PeruHomepage extends Vue {
  test = null;
}
export default PeruHomepage;
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
