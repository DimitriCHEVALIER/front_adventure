<template>
  <div class="hello">
    <back-line></back-line>
    <v-row>
      <peru-map></peru-map>
    </v-row>
  </div>
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
    if (!this.dataMap || !this.dataJoueurs) {
      await this.getDataFile();
    }
  }
}
export default PeruHomepage;
</script>
