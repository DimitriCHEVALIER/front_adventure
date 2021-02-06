<template>
  <div class="hello">
    <v-text-field label="Name*" outlined v-model="test"></v-text-field>
  </div>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
class HelloWorld extends Vue {
  test = null;
}
export default HelloWorld;
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
