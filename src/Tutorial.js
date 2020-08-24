import React, { useState } from "react";
import Board from "./Board";
import Tour from "reactour";
import produce from "immer";
import { RoundOver } from "./Room";
import { useHistory } from "react-router-dom";

const initialRound = {
  draws_left: 46,
  discards: ["32二万"],
  hands: [
    {
      flowers: ["05梅"],
      revealed: ["32二万", "33三万", "34四万"],
      concealed: [
        "15三筒",
        "17五筒",
        "19七筒",
        "20八筒",
        "23二索",
        "23二索",
        "36六万",
        "36六万",
        "38八万",
      ],
    },
    {
      flowers: ["09春"],
      revealed: [],
      concealed: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    },
    {
      flowers: ["03公鸡", "08竹", "11秋"],
      revealed: [],
      concealed: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    },
    {
      flowers: [],
      revealed: [],
      concealed: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    },
  ],
  current_turn: 0,
  current_action: "draw",
};
const results = [
  {
    dealer: 0,
    prevailing_wind: 0,
    winner: 0,
    points: 2,
  },
];

export default function Tutorial() {
  let history = useHistory();
  const [round, setRound] = useState(initialRound);
  const [currentStep, setCurrentStep] = useState(0);
  const [hideNextButton, setHideNextButton] = useState(false);
  const [nonce, setNonce] = useState(0);

  const players = ["You", "Frodo", "Samwise", "Gandalf"];
  const steps = [
    {
      selector: ".table",
      content: "This is the mahjong board.",
      stepInteraction: false,
    },
    {
      selector: ".bottom",
      content:
        "Your tiles are at the bottom of the screen. The first row contains your flowers, the second row contains any open melds you have made and the last row contains your hidden hand.",
      stepInteraction: false,
    },
    {
      selector: ".status",
      content:
        "The top left shows what is currently happening in the game. It's your turn to draw!",
      stepInteraction: false,
    },
    {
      selector: "#buttonDraw",
      content: 'Click the "Draw tile" button to draw a new tile.',
      action: () => {
        setHideNextButton(true);
      },
    },
    {
      selector: ".bottom",
      content: "The tile you just drew will be highlighted.",
      stepInteraction: false,
    },
    {
      selector: ".bottom",
      content:
        "Now it's time to discard a tile. Let's discard the 🀃 we just drew. Click on it to discard it.",
      action: () => {
        setNonce(nonce + 1);
        setHideNextButton(true);
      },
    },
    {
      selector: ".discards",
      content:
        "The tile you discarded is added to the discard pile, and it becomes the next player's turn. Let's see what they discard.",
      stepInteraction: false,
      position: "top",
    },
    {
      selector: ".discards",
      content: "They discarded a tile that we can peng!",
      position: "top",
      stepInteraction: false,
      action: () => {
        setRound(
          produce(round, (draft) => {
            draft.draws_left--;
            draft.current_turn = 2;
            draft.current_action = "draw";
            draft.discards.push("23二索");
          })
        );
      },
    },
    {
      selector: "#buttonPeng",
      content: 'Click the "Peng" button to pong!',
      action: () => setHideNextButton(true),
      position: "top",
    },
    {
      selector: ".bottom",
      content: "The tiles are added to our revealed tiles.",
      stepInteraction: false,
    },
    {
      selector: "",
      content: "Let's try to chi something next.",
      stepInteraction: false,
    },
    {
      selector: ".discards",
      content: "The player to our left discarded something we can chi!",
      action: () => {
        setRound(
          produce(round, (draft) => {
            draft.draws_left -= 3;
            draft.current_turn = 0;
            draft.current_action = "draw";
            draft.discards.push("16四筒");
          })
        );
      },
      position: "top",
      stepInteraction: false,
    },
    {
      selector: "#buttonChow",
      content: 'Click the "Chow" button to choose tiles to chi',
      action: () => {
        setHideNextButton(true);
      },
      position: "top",
    },
    {
      selector: ".bottom",
      content: "Now select the two other tiles to chi with.",
      action: () => {
        setHideNextButton(true);
      },
    },
    {
      selector: ".bottom",
      content: "We're close to winning! Let's discard the 🀎",
      action: () => {
        setHideNextButton(true);
      },
    },
    {
      selector: ".bottom",
      content: "Now we're just waiting for a 🀞 or 🀡.",
      stepInteraction: false,
    },
    {
      selector: ".discards",
      content: "Oh! The next player discarded what we needed!",
      stepInteraction: false,
      action: () => {
        setRound(
          produce(round, (draft) => {
            draft.draws_left -= 1;
            draft.current_turn = 2;
            draft.current_action = "draw";
            draft.discards.push("21九筒");
          })
        );
      },
      position: "top",
    },
    {
      selector: "#buttonHu",
      content:
        'Click the "Declare win" button to arrange our tiles into a winning hand.',
      action: () => {
        setHideNextButton(true);
      },
      position: "top",
    },
    {
      selector: ".bottom",
      content:
        "Most of our hand is already revealed. We just need to select our last 🀟🀠🀡 meld.",
    },
    {
      content: "You won!",
    },
  ];

  const doAction = (action) => {
    if (currentStep === 3 && action === "draw") {
      setRound(
        produce(round, (draft) => {
          draft.draws_left--;
          draft.hands[0].concealed.push("43北风");
          draft.current_action = "discard";
        })
      );
      setCurrentStep(currentStep + 1);
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            drawn: "43北风",
            flowers: [],
          }),
      });
    } else if (currentStep === 5 && action === "discard") {
      setRound(
        produce(round, (draft) => {
          draft.current_turn = 1;
          draft.current_action = "draw";
          draft.discards.push("43北风");
          draft.hands[0].concealed.splice(
            draft.hands[0].concealed.indexOf("43北风"),
            1
          );
        })
      );
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 8 && action === "peng") {
      setRound(
        produce(round, (draft) => {
          draft.current_turn = 0;
          draft.current_action = "discard";
          draft.discards.pop();
          draft.hands[0].revealed.push(["23二索", "23二索", "23二索"]);
          draft.hands[0].concealed = draft.hands[0].concealed.filter(
            (tile) => tile !== "23二索"
          );
        })
      );
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 13 && action === "chow") {
      setRound(
        produce(round, (draft) => {
          draft.current_action = "discard";
          draft.hands[0].revealed.push(["15三筒", "16四筒", "17五筒"]);
          draft.discards.pop();
          draft.hands[0].concealed.splice(
            draft.hands[0].concealed.indexOf("15三筒"),
            1
          );
          draft.hands[0].concealed.splice(
            draft.hands[0].concealed.indexOf("17五筒"),
            1
          );
        })
      );
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 14 && action === "discard") {
      setRound(
        produce(round, (draft) => {
          draft.current_turn = 1;
          draft.current_action = "draw";
          draft.discards.push("38八万");
          draft.hands[0].concealed.splice(
            draft.hands[0].concealed.indexOf("38八万"),
            1
          );
        })
      );
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 18 && action === "hu") {
      setRound(
        produce(round, (draft) => {
          draft.current_turn = 0;
          draft.current_action = "game over";
        })
      );
      setCurrentStep(currentStep + 1);
    }
  };

  const onStepChange = (step) => {
    setHideNextButton(false);
    setCurrentStep(step);
  };

  const bubbleCatcher = (e) => {
    if (e.target.id === "buttonChow" && currentStep === 12) {
      setCurrentStep(currentStep + 1);
    } else if (e.target.id === "buttonHu" && currentStep === 17) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div onClick={bubbleCatcher}>
      {round.current_action === "game over" ? (
        <RoundOver players={players} round={round} results={results} />
      ) : (
        <Board
          nonce={nonce}
          players={players}
          round={round}
          seat={0}
          doAction={doAction}
        />
      )}
      <Tour
        disableKeyboardNavigation={hideNextButton ? true : ["left"]}
        closeWithMask={false}
        disableDotsNavigation={true}
        isOpen={true}
        prevButton={<></>}
        steps={steps}
        nextButton={hideNextButton && <></>}
        nextStep={hideNextButton ? () => false : undefined}
        goToStep={currentStep}
        getCurrentStep={onStepChange}
        lastStepNextButton={
          <button onClick={() => history.push("/")}>Finish tutorial</button>
        }
        onRequestClose={() => history.replace("/")}
      />
    </div>
  );
}
