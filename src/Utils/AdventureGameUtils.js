import { EventBus } from "@/eventBus";

class AdventureGameUtils {
  /** Méthode pour faire tourner un aventurier vers la droite. Son orientation uniquement change */
  static handleRight(position, dataMap) {
    switch (dataMap[position.x][position.y].joueur.orientation) {
      case "E":
        dataMap[position.x][position.y].joueur.orientation = "S";
        break;
      case "S":
        dataMap[position.x][position.y].joueur.orientation = "O";
        break;
      case "O":
        dataMap[position.x][position.y].joueur.orientation = "N";
        break;
      case "N":
        dataMap[position.x][position.y].joueur.orientation = "E";
        break;
      default:
        console.log(
          `Wrong position R : ${
            dataMap[position.x][position.y].joueur.orientation
          }.`
        );
    }
  }

  /** Méthode pour faire tourner un aventurier vers la gauche. Son orientation uniquement change */
  static handleLeft(position, dataMap) {
    switch (dataMap[position.x][position.y].joueur.orientation) {
      case "E":
        dataMap[position.x][position.y].joueur.orientation = "N";
        break;
      case "S":
        dataMap[position.x][position.y].joueur.orientation = "E";
        break;
      case "O":
        dataMap[position.x][position.y].joueur.orientation = "S";
        break;
      case "N":
        dataMap[position.x][position.y].joueur.orientation = "O";
        break;
      default:
        console.log(
          `Wrong position L : ${
            dataMap[position.x][position.y].joueur.orientation
          }.`
        );
    }
  }

  /** A partir d'un joueur dans la liste d'ordonnancement des joueurs, on récupère sa position et son prochain mouvement */
  static getPositionAndMove(id, dataMap) {
    for (const [i, ligne] of dataMap.entries()) {
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
    return null;
  }

  /** Méthode appelée au moment de l'avancement d'un joueur. On se base sur son orientation pour définir sa case suivante */
  static moveAventurier(position, dataMap, dataJoueurs) {
    const joueur = dataMap[position.x][position.y].joueur;

    switch (dataMap[position.x][position.y].joueur.orientation) {
      case "E":
        if (
          position.y + 1 < dataMap[position.x].length &&
          this.isNextBoxAvailable(dataMap[position.x][position.y + 1])
        ) {
          dataMap[position.x][position.y + 1].joueur = joueur;
          dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(dataMap[position.x][position.y + 1], dataJoueurs);
        }
        break;
      case "N":
        if (
          position.x - 1 >= 0 &&
          this.isNextBoxAvailable(dataMap[position.x - 1][position.y])
        ) {
          dataMap[position.x - 1][position.y].joueur = joueur;
          dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(dataMap[position.x - 1][position.y], dataJoueurs);
        }
        break;
      case "S":
        if (
          position.x + 1 < dataMap.length &&
          this.isNextBoxAvailable(dataMap[position.x + 1][position.y])
        ) {
          dataMap[position.x + 1][position.y].joueur = joueur;
          dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(dataMap[position.x + 1][position.y], dataJoueurs);
        }
        break;
      case "O":
        if (
          position.y - 1 >= 0 &&
          this.isNextBoxAvailable(dataMap[position.x][position.y - 1])
        ) {
          dataMap[position.x][position.y - 1].joueur = joueur;
          dataMap[position.x][position.y].joueur = null;
          this.getTheTreasure(dataMap[position.x][position.y - 1], dataJoueurs);
        }
        break;
      default:
        console.log(
          `Wrong position M : ${
            dataMap[position.x][position.y].joueur.orientation
          }.`
        );
    }
  }

  /** Vérifier que l'utilisateur a l'autorisation de bouger à la case suivante */
  static isNextBoxAvailable(nextCase) {
    return !nextCase.joueur && nextCase.type !== "MONTAGNE";
  }

  /** Lorsque le joueur arrive sur une nouvelle case, on regarde si il a pu ramasser un trésor */
  static getTheTreasure(box, dataJoueurs) {
    if (box.nbr_tresors > 0) {
      let joueurInList = this.getJoueurInOriginalList(
        box.joueur.id,
        dataJoueurs
      );
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

  /** A partir d'un id, récupération d'un joueur dans sa liste originale */
  static getJoueurInOriginalList(id, dataJoueurs) {
    for (const joueur of dataJoueurs) {
      if (joueur.id === id) {
        return joueur;
      }
    }
    return null;
  }
}

export default AdventureGameUtils;
