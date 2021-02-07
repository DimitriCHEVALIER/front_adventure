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
              :key="'joueurs_' + index + forceRerenderIndex"
            >
              {{ joueur.nom }}
              <span v-if="index < dataJoueurs.length - 1">, </span>
            </span>
          </h1>
          <v-row>
            <v-col md="4" offset-md="4">
              <table class="text-center justify-center align-center">
                <caption>
                  <h2>The Jungle</h2>
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
          <v-btn
            color="primary text-transform-none"
            dark
            rounded
            @click="playOneTurn"
            v-if="!isAdventureOver"
          >
            Jouer un tour
          </v-btn>
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
      const mapValueJoueur = this.getPositionAndMove(joueur.id);
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
      const position = this.getPositionAndMove(joueur.id);
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
    switch (position.move) {
      case "A":
        this.moveAventurier(position);
        break;
      case "G":
        this.handleLeft(position);
        break;
      case "D":
        this.handleRight(position);
        break;
      default:
        console.log(`Wrong move : ${position.move}.`);
    }
    this.forceRerenderIndex++;
  }

  /** Vérifier que l'utilisateur a l'autorisation de bouger à la case suivante */
  isNextBoxAvailable(nextCase) {
    return !nextCase.joueur && nextCase.type !== "MONTAGNE";
  }

  /** Méthode appelée au moment de l'avancement d'un joueur. On se base sur son orientation pour définir sa case suivante */
  moveAventurier(position) {
    const joueur = this.dataMap[position.x][position.y].joueur;

    switch (this.dataMap[position.x][position.y].joueur.orientation) {
      case "E":
        if (
          position.y + 1 < this.dataMap[position.x].length &&
          this.isNextBoxAvailable(this.dataMap[position.x][position.y + 1])
        ) {
          this.dataMap[position.x][position.y + 1].joueur = joueur;
          this.dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(this.dataMap[position.x][position.y + 1]);
        }
        break;
      case "N":
        if (
          position.x - 1 >= 0 &&
          this.isNextBoxAvailable(this.dataMap[position.x - 1][position.y])
        ) {
          this.dataMap[position.x - 1][position.y].joueur = joueur;
          this.dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(this.dataMap[position.x - 1][position.y]);
        }
        break;
      case "S":
        if (
          position.x + 1 < this.dataMap.length &&
          this.isNextBoxAvailable(this.dataMap[position.x + 1][position.y])
        ) {
          this.dataMap[position.x + 1][position.y].joueur = joueur;
          this.dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(this.dataMap[position.x + 1][position.y]);
        }
        break;
      case "O":
        if (
          position.y - 1 >= 0 &&
          this.isNextBoxAvailable(this.dataMap[position.x][position.y - 1])
        ) {
          this.dataMap[position.x][position.y - 1].joueur = joueur;
          this.dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(this.dataMap[position.x][position.y - 1]);
        }
        break;
      default:
        console.log(
          `Wrong position M : ${
            this.dataMap[position.x][position.y].joueur.orientation
          }.`
        );
    }
  }

  /** Lorsque le joueur arrive sur une nouvelle case, on regarde si il a pu ramasser un trésor */
  getTheTreasure(box) {
    if (box.nbr_tresors > 0) {
      let joueurInList = this.getJoueurInOriginalList(box.joueur.id);
      if (joueurInList) {
        box.nbr_tresors--;
        joueurInList.nbr_tresors++;
        EventBus.$emit("showSnackBar", {
          message: joueurInList.nom + " a ramassé un trésor !",
          type: "success"
        });
      }
    }
  }

  /** Méthode pour faire tourner un aventurier vers la droite. Son orientation uniquement change */
  handleRight(position) {
    switch (this.dataMap[position.x][position.y].joueur.orientation) {
      case "E":
        this.dataMap[position.x][position.y].joueur.orientation = "S";
        break;
      case "S":
        this.dataMap[position.x][position.y].joueur.orientation = "O";
        break;
      case "O":
        this.dataMap[position.x][position.y].joueur.orientation = "N";
        break;
      case "N":
        this.dataMap[position.x][position.y].joueur.orientation = "E";
        break;
      default:
        console.log(
          `Wrong position R : ${
            this.dataMap[position.x][position.y].joueur.orientation
          }.`
        );
    }
  }

  /** Méthode pour faire tourner un aventurier vers la gauche. Son orientation uniquement change */
  handleLeft(position) {
    switch (this.dataMap[position.x][position.y].joueur.orientation) {
      case "E":
        this.dataMap[position.x][position.y].joueur.orientation = "N";
        break;
      case "S":
        this.dataMap[position.x][position.y].joueur.orientation = "E";
        break;
      case "O":
        this.dataMap[position.x][position.y].joueur.orientation = "S";
        break;
      case "N":
        this.dataMap[position.x][position.y].joueur.orientation = "O";
        break;
      default:
        console.log(
          `Wrong position L : ${
            this.dataMap[position.x][position.y].joueur.orientation
          }.`
        );
    }
  }

  /** A partir d'un joueur dans la liste d'ordonnancement des joueurs, on récupère sa position et son prochain mouvement */
  getPositionAndMove(id) {
    for (const [i, ligne] of this.dataMap.entries()) {
      for (const [j, box] of ligne.entries()) {
        if (box && box.joueur && box.joueur.id === id) {
          return {
            x: i,
            y: j,
            move: box.joueur.sequence.substr(0, 1)
          };
        }
      }
    }
  }

  /** A partir d'un id, récupération d'un joueur dans sa liste originale */
  getJoueurInOriginalList(id) {
    for (const joueur of this.dataJoueurs) {
      if (joueur.id === id) {
        return joueur;
      }
    }
    return null;
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
</style>
