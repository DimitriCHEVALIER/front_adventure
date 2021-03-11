<template>
  <v-container fluid>
    <h1 class="mb-4">
      Voir les cryptos sur la plateforme
    </h1>
    <v-row align="end" justify="end">
      <v-col>
        <v-btn
          color="primary text-transform-none"
          dark
          rounded
          @click="refreshCoinGecko"
          :loading="loadingCoinGecko"
        >
          Rafraichir les données de CoinGecko
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="ownedCryptos"
      class="elevation-1"
      v-if="ownedCryptos.length > 0 && !loadingComponent"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.ratio="{ item }">
        <div v-if="item.crytocurrency.code !== 'EUR'">
          {{ getTauxAchat(item) }}
        </div>
      </template>
      <template v-slot:item.actualChange="{ item }">
        <div>
          {{ getValueCoinGecko(item) }}
        </div>
      </template>
      <template v-slot:item.multi="{ item }">
        <div v-if="item.actualChange">
          {{ getMultplicateur(item) }}
        </div>
      </template>
      <template v-slot:item.netBenefit="{ item }">
        <div v-if="item.actualChange">
          {{ getNetBenefit(item) }}
        </div>
      </template>
    </v-data-table>
    <v-row class="mt-4">
      <v-col cols="2">
        Total
      </v-col>
      <v-col cols="3"> Total investi : {{ totalEuro }} € </v-col>
      <v-col cols="4">
        <v-row>
          <v-col> Total bénéfices virtuels : {{ totalBenefices }} € </v-col>
        </v-row>
        <v-row>
          <v-col> Total impots virtuels : {{ totalImpots }} € </v-col>
        </v-row>
        <v-row>
          <v-col>
            Total bénéfices nets virtuels : {{ totalBeneficesNets }} €
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3"> Multiplicateur moyen : {{ totalMultiplicateur }} </v-col>
    </v-row>
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
      ownedCryptos: "getOwnedCryptos",
      listCoins: "getListCoins"
    })
  },
  methods: {
    ...mapActions({
      getOwnedCryptosByPlatforme: "getOwnedCryptosByPlatforme",
      getAllCoins: "getAllCoins"
    })
  }
})
class ShowCurrencies extends Vue {
  headers = [
    { text: "Coin", value: "crytocurrency.name" },
    { text: "Coin code", value: "crytocurrency.code" },
    { text: "Value", value: "amount" },
    { text: "Value in Euro", value: "averageEuroEq" },
    { text: "Taux achat (euro)", value: "ratio" },
    { text: "Taux actuel (euro)", value: "actualChange" },
    { text: "Multiplication", value: "multi" },
    { text: "Net Benenfit", value: "netBenefit" }
  ];

  loadingCoinGecko = false;
  loadingComponent = false;

  totalBenefices = 0;
  totalEuro = 0;
  totalMultiplicateur = 0;
  totalBeneficesNets = 0;
  totalImpots = 0;

  async created() {
    this.loadingComponent = true;
    await this.getOwnedCryptosByPlatforme(this.plateforme.code);
    this.loadingComponent = false;
    await this.getAllCoins();
    this.getTotalBenefice();
  }

  getValueCoinGecko(item) {
    const coinInGecko = this.listCoins.find(
      v => v.code === item.crytocurrency.code
    );
    item.actualChange = coinInGecko ? coinInGecko.value : null;
    return coinInGecko ? coinInGecko.value : null;
  }

  async refreshCoinGecko() {
    this.loadingCoinGecko = true;
    await this.getAllCoins();
    this.loadingCoinGecko = false;
    this.getTotalBenefice();
  }

  getMultplicateur(item) {
    return NumberUtils.roundToTwo(
      item.actualChange / (item.averageEuroEq / item.amount)
    );
  }

  getNetBenefit(item) {
    item.netBenefit = NumberUtils.roundToTwo(
      item.actualChange * item.amount - item.averageEuroEq
    );
    return item.netBenefit;
  }

  getTauxAchat(item) {
    return NumberUtils.roundToFour(item.averageEuroEq / item.amount);
  }

  getTotalEuro() {
    let total = 0;
    for (const ownedCrypto of this.ownedCryptos) {
      if (ownedCrypto.crytocurrency.code !== "EUR") {
        total += ownedCrypto.averageEuroEq;
      }
    }
    return total;
  }

  getTotalBenefice() {
    let totalBenef = 0;
    let totalEuro = 0;
    for (const ownedCrypto of this.ownedCryptos) {
      if (ownedCrypto.crytocurrency.code !== "EUR") {
        totalEuro = totalEuro + ownedCrypto.averageEuroEq;
        if (!isNaN(this.getNetBenefit(ownedCrypto))) {
          totalBenef = totalBenef + ownedCrypto.netBenefit;
        }
      }
    }
    this.totalBenefices = NumberUtils.roundToTwo(totalBenef);
    this.totalImpots = NumberUtils.roundToTwo(totalBenef * 0.3);
    this.totalBeneficesNets = NumberUtils.roundToTwo(totalBenef * 0.7);
    this.totalEuro = NumberUtils.roundToTwo(totalEuro);
    this.totalMultiplicateur = NumberUtils.roundToTwo(
      (this.totalEuro + this.totalBenefices) / this.totalEuro
    );
  }
}
export default ShowCurrencies;
</script>
