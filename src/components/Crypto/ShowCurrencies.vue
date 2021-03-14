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
        key="v-card"
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
            {{ getValueCoinGecko(item) }}
          </div>
        </template>
        <template v-slot:item.multi="{ item }">
          <div
            v-if="item.actualChange"
            v-bind:style="{ 'background-color': getActiveColor(item) }"
            class="pa-3 elevation-9"
          >
            {{ item.multi }} %
          </div>
        </template>
        <template v-slot:item.netBenefit="{ item }">
          <div
            v-if="item.actualChange"
            class="pa-3 elevation-9"
            v-bind:style="{ 'background-color': getActiveColor(item) }"
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
    { text: "Coin", value: "crytocurrency.name" },
    { text: "Coin code", value: "crytocurrency.code" },
    { text: "Value", value: "amount" },
    { text: "Value in Euro", value: "averageEuroEq" },
    { text: "Taux achat (euro)", value: "ratio" },
    { text: "Taux actuel (euro)", value: "actualChange" },
    { text: "Multiplication", value: "multi" },
    { text: "Net Benenfit", value: "netBenefit" },
    { text: "Show graph", value: "action" }
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

  async created() {
    if (this.plateforme.code === "ALL") {
      this.headers.unshift({ text: "Plateforme", value: "plateforme.name" });
    }
    this.loadingComponent = true;
    await this.getOwnedCryptosByPlatforme(this.plateforme.code);
    await this.getAllCoins();
    this.getTotalBenefice();
    this.loadingComponent = false;
  }

  getRoundedValue(value, isLong) {
    if (isLong) {
      return NumberUtils.roundToFour(value);
    }
    return NumberUtils.roundToTwo(value);
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

  getActiveColor(item) {
    if (this.getMultplicateur(item) > 0) {
      const colorGreenPonderee =
        this.getMultplicateur(item) > 400
          ? 255
          : (this.getMultplicateur(item) / 500) * 150 + 105;
      return "rgb(0, " + colorGreenPonderee + ", 0)";
    }
    const colorRedPonderee =
      255 -
      (this.getMultplicateur(item) * -1 > 80
        ? 255
        : (this.getMultplicateur(item) / 80) * 150 + 105);
    return "rgb(" + colorRedPonderee + ",50, 0)";
  }

  displayDialogGraph(item) {
    const coin = this.listCoins.find(v => v.code === item.crytocurrency.code);
    console.log(coin);
    this.buildLabels(coin.dateDebutChart, coin.sparklingLastWeek);
    this.datasets[0].data = coin.sparklingLastWeek;
    this.datasets[0].label = item.crytocurrency.name;
    this.imgCoinGraphed = coin.imgSrc;
    console.log(this.imgCoinGraphed);
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
