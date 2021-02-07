<template>
  <v-container fluid class="text-center">
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
        <table class="text-center">
          <caption>
            <h2>The Jungle</h2>
          </caption>
          <tr v-for="(line, index) in dataMap" :key="index">
            <th scope="col" v-for="(box, indexBox) in line" :key="indexBox">
              <case-game
                :typeImage="box.type"
                :joueur="box.joueur"
                :nbrTresors="box.nbrTresors"
              ></case-game>
              {{ box.joueur ? box.joueur.nom : "" }}
            </th>
          </tr>
        </table>
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
        >
          Démarer l'aventure
        </v-btn>
        <v-btn
          color="primary text-transform-none"
          dark
          rounded
          @click="playOneTurn"
          v-if="!isAdventureOver"
        >
          Joueur un tour
        </v-btn>
        <v-btn
          color="primary text-transform-none"
          dark
          rounded
          @click="generateOutputFile"
          v-if="isAdventureOver"
        >
          Générer le fichier de fin d'aventure
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import CaseGame from "@/components/Peru/CaseGame";
import CinematicUtils from "@/Utils/CinematicUtils";
import JsonUtils from "@/Utils/JsonUtils";

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
  isAdventureOver = false;
  generateOutputFile() {
    console.log(this.dataJoueurs);
    this.getOutputFile(this.dataJoueurs);
  }

  async startAdventure() {
    let isOver = false;
    let antiblock = 3;
    while (!isOver && antiblock > 0) {
      for (const joueur of this.dataJoueurs) {
        const position = this.getPosition(joueur.id);
        this.dataMap[position.x][position.y].joueur.sequence = this.dataMap[
          position.x
        ][position.y].joueur.sequence.substring(1);
        this.handleMove(position);
      }
      console.log(JsonUtils.clone(this.dataMap));
      await CinematicUtils.sleep(1000);
      antiblock--;
    }
  }

  playOneTurn() {
    let isThereANextTurn = false;
    for (const joueur of this.dataJoueurs) {
      const position = this.getPositionAndMove(joueur.id);
      this.dataMap[position.x][position.y].joueur.sequence = this.dataMap[
        position.x
      ][position.y].joueur.sequence.substring(1);
      console.log(this.dataMap[position.x][position.y].joueur.sequence);
      if (this.dataMap[position.x][position.y].joueur.sequence) {
        isThereANextTurn = true;
      }
      this.handleMove(position);
    }
    if (!isThereANextTurn) {
      this.isAdventureOver = true;
    }
  }

  handleMove(position) {
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
  }

  isNextBoxAvailable(nextCase) {
    return !nextCase.joueur && nextCase.type !== "MONTAGNE";
  }

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

  getTheTreasure(box) {
    if (box.nbrTresors > 0) {
      box.nbrTresors--;
      let joueurInList = this.getJoueurInOriginalList(box.joueur.id);
      if (joueurInList) {
        joueurInList.nbrTresors++;
      }
    }
  }

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
