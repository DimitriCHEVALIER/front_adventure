<template>
  <v-card class="pa-5 elevation-7 mt-4">
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

@Component({
  computed: {
    ...mapGetters({
      ownedCryptos: "getOwnedCryptos"
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
}
export default ShowResumeBenefices;
</script>
