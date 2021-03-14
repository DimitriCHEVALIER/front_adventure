<template>
  <v-dialog v-model="syncedDialogGraph" max-width="900px">
    <v-card class="pa-6">
      <v-img
        :key="'img_' + keyLineChart"
        max-height="70"
        max-width="50"
        :src="imgCoinGraphed"
        contain
      >
      </v-img>
      <h2>
        {{ datasets[0].label }}
      </h2>
      <line-chart :key="keyLineChart" :labels="labels" :datasets="datasets">
      </line-chart>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { mapGetters } from "vuex";
import LineChart from "@/components/Charts/LineChart";

@Component({
  components: { LineChart },
  computed: {
    ...mapGetters({
      plateforme: "getPlateforme",
      beneficesCryptos: "getBeneficesCryptos"
    })
  }
})
class DialogGraph extends Vue {
  @PropSync("dialogGraph") syncedDialogGraph;
  keyLineChart = 0;
  @Prop({ type: Array, default: () => [] }) labels;
  @Prop({ type: Array, default: () => [] }) datasets;
  @Prop({ type: String, default: "" }) imgCoinGraphed;

  mounted() {
    this.keyLineChart++;
  }
}
export default DialogGraph;
</script>
