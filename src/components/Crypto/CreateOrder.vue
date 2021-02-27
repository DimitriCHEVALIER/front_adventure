<template>
  <v-container>
    <v-row>
      {{ plateformeReferentiel }}
    </v-row>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      plateformeReferentiel: "getPlateformeReferentiels"
    })
  },
  methods: {
    ...mapActions({
      getPlateformesReferentiels: "getPlateformesReferentiels"
    })
  }
})
class CreateOrder extends Vue {
  created() {
    this.getPlateformesReferentiels();
  }
}
export default CreateOrder;
</script>
