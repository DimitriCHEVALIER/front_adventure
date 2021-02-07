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
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {},
  methods: {
    ...mapActions({
      getDataFile: "GET_DATA_FILE"
    }),
    async gotToPeru() {
      await this.getDataFile();
      await this.$router.push({ name: "peru-homepage" });
    }
  }
};
</script>
