<template>
  <v-container class="home">
    <h1>
      Bienvenue dans la chasse aux trésors!
    </h1>
    <v-row>
      <v-col>
        Cette interface a pour but de générer une chasse aux trésors de Carbon.
        (AHAH)
        <br />
        Les fichier seinter trouvent dans le projet back
        (back_adventure/src/ressources/data/input/). Placez les votres dans ce
        dossier, actualisez, et selectionnez le dans le tableau ci dessous
        <br />
        Les fichiers de résultats se trouveront également dans le projet back à
        la fin de l'aventure (back_adventure/src/ressources/data/output/).
        L'output sera sous le formalisme 'output_+nomfichierentrée'
        <br />
        Vous pouvez les éditer/ajouter autant que vous le souhaitez. Ensuite,
        lancez l'application par ce bouton ou réactualisez votre page si vous
        êtes sur le jeu. <br />
        Le bouton ci dessous lancera le dernier fichier généré, ou le fichier de
        démo si vous n'avez jamais utilisé l'application
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="6" v-if="listFiles.length > 0">
        <v-slide-x-transition appear>
          <v-data-table
            :items="listFiles"
            :headers="headers"
            @click:row="select"
            class="elevation-1 row-pointer"
          >
          </v-data-table>
        </v-slide-x-transition>
      </v-col>
      <v-col v-else>
        <div class="center-screen">
          <v-progress-circular
            indeterminate
            :size="70"
            :width="7"
            color="primary"
          ></v-progress-circular>
        </div>
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
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Component } from "vue-property-decorator";
import LocalStorageUtils, { LIST_KEYS } from "@/Utils/LocalStorageUtils";

@Component({
  computed: {
    ...mapGetters({
      dataMap: "getDataMap",
      dataJoueurs: "getDataJoueurs",
      listFiles: "getListFiles"
    })
  },
  methods: {
    ...mapActions({
      getDataFile: "GET_DATA_FILE",
      getAllFilesNames: "GET_ALL_FILES_NAMES"
    })
  }
})
class Home extends Vue {
  headers = [{ text: "Nom de fichier", value: "name" }];
  loading = false;
  created() {
    this.getAllFilesNames();
  }

  select(value) {
    LocalStorageUtils.setItem(LIST_KEYS.SELECTED_FILE, value.name);
    this.gotToPeru();
  }

  async gotToPeru() {
    this.loading = true;
    const response = await this.getDataFile();
    this.loading = false;
    if (response && response.status === 200) {
      this.$router.push({ name: "peru-homepage" });
    }
  }
}
export default Home;
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
