<template>
  <v-container fluid>
    <v-form ref="formSellEuroOrder" v-model="sellEuroForm" lazy-validation>
      <v-row>
        <v-col cols="2">
          <v-autocomplete
            label="Owned crypto*"
            outlined
            :items="ownedCryptos"
            item-text="crytocurrency.name"
            return-object
            v-model="soldItem.ownedCrypto"
            :rules="[rules.required]"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="Amount sold"
            outlined
            :rules="[rules.required, rules.amountMax]"
            v-model.number="soldItem.actualChange"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="Taux à la vente"
            outlined
            :rules="[rules.required]"
            v-model.number="soldItem.taux"
          ></v-text-field>
        </v-col>
        <v-col cols="2" v-if="soldItem.ownedCrypto">
          <v-row>
            <v-col>
              Pourcentage vendu :
              {{ pourcentageVendu }} %
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Vente totale :
              {{ soldItem.actualChange * soldItem.taux }} €
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" v-if="soldItem.ownedCrypto">
          <v-row>
            <v-col>
              Benefice net :
              {{ beneficeNet }} €
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Impôts :
              {{ beneficeNet * 0.3 }} €
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Benefices après impot :
              {{ beneficeNet * 0.7 }} €
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" v-if="soldItem.ownedCrypto">
          Multiplicateur : {{ multiplicateur }}
        </v-col>
      </v-row>
      <v-row v-if="soldItem.ownedCrypto">
        <v-col cols="2" v-if="soldItem.ownedCrypto.crytocurrency">
          Montant Disponible :
        </v-col>
        <v-col cols="2" v-if="soldItem.ownedCrypto.crytocurrency">
          {{ soldItem.ownedCrypto.crytocurrency.code }} -
          {{ soldItem.ownedCrypto.crytocurrency.name }}
        </v-col>
        <v-col cols="2">
          {{ soldItem.ownedCrypto.amount }}
          {{ soldItem.ownedCrypto.crytocurrency.code }}
        </v-col>
        <v-col cols="2">
          Acheté pour : {{ soldItem.ownedCrypto.averageEuroEq }} €
        </v-col>
        <v-col cols="2">
          Taux à l'achat :
          {{ tauxAchat }}
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col>
          <v-btn
            color="primary text-transform-none"
            dark
            rounded
            @click="addSell"
            :loading="loading"
          >
            Ajouter l'ordre
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-divider class="mt-4"></v-divider>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import { MESSAGE_ERROR } from "@/Utils/Constantes";
import NumberUtils from "@/Utils/NumberUtils";

@Component({
  computed: {
    ...mapGetters({
      plateforme: "getPlateforme",
      ownedCryptos: "getOwnedCryptos"
    })
  },
  methods: {
    ...mapActions({
      getOwnedCryptosByPlatforme: "getOwnedCryptosByPlatforme",
      sellOwnedCrypto: "sellOwnedCrypto"
    })
  }
})
class SellInEuro extends Vue {
  soldItem = {
    ownedCrypto: null,
    actualChange: null,
    taux: null
  };
  loading = false;
  loadingComponent = false;
  sellEuroForm = null;

  rules = {
    required: value => !!value || MESSAGE_ERROR.ZONE_MANDATORY,
    amountMax: v =>
      !this.soldItem.ownedCrypto ||
      v <= this.soldItem.ownedCrypto.amount ||
      MESSAGE_ERROR.TOO_MANY_TOKEN_SOLD
  };

  get multiplicateur() {
    return NumberUtils.roundToTwo(this.soldItem.taux / this.tauxAchat);
  }

  get tauxAchat() {
    return NumberUtils.roundToTwo(
      this.soldItem.ownedCrypto.averageEuroEq / this.soldItem.ownedCrypto.amount
    );
  }

  get beneficeNet() {
    return NumberUtils.roundToTwo(
      this.soldItem.actualChange * this.soldItem.taux -
        this.tauxAchat * this.soldItem.actualChange
    );
  }

  get pourcentageVendu() {
    return NumberUtils.roundToTwo(
      (this.soldItem.actualChange / this.soldItem.ownedCrypto.amount) * 100
    );
  }

  async created() {
    this.getOwnedCryptosByPlatforme(this.plateforme.code);
  }

  addSell() {
    if (this.$refs.formSellEuroOrder.validate()) {
      const params = {
        ownedCryptoId: this.soldItem.ownedCrypto.id,
        amountSold: this.soldItem.actualChange,
        tauxVente: this.soldItem.taux,
        beneficeNet: this.beneficeNet
      };
      this.sellOwnedCrypto(params);
    }
  }
}
export default SellInEuro;
</script>
