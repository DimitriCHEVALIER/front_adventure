<template>
  <v-container class="home">
    <v-card>
      <v-row>
        <div class="float-left">
          <v-navigation-drawer permanent>
            <v-list>
              <v-list-item class="px-2">
                <v-list-item-avatar>
                  <v-img
                    src="https://leblogdelappartement.files.wordpress.com/2012/12/booba-maicc82tre-yoda.jpg"
                  ></v-img>
                </v-list-item-avatar>
              </v-list-item>

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    Crypto.com
                  </v-list-item-title>
                  <v-list-item-subtitle>CRO</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list nav dense>
              <v-list-item @click="currentComponent = 'wallet'">
                <v-list-item-icon>
                  <v-icon>mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Wallet</v-list-item-title>
              </v-list-item>
              <v-list-item @click="currentComponent = 'create-order'">
                <v-list-item-icon>
                  <v-icon>mdi-newspaper</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Ajouter un ordre</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </div>
        <div class="float-left pa-3" style="width: 100%">
          <component v-bind:is="currentComponent" />
        </div>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { Component } from "vue-property-decorator";
import Wallet from "@/components/Crypto/Wallet";
import CreateOrder from "@/components/Crypto/CreateOrder";

@Component({
  components: {
    Wallet,
    CreateOrder
  },
  computed: {
    ...mapGetters({
      plateforme: "getPlateforme"
    })
  },
  methods: {
    ...mapActions({
      getPlateforme: "getPlateforme"
    })
  }
})
class Home extends Vue {
  currentComponent = "wallet";
}
export default Home;
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
