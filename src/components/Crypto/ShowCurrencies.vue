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
    <v-slide-x-transition appear group>
      <show-resume-benefices
        v-if="
          updateKeyResume > 0 && ownedCryptos.length > 0 && listCoins.length > 0
        "
        :key="'v-card' + updateKeyResume"
        :totalEuro="totalEuro"
        :totalBenefices="totalBenefices"
        :totalImpots="totalImpots"
        :totalBeneficesNets="totalBeneficesNets"
        :totalMultiplicateur="totalMultiplicateur"
        v-show="ownedCryptos.length > 0 && !loadingComponent"
      >
      </show-resume-benefices>
      <v-data-table
        :key="keyDataTable"
        :headers="headers"
        :items="ownedCryptos"
        class="elevation-15 mt-4"
        v-show="ownedCryptos.length > 0 && !loadingComponent"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:item.image="{ item }">
          <v-img max-height="30" max-width="30" :src="item.logo" contain>
          </v-img>
        </template>
        <template v-slot:item.designation="{ item }">
          <div>
            <v-row class="font-weight-bold">
              {{ item.crytocurrency.name }}
            </v-row>
            <v-row class="font-italic">
              {{ item.crytocurrency.code }}
            </v-row>
          </div>
        </template>
        <template v-slot:item.amount="{ item }">
          <div>
            {{ getRoundedValue(item.amount, true) }}
          </div>
        </template>
        <template v-slot:item.averageEuroEq="{ item }">
          <div>
            {{ getRoundedValue(item.averageEuroEq, false) }}
          </div>
        </template>
        <template v-slot:item.ratio="{ item }">
          <div v-if="item.crytocurrency.code !== 'EUR'">
            {{ getTauxAchat(item) }}
          </div>
        </template>
        <template v-slot:item.actualChange="{ item }">
          <div>
            {{ getValueCoinGecko(item, "value") }}
          </div>
        </template>
        <template v-slot:item.multi="{ item }">
          <div
            v-if="item.actualChange"
            v-bind:style="{
              'background-color': getActiveColor(getMultplicateur(item))
            }"
            class="pa-3 elevation-9"
          >
            {{ item.multi }} %
          </div>
        </template>
        <template v-slot:item.netBenefit="{ item }">
          <div
            v-if="item.actualChange"
            class="pa-3 elevation-9"
            v-bind:style="{
              'background-color': getActiveColor(getMultplicateur(item))
            }"
          >
            {{ item.netBenefit }}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            color="text-transform-none"
            class="my-2 text-transform-none"
            @click="displayDialogGraph(item)"
          >
            <v-icon>mdi-chart-line</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.percentageVariation24h="{ item }">
          <div
            v-if="item.actualChange"
            class="pa-3 elevation-9"
            v-bind:style="{
              'background-color': getActiveColor(
                getValueCoinGecko(item, 'percentageVariation24h'),
                15,
                15
              )
            }"
          >
            {{ item.percentageVariation24h }}%
          </div>
        </template>
      </v-data-table>
    </v-slide-x-transition>
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
    <dialog-graph
      :key="keyLineChart"
      v-if="displayGraph"
      :labels="labels"
      :datasets="datasets"
      :dialogGraph.sync="displayGraph"
      :imgCoinGraphed="imgCoinGraphed"
    >
    </dialog-graph>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import NumberUtils from "@/Utils/NumberUtils";
import ShowResumeBenefices from "@/components/Crypto/ShowResumeBenefices";
import DialogGraph from "@/components/Charts/DialogGraph";
import moment from "moment";

@Component({
  components: { ShowResumeBenefices, DialogGraph },
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
    { text: "Logo", value: "image" },
    { text: "Coin", value: "designation" },
    { text: "Value", value: "amount" },
    { text: "Value in Euro", value: "averageEuroEq" },
    { text: "Taux achat (euro)", value: "ratio" },
    { text: "Taux actuel (euro)", value: "actualChange" },
    { text: "Multiplication", value: "multi" },
    { text: "Net Benenfit", value: "netBenefit" },
    { text: "Show graph", value: "action" },
    { text: "Last 24h", value: "percentageVariation24h" }
  ];

  labels = [];
  datasets = [
    {
      label: "Graph",
      data: [],
      backgroundColor: "transparent",
      borderColor: "rgba(1, 116, 188, 0.50)",
      pointBackgroundColor: "rgba(171, 71, 188, 1)"
    }
  ];

  loadingCoinGecko = false;
  loadingComponent = false;

  totalBenefices = 0;
  totalEuro = 0;
  totalMultiplicateur = 0;
  totalBeneficesNets = 0;
  totalImpots = 0;
  displayGraph = false;
  keyLineChart = 0;
  keyDataTable = 0;
  imgCoinGraphed = null;
  updateKeyResume = 0;

  async created() {
    if (this.plateforme.code === "ALL") {
      this.headers.unshift({ text: "Plateforme", value: "plateforme.name" });
    }
    this.loadingComponent = true;
    await this.getOwnedCryptosByPlatforme(this.plateforme.code);
    await this.getAllCoins();
    this.getTotalBenefice();
    this.loadingComponent = false;
    this.updateKeyResume++;
  }

  mounted() {
    this.updateKeyResume++;
  }

  getRoundedValue(value, isLong) {
    if (isLong) {
      return NumberUtils.roundToFour(value);
    }
    return NumberUtils.roundToTwo(value);
  }

  getValueCoinGecko(item, attribute) {
    const coinInGecko = this.listCoins.find(
      v => v.code === item.crytocurrency.code
    );
    item.actualChange = coinInGecko ? coinInGecko.value : null;
    return coinInGecko ? coinInGecko[attribute] : null;
  }

  async refreshCoinGecko() {
    this.loadingCoinGecko = true;
    await this.getAllCoins();
    this.loadingCoinGecko = false;
    this.getTotalBenefice();
  }

  getMultplicateur(item) {
    return NumberUtils.roundToTwo(
      (item.actualChange / (item.averageEuroEq / item.amount) - 1) * 100
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
          ownedCrypto.multi = this.getMultplicateur(ownedCrypto);
          ownedCrypto.netBenefit = this.getNetBenefit(ownedCrypto);
          ownedCrypto.percentageVariation24h = this.getRoundedValue(
            this.getValueCoinGecko(ownedCrypto, "percentageVariation24h"),
            false
          );
          ownedCrypto.logo = this.getValueCoinGecko(ownedCrypto, "imgSrc");
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
    this.keyDataTable++;
  }

  getActiveColor(item, positiveSensibility = 400, negativeSensibility = 80) {
    return NumberUtils.getColor(
      NumberUtils.roundToTwo(item),
      positiveSensibility,
      negativeSensibility
    );
  }

  displayDialogGraph(item) {
    const coin = this.listCoins.find(v => v.code === item.crytocurrency.code);
    this.buildLabels(coin.dateDebutChart, coin.sparklingLastWeek);
    this.datasets[0].data = coin.sparklingLastWeek;
    this.datasets[0].label = item.crytocurrency.name;
    this.imgCoinGraphed = coin.imgSrc;
    this.displayGraph = true;
    this.keyLineChart++;
  }

  buildLabels(dateOrigine, array) {
    this.labels = [];
    let date = moment(dateOrigine).subtract(7, "d");
    // eslint-disable-next-line no-unused-vars
    for (const hourlyValue of array) {
      this.labels.push(date.format("DD/MM HH") + "h");
      date = moment(date).add(1, "hour");
    }
  }
}
export default ShowCurrencies;
</script>
