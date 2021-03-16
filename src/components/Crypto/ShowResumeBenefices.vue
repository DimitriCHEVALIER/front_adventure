<template>
  <v-card class="pa-5 elevation-7 mt-4">
    <v-row>
      <v-col cols="6">
        <pie-chart
          class="chart-container"
          :key="'origin_' + keyPieChart"
          :labels="labels"
          :datasets="datasetsOrigin"
        ></pie-chart>
        <h3>Graphique des actifs l'achat</h3>
      </v-col>
      <v-col cols="6">
        <pie-chart
          class="chart-container"
          :key="'actual_' + keyPieChart"
          :labels="labels"
          :datasets="datasetsActual"
        ></pie-chart>
        <h3>Graphique des actifs actuellement</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3"> Total investi : {{ totalEuro }} € </v-col>
      <v-col cols="5">
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
  </v-card>
</template>

<script>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";
import PieChart from "@/components/Charts/PieChart";
import NumberUtils from "@/Utils/NumberUtils";

@Component({
  components: { PieChart },
  computed: {
    ...mapGetters({
      ownedCryptos: "getOwnedCryptos",
      listCoins: "getListCoins"
    })
  }
})
class ShowResumeBenefices extends Vue {
  @Prop({ type: Number, default: 0 }) totalEuro;
  @Prop({ type: Number, default: 0 }) totalBenefices;
  @Prop({ type: Number, default: 0 }) totalImpots;
  @Prop({ type: Number, default: 0 }) totalBeneficesNets;
  @Prop({ type: Number, default: 0 }) totalMultiplicateur;
  @Prop({ type: Boolean, default: false }) loadingComponent;

  labels = [];
  datasetsOrigin = [{}];
  datasetsActual = [{}];

  keyPieChart = 0;

  mounted() {
    this.datasetsOrigin[0].data = this.ownedCryptos.map(v => v.averageEuroEq);
    this.datasetsActual[0].data = this.ownedCryptos.map(
      v => v.amount * this.getValueCoinGecko(v)
    );
    this.datasetsOrigin[0].backgroundColor = this.ownedCryptos.map(() =>
      NumberUtils.randomRgba()
    );
    this.datasetsActual[0].backgroundColor = this.datasetsOrigin[0].backgroundColor;
    console.log(this.ownedCryptos);
    this.labels = this.ownedCryptos.map(v => v.crytocurrency.code);
    this.keyPieChart++;
  }

  getValueCoinGecko(item) {
    const coinInGecko = this.listCoins.find(
      v => v.code === item.crytocurrency.code
    );
    item.actualChange = coinInGecko ? coinInGecko.value : null;
    return coinInGecko ? coinInGecko.value : null;
  }
}
export default ShowResumeBenefices;
</script>
<style>
.chart-container {
  max-height: 350px;
}
</style>
