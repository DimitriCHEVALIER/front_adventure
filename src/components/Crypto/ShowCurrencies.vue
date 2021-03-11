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

  async created() {
    this.loadingComponent = true;
    await this.getOwnedCryptosByPlatforme(this.plateforme.code);
    this.loadingComponent = false;
    await this.getAllCoins();
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
  }

  getMultplicateur(item) {
    return NumberUtils.roundToTwo(
      item.actualChange / (item.averageEuroEq / item.amount)
    );
  }

  getNetBenefit(item) {
    return NumberUtils.roundToTwo(
      item.actualChange * item.amount - item.averageEuroEq
    );
  }

  getTauxAchat(item) {
    return NumberUtils.roundToFour(item.averageEuroEq / item.amount);
  }
}
export default ShowCurrencies;
</script>
