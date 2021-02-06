<template>
  <div class="home">
    <v-btn
      color="primary text-transform-none"
      dark
      rounded
      class="my-2 text-transform-none"
      @click="gotToPeru"
    >
      Let's go to peru!
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  methods: {
    gotToPeru() {
      this.$router.push({ name: "peru-homepage" });
    }
  }
};
</script>
