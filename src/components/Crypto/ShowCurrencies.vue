<template>
  <v-container fluid>
    <h1>
      Voir les cryptos sur la plateforme
    </h1>
    <v-data-table
      :headers="headers"
      :items="ownedCryptos"
      class="elevation-1"
      v-if="ownedCryptos.length > 0"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.ratio="{ item }">
        <div v-if="item.crytocurrency.code !== 'EUR'">
          {{ item.averageEuroEq / item.amount }}
        </div>
      </template>
      <template v-slot:item.actualChange="{ item }">
        <v-text-field
          outlined
          v-model.number="item.actualChange"
        ></v-text-field>
      </template>
      <template v-slot:item.multi="{ item }">
        <div v-if="item.actualChange">
          {{ item.actualChange / (item.averageEuroEq / item.amount) }}
        </div>
      </template>
      <template v-slot:item.netBenefit="{ item }">
        <div v-if="item.actualChange">
          {{ item.actualChange * item.amount - item.averageEuroEq }}
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      plateforme: "getPlateforme",
      ownedCryptos: "getOwnedCryptos"
    })
  },
  methods: {
    ...mapActions({
      getOwnedCryptosByPlatforme: "getOwnedCryptosByPlatforme"
    })
  }
})
class ShowCurrencies extends Vue {
  headers = [
    { text: "Coin", value: "crytocurrency.name" },
    { text: "Coin code", value: "crytocurrency.code" },
    { text: "Value", value: "amount" },
    { text: "Value in Euro", value: "averageEuroEq" },
    { text: "Bought average (euro)", value: "ratio" },
    { text: "Insert actual value in euro", value: "actualChange" },
    { text: "Multiplication", value: "multi" },
    { text: "Net Benenfit", value: "netBenefit" }
  ];
  created() {
    console.log(this.plateforme);
    this.getOwnedCryptosByPlatforme(this.plateforme.code);
  }
}
export default ShowCurrencies;
</script>
