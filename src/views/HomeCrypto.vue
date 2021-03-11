<template>
  <v-container class="home">
    <h1>
      Interface de gestion de cryptomonnaies
    </h1>
    <v-row align="center" justify="center">
      <v-col cols="6" v-if="displayedPlateforme.length > 0">
        <v-slide-x-transition appear>
          <v-data-table
            :items="displayedPlateforme"
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
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Component } from "vue-property-decorator";
import NumberUtils from "@/Utils/NumberUtils";

@Component({
  computed: {
    ...mapGetters({
      plateformes: "getPlateformes"
    })
  },
  methods: {
    ...mapActions({
      getAllPlateformes: "getAllPlateformes",
      getPlateforme: "getPlateforme"
    })
  }
})
class Home extends Vue {
  headers = [
    { text: "Nom de plateforme", value: "name" },
    { text: "Token", value: "code" },
    { text: "Valeure investissement", value: "amountInvestment" }
  ];
  created() {
    this.getAllPlateformes();
  }

  get displayedPlateforme() {
    const displayedChoicePlateform = this.plateformes;
    if (displayedChoicePlateform.length === 0) {
      return [];
    }
    if (!displayedChoicePlateform.find(v => v.code === "ALL")) {
      displayedChoicePlateform.push({
        code: "ALL",
        name: "All plateformes",
        amountInvestment: NumberUtils.getSumFromArray(
          this.plateformes,
          "amountInvestment"
        )
      });
    }
    return displayedChoicePlateform;
  }

  async select(value) {
    await this.getPlateforme(value.code);
    this.$router.push({ name: "plateforme" });
  }
}
export default Home;
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
