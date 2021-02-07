<template>
  <v-container fluid class="text-center">
    <v-img
      max-height="150"
      max-width="100"
      v-bind:src="require('../../assets/images/' + typeImage + '.png')"
      contain
    >
      <v-fade-transition>
        <v-overlay v-if="joueur" absolute color="#036358">
          <v-img
            max-height="70"
            max-width="50"
            v-bind:src="
              require('../../assets/images/' + joueur.orientation + '.png')
            "
            contain
          >
          </v-img>
        </v-overlay>
      </v-fade-transition>
    </v-img>
    <span v-if="nbrTresors > 0">
      <span v-for="i in nbrTresors" :key="i">
        o
      </span>
    </span>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      dataMap: "getDataMap",
      dataJoueurs: "getDataJoueurs"
    })
  }
})
class CaseGame extends Vue {
  @Prop({ type: String, default: "link" }) typeImage;
  @Prop({ type: Number, default: 0 }) nbrTresors;
  @Prop({ type: Object, default: null }) joueur;
}
export default CaseGame;
</script>
