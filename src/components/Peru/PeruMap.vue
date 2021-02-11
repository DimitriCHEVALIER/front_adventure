<template>
  <v-container fluid class="text-center">
    <div v-if="!dataMap" class="center-screen">
      <v-progress-circular
        indeterminate
        :size="70"
        :width="7"
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-if="dataMap">
      <v-row align="center" justify="center">
        <v-col>
          <h1>
            Bonjour! Voici l'aventure de
            <span
              v-for="(joueur, index) in dataJoueurs"
              :key="'joueurs_' + index"
            >
              {{ joueur.nom }}
              <span v-if="index < dataJoueurs.length - 1">, </span>
            </span>
          </h1>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-row>
            <v-col>
              <v-btn
                color="primary text-transform-none"
                dark
                rounded
                class="my-2 text-transform-none"
                @click="startAdventure"
                v-if="!isAdventureOver"
              >
                Lancer une aventure rapide
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary text-transform-none"
                dark
                rounded
                @click="playOneTurn"
                v-if="!isAdventureOver"
              >
                Jouer un tour
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary text-transform-none"
                dark
                rounded
                @click="generateOutputFile"
                v-if="isAdventureOver"
                :loading="loadingFichierGeneration"
              >
                Générer le fichier de fin d'aventure
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col>
              <table class="table-game elevation-9">
                <caption>
                  <h2>Plateau des Andes</h2>
                </caption>
                <tr v-for="(line, index) in dataMap" :key="index">
                  <th
                    scope="col"
                    v-for="(box, indexBox) in line"
                    :key="indexBox + '_' + forceRerenderIndex"
                  >
                    <case-game
                      :typeImage="box.type"
                      :joueur="box.joueur"
                      :nbr_tresors="box.nbr_tresors"
                    ></case-game>
                    {{ box.joueur ? box.joueur.nom : "" }}
                  </th>
                </tr>
              </table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import CaseGame from "@/components/Peru/CaseGame";
import { EventBus } from "@/eventBus";
import LocalStorageUtils, { LIST_KEYS } from "@/Utils/LocalStorageUtils";
import AdventureGameUtils from "@/Utils/AdventureGameUtils";

@Component({
  components: { CaseGame },
  computed: {
    ...mapGetters({
      dataMap: "getDataMap",
      dataJoueurs: "getDataJoueurs"
    })
  },
  methods: {
    ...mapActions({
      getOutputFile: "GET_OUTPUT_FILE"
    })
  }
})
class PeruMap extends Vue {
  forceRerenderIndex = 0;
  isAdventureOver = false;
  loadingFichierGeneration = false;

  /**
   * Méthode d'appel pour la génération du fichier
   * */
  async generateOutputFile() {
    this.loadingFichierGeneration = true;
    this.updateDataJoueurValues();
    const response = await this.getOutputFile({
      map: this.dataMap,
      joueurs: this.dataJoueurs,
      filename: LocalStorageUtils.getItem(LIST_KEYS.SELECTED_FILE)
    });
    this.loadingFichierGeneration = false;
    if (response.status === 200) {
      EventBus.$emit("showSnackBar", {
        message: "Le fichier a été généré sur le server",
        type: "success"
      });
    } else {
      EventBus.$emit("showSnackBar", {
        message: "Echec de la génération du fichier",
        type: "error"
      });
    }
  }

  /**
   * Méthode de mise à jour de l'orientation des joueurs dans leur liste initiale
   * */
  updateDataJoueurValues() {
    for (const joueur of this.dataJoueurs) {
      const mapValueJoueur = AdventureGameUtils.getPositionAndMove(
        joueur.id,
        this.dataMap
      );
      if (mapValueJoueur) {
        joueur.orientation = this.dataMap[mapValueJoueur.x][
          mapValueJoueur.y
        ].joueur.orientation;
      }
    }
  }

  /** Lance l'aventure automatiquement d'un coup */
  startAdventure() {
    while (!this.isAdventureOver) {
      this.playOneTurn();
    }
  }

  /** Méthode principale pour que chacun des joueurs joue un tour*/
  playOneTurn() {
    let isThereANextTurn = false;
    for (const joueur of this.dataJoueurs) {
      const position = AdventureGameUtils.getPositionAndMove(
        joueur.id,
        this.dataMap
      );
      this.dataMap[position.x][position.y].joueur.sequence = this.dataMap[
        position.x
      ][position.y].joueur.sequence.substring(1);
      if (this.dataMap[position.x][position.y].joueur.sequence) {
        isThereANextTurn = true;
      }
      this.handleMove(position);
    }
    if (!isThereANextTurn) {
      this.isAdventureOver = true;
    }
  }

  /** Mouvement d'un joueur, partant de sa position dans le tableau */
  async handleMove(position) {
    if (!position.move) {
      return;
    }
    this.forceRerenderIndex++;
    switch (position.move) {
      case "A":
        AdventureGameUtils.moveAventurier(
          position,
          this.dataMap,
          this.dataJoueurs
        );
        break;
      case "G":
        AdventureGameUtils.handleLeft(position, this.dataMap);
        break;
      case "D":
        AdventureGameUtils.handleRight(position, this.dataMap);
        break;
      default:
        console.log(`Wrong move : ${position.move}.`);
    }
  }
}
export default PeruMap;
</script>
<style lang="scss">
.center-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
.table-game {
  border: black solid 2px;
}
</style>
