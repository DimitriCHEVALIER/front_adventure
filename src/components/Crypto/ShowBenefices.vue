<template>
  <v-container fluid>
    <h1>
      Voir les bénéfices vendus sur la plateforme
    </h1>
    <v-data-table
      :headers="headers"
      :items="beneficesCryptos"
      class="elevation-1"
      v-if="beneficesCryptos.length > 0 && !loadingComponent"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.benefNetApresImpot="{ item }">
        <div>
          {{ getBeneficeNet(item) }}
        </div>
      </template>
      <template v-slot:item.tauxAchat="{ item }">
        <div>
          {{ getTauxAchat(item) }}
        </div>
      </template>
      <template v-slot:item.multiplicateur="{ item }">
        <div>
          {{ getMultiplicateur(item) }}
        </div>
      </template>
    </v-data-table>
    <div v-if="loadingComponent">
      <div class="center-screen">
        <v-progress-circular
          indeterminate
          :size="70"
          :width="7"
          color="primary"
        ></v-progress-circular>
      </div>
    </div>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import NumberUtils from "@/Utils/NumberUtils";

@Component({
  computed: {
    ...mapGetters({
      plateforme: "getPlateforme",
      beneficesCryptos: "getBeneficesCryptos"
    })
  },
  methods: {
    ...mapActions({
      getBenefitsByPlatforme: "getBenefitsByPlatforme"
    })
  }
})
class ShowBenefices extends Vue {
  headers = [
    { text: "Coin", value: "ownedCrypto.crytocurrency.name" },
    { text: "Coin code", value: "ownedCrypto.crytocurrency.code" },
    { text: "Montant vendu", value: "amountSold" },
    { text: "Taux d'achat", value: "tauxAchat" },
    { text: "Taux de vente", value: "tauxVente" },
    { text: "Multiplicateur", value: "multiplicateur" },
    { text: "Benefice net", value: "beneficeNet" },
    { text: "Impot", value: "impot" },
    { text: "Benefice après impot", value: "benefNetApresImpot" },
    { text: "Impot déclaré", value: "impotDeclared" }
  ];
  loadingComponent = false;

  async created() {
    this.loadingComponent = true;
    await this.getBenefitsByPlatforme(this.plateforme.code);
    this.loadingComponent = false;
  }

  getTauxAchat(item) {
    return NumberUtils.roundToFour(
      (item.amountSold * item.tauxVente - item.beneficeNet) / item.amountSold
    );
  }

  getBeneficeNet(item) {
    return NumberUtils.roundToTwo(item.beneficeNet * 0.7);
  }

  getMultiplicateur(item) {
    return NumberUtils.roundToFour(item.tauxVente / this.getTauxAchat(item));
  }
}
export default ShowBenefices;
</script>
