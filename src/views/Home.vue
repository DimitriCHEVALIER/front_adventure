<template>
  <v-container class="home">
    <h1>
      Bienvenue dans la chasse aux trésors!
    </h1>
    <v-row>
      <v-col>
        Cette interface a pour but de générer une chasse aux trésors en Carbon.
        (AHAH)
        <br />
        Le fichier d'aventure se trouve dans le projet back
        (back_adventure/src/ressources/data/input/config-peru.txt)
        <br />
        La fichier de résultat se trouvera également dans le projet back à la
        fin de l'aventure.
        (back_adventure/src/ressources/data/output/output_Adventure.txt)
        <br />
        Vous pouvez les éditer autant que vous le souhaitez. Ensuite, lancez
        l'application par ce bouton ou réactualisez votre page si vous êtes sur
        le jeu.
      </v-col>
    </v-row>
    <v-btn
      color="primary text-transform-none"
      dark
      rounded
      class="my-2 text-transform-none"
      @click="gotToPeru"
      :loading="loading"
    >
      Let's go to peru!
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {},
  data: function() {
    return {
      loading: false
    };
  },
  methods: {
    ...mapActions({
      getDataFile: "GET_DATA_FILE"
    }),
    async gotToPeru() {
      this.loading = true;
      await this.getDataFile();
      this.loading = false;
      this.$router.push({ name: "peru-homepage" });
    }
  }
};
</script>
