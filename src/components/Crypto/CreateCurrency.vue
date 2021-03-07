<template>
  <v-container fluid>
    <h1>
      Créer une devise
    </h1>
    <v-form ref="formAddCurrency" v-model="currencyForm" lazy-validation>
      <v-row>
        <v-col cols="4">
          <v-text-field
            label="Nom"
            outlined
            :rules="[rules.required]"
            v-model="nom"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Code"
            outlined
            :rules="[rules.required]"
            v-model="code"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn
            color="primary text-transform-none"
            dark
            rounded
            @click="addCurrency"
            :loading="loading"
          >
            Ajouter la devise
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { MESSAGE_ERROR } from "@/Utils/Constantes";
import { mapActions } from "vuex";
import { EventBus } from "@/eventBus";

@Component({
  methods: {
    ...mapActions({
      createCurrency: "createCurrency"
    })
  }
})
class CreateCurrency extends Vue {
  nom = null;
  code = null;
  loading = false;
  currencyForm = true;
  rules = {
    required: value => !!value || MESSAGE_ERROR.ZONE_MANDATORY
  };

  async addCurrency() {
    this.loading = true;
    if (this.$refs.formAddCurrency.validate()) {
      const response = await this.createCurrency({
        name: this.nom,
        code: this.code
      });
      if (response && response.status === 200) {
        EventBus.$emit("showSnackBar", {
          message: "La crypto " + this.nom + " a bien été ajoutée!",
          type: "success"
        });
      }
      this.$refs.formAddCurrency.reset();
    }
    this.loading = false;
  }
}
export default CreateCurrency;
</script>
