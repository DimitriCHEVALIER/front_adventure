import { expect } from "chai";
import AdventureGameUtils from "@/Utils/AdventureGameUtils";

describe("Adventure game utils handle right turn from N, full turn", () => {
  it("success", () => {
    const position = {
      x: 0,
      y: 0
    };
    const dataMap = [
      [
        {
          joueur: {
            orientation: "N"
          }
        }
      ]
    ];
    AdventureGameUtils.handleRight(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("E");
    AdventureGameUtils.handleRight(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("S");
    AdventureGameUtils.handleRight(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("O");
    AdventureGameUtils.handleRight(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("N");
  });

  it("Wrong Orientation", () => {
    const position = {
      x: 0,
      y: 0
    };
    const dataMap = [
      [
        {
          joueur: {
            orientation: "WRONG"
          }
        }
      ]
    ];
    AdventureGameUtils.handleRight(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("WRONG");
  });
});

describe("Adventure game utils handle left turn from N, full turn", () => {
  it("success", () => {
    const position = {
      x: 0,
      y: 0
    };
    const dataMap = [
      [
        {
          joueur: {
            orientation: "N"
          }
        }
      ]
    ];
    AdventureGameUtils.handleLeft(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("O");
    AdventureGameUtils.handleLeft(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("S");
    AdventureGameUtils.handleLeft(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("E");
    AdventureGameUtils.handleLeft(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("N");
  });

  it("Wrong move", () => {
    const position = {
      x: 0,
      y: 0
    };
    const dataMap = [
      [
        {
          joueur: {
            orientation: "WRONG MOVE"
          }
        }
      ]
    ];
    AdventureGameUtils.handleLeft(position, dataMap);
    expect(dataMap[0][0].joueur.orientation).to.be.eql("WRONG MOVE");
  });
});

describe("Adventure game utils get position and next move", () => {
  it("success", () => {
    const dataMap = [
      [
        {
          joueur: {
            orientation: "N",
            id: 2,
            sequence: "ADGA"
          }
        }
      ],
      [
        {
          joueur: {
            orientation: "N",
            id: 5,
            sequence: "DGAA"
          }
        }
      ]
    ];
    const expectedResult = {
      x: 1,
      y: 0,
      move: "D"
    };
    const positionAndMove = AdventureGameUtils.getPositionAndMove(5, dataMap);
    expect(positionAndMove).to.be.eql(expectedResult);
  });

  it("Wrong ID", () => {
    const dataMap = [
      [
        {
          joueur: {
            orientation: "N",
            id: 2,
            sequence: "ADGA"
          }
        }
      ],
      [
        {
          joueur: {
            orientation: "N",
            id: 5,
            sequence: "DGAA"
          }
        }
      ]
    ];
    const positionAndMove = AdventureGameUtils.getPositionAndMove(
      67857896,
      dataMap
    );
    expect(positionAndMove).to.be.eql(null);
  });
});

describe("Adventure game utils get a treasure", () => {
  it("success", () => {
    const box = {
      nbr_tresors: 2,
      joueur: {
        id: 42
      }
    };

    const dataJoueurs = [
      {
        nbr_tresors: 4,
        id: 4
      },
      {
        nbr_tresors: 8,
        id: 42
      },
      {
        nbr_tresors: 15,
        id: 23
      }
    ];

    AdventureGameUtils.getTheTreasure(box, dataJoueurs);
    expect(box.nbr_tresors).to.be.eql(1);
    expect(dataJoueurs[1].nbr_tresors).to.be.eql(9);
  });
  it("Empty treasure", () => {
    const box = {
      nbr_tresors: 0,
      joueur: {
        id: 42
      }
    };

    const dataJoueurs = [
      {
        nbr_tresors: 4,
        id: 4
      },
      {
        nbr_tresors: 8,
        id: 42
      },
      {
        nbr_tresors: 15,
        id: 23
      }
    ];

    AdventureGameUtils.getTheTreasure(box, dataJoueurs);
    expect(box.nbr_tresors).to.be.eql(0);
    expect(dataJoueurs[1].nbr_tresors).to.be.eql(8);
  });
});

describe("Adventure game utils go on", () => {
  it("success", () => {
    const position = {
      x: 0,
      y: 0,
      move: "A"
    };
    const dataMap = [
      [
        {
          joueur: {
            orientation: "S",
            nbr_tresors: 8,
            id: 42
          },
          type: "PLAINE"
        },
        {
          type: "PLAINE"
        }
      ],
      [
        {
          type: "PLAINE"
        },
        {
          type: "PLAINE"
        }
      ]
    ];
    AdventureGameUtils.moveAventurier(position, dataMap);
    expect(dataMap[0][0].joueur).to.be.eql(null);
    expect(dataMap[1][0].joueur).to.be.not.eql(null);
  });

  it("Blocked by a mountain", () => {
    const position = {
      x: 0,
      y: 0,
      move: "A"
    };
    const dataMap = [
      [
        {
          joueur: {
            orientation: "S",
            nbr_tresors: 8,
            id: 42
          },
          type: "PLAINE"
        },
        {
          type: "PLAINE"
        }
      ],
      [
        {
          type: "MONTAGNE"
        },
        {
          type: "PLAINE"
        }
      ]
    ];
    AdventureGameUtils.moveAventurier(position, dataMap);
    expect(dataMap[0][0].joueur).to.be.not.null;
    expect(dataMap[1][0].joueur).to.be.undefined;
    expect(dataMap[1][1].joueur).to.be.undefined;
    expect(dataMap[0][1].joueur).to.be.undefined;
  });
});
