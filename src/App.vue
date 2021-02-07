<template>
  <v-app>
    <v-snackbar :color="snackBarColor" v-model="displaySnackBar" top right>
      <span v-html="snackBarText"></span>
      <v-btn text @click="displaySnackBar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import { EventBus } from "@/eventBus";

export default {
  name: "App",
  created() {
    EventBus.$on("showSnackBar", data => {
      this.displaySnackBar = true;
      this.snackBarColor = data.type;
      this.snackBarText = data.message;
    });
  },
  data: function() {
    return {
      snackBarColor: "error",
      snackBarText: "I don't have any message for you :(",
      displaySnackBar: false
    };
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
