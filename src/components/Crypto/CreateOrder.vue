<template>
  <v-container fluid>
    <h1>
      Ajouter un ordre
    </h1>
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
    <v-form
      v-if="!loadingComponent"
      ref="formAddOrder"
      v-model="orderForm"
      lazy-validation
    >
      <v-row>
        <v-col cols="2">
          <v-autocomplete
            label="Plateforme*"
            outlined
            :items="plateformeReferentiel"
            item-text="name"
            item-value="code"
            v-model="order.selectedPlateforme"
            :disabled="disableChoiceReferentiel"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            label="From*"
            outlined
            :items="currenciesReferentiel"
            item-text="name"
            item-value="code"
            v-model="order.selectedFrom"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-text-field
            :label="
              `${'Amount ' +
                (order.selectedFrom ? 'in ' + order.selectedFrom : '')}`
            "
            outlined
            v-model.number="order.amountFistCurrency"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-autocomplete
            label="To*"
            outlined
            :items="currenciesReferentiel"
            item-text="name"
            item-value="code"
            v-model="order.selectedTo"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-text-field
            :label="
              `${'Amount ' +
                (order.selectedTo ? 'in ' + order.selectedTo : '')}`
            "
            outlined
            :rules="[rules.required, rules.numericRule]"
            v-model.number="order.amountFinalCurrency"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            :label="
              `${'Taux ' +
                (order.selectedTo && order.selectedFrom
                  ? order.selectedTo + order.selectedFrom
                  : '')}`
            "
            outlined
            v-model="taux"
            disabled
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col>
          <v-btn
            color="primary text-transform-none"
            dark
            rounded
            @click="addOrder"
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
import { REGEX_PATTERN } from "@/Utils/regex";
import { EventBus } from "@/eventBus";

@Component({
  computed: {
    ...mapGetters({
      plateforme: "getPlateforme",
      plateformeReferentiel: "getPlateformeReferentiels",
      currenciesReferentiel: "getCurrenciesReferentiel"
    })
  },
  methods: {
    ...mapActions({
      getPlateformesReferentiels: "getPlateformesReferentiels",
      getReferentielCurrencies: "getReferentielCurrencies",
      createOrder: "createOrder"
    })
  }
})
class CreateOrder extends Vue {
  order = {
    selectedPlateforme: null,
    selectedFrom: null,
    selectedTo: null,
    amountFistCurrency: 0,
    amountFinalCurrency: 0
  };
  orderForm = true;
  loading = false;
  loadingComponent = false;
  disableChoiceReferentiel = false;

  rules = {
    required: value => !!value || MESSAGE_ERROR.ZONE_MANDATORY,
    numericRule: v =>
      v === "" ||
      REGEX_PATTERN.numeric.test(v) ||
      REGEX_PATTERN.numericFloat.test(v) ||
      MESSAGE_ERROR.ZONE_NUMBER
  };

  async created() {
    this.loadingComponent = true;
    await this.getPlateformesReferentiels();
    await this.getReferentielCurrencies();
    this.loadingComponent = false;
    this.autofillPlateforme();
  }

  get taux() {
    if (this.order.amountFistCurrency && this.order.amountFinalCurrency) {
      return this.order.amountFistCurrency / this.order.amountFinalCurrency;
    }
    return "";
  }

  autofillPlateforme() {
    const autofillValue = this.plateformeReferentiel.find(
      v => v.code === this.plateforme.code
    );
    if (autofillValue) {
      this.order.selectedPlateforme = autofillValue;
      this.disableChoiceReferentiel = true;
    }
  }

  async addOrder() {
    this.loading = true;
    if (this.$refs.formAddOrder.validate()) {
      const response = await this.createOrder(this.order);
      if (response && response.status === 200) {
        EventBus.$emit("showSnackBar", {
          message: "L'ordre a été ajouté avec succès'!",
          type: "success"
        });
      }
    }
    this.loading = false;
  }
}
export default CreateOrder;
</script>
