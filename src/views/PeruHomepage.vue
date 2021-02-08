<template>
  <v-container fluid>
    <back-line></back-line>
    <v-row>
      <v-slide-x-transition appear>
        <peru-map></peru-map>
      </v-slide-x-transition>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import BackLine from "@/components/Actions/BackLine";
import PeruMap from "@/components/Peru/PeruMap";
import { mapActions, mapGetters } from "vuex";

@Component({
  components: { BackLine, PeruMap },
  computed: {
    ...mapGetters({
      dataMap: "getDataMap",
      dataJoueurs: "getDataJoueurs"
    })
  },
  methods: {
    ...mapActions({
      getDataFile: "GET_DATA_FILE"
    })
  }
})
class PeruHomepage extends Vue {
  test = null;
  async created() {
    await this.getDataFile();
  }
}
export default PeruHomepage;
</script>
