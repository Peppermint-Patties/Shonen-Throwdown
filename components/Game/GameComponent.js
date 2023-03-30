import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Card from "./Card";
import OpponentCard from "./OpponentCard";
import GameContainer from "./GameContainer";
import Player1HP from "./Player1HP";
import Player2HP from "./Player2HP";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { gameActions } from "@/store/slices/gameSlice";
import Router from "next/router";

let oppCard = null;
let myCard = null;

const GameComponent = (props) => {
  const [playAudio, setPlayAudio] = useState(true);
  const cardRefs = useRef(new Array());
  const buttonRef = useRef();
  const divRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [presences, setPresences] = useState([]);

  const [opponentDeck, setOpponentDeck] = useState([]);
  const [opponentInfo, setOpponentInfo] = useState({});
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const [set, setShowSet] = useState(false);

  const channels = Router.query.id;

  const user = useSelector((state) => {
    return state.user.user;
  });

  const userDeck = useSelector((state) => {
    return state.deck;
  });

  const resetCard = () => {
    myCard = null;
    oppCard = null;
  };

  const checkCards = (player1Card, player2Card) => {
    let damage;
    let winningElement;
    let damagedPlayer;

    // Determine the winning element
    if (myCard && oppCard) {
      if (player1Card.element === player2Card.element) {
        // If the two cards have the same element, use their power to determine the winner
        if (player1Card.power > player2Card.power) {
          winningElement = player1Card.element;
          damage = player1Card.power - player2Card.power;
          damagedPlayer = "player2";
        } else if (player2Card.power > player1Card.power) {
          winningElement = player2Card.element;
          damage = player2Card.power - player1Card.power;
          damagedPlayer = "player1";
        } else {
          // If the two cards have the same power, there is no damage
          winningElement = null;
          damage = 0;
          damagedPlayer = "none";
        }
      } else {
        // If the two cards have different elements, use the standard rules to determine the winner
        if (player1Card.element === "Red") {
          if (player2Card.element === "Green") {
            winningElement = "Red";
          } else if (player2Card.element === "Blue") {
            winningElement = "Blue";
          }
        } else if (player1Card.element === "Green") {
          if (player2Card.element === "Blue") {
            winningElement = "Green"; // fire > grass
            // grass > water
            // water > fire) {
            winningElement = "Blue";
          } else if (player2Card.element === "Green") {
            winningElement = "Green";
          }
        }

        // Determine the damage
        if (winningElement === player1Card.element) {
          damage = Math.max(player1Card.power - player2Card.power, 0);
          damagedPlayer = "player2";
        } else if (winningElement === player2Card.element) {
          damage = Math.max(player2Card.power - player1Card.power, 0);
          damagedPlayer = "player1";
        } else {
          damage = 0;
          damagedPlayer = "none";
        }
      }

      if (damagedPlayer === "player1") {
        dispatch(gameActions.decreasePlayer1HP(damage));
      } else if (damagedPlayer === "player2") {
        dispatch(gameActions.decreasePlayer2HP(damage));
      } else if (damagedPlayer === "none") {
        return;
      }
      resetCard();
    }
  };

  useEffect(() => {
    setInterval(() => {
      checkCards(myCard, oppCard);
    }, 1000);
  }, []);

  //establishes presence
  const channel = supabase.channel(channels, {
    config: { presence: { key: user.username } },
  });

  useEffect(() => {
    // getChannel();
    const channel = supabase.channel(channels, {
      config: { presence: { key: user.username } },
    });

    channel
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          console.log(status, "CHANNEL STATUS ");
          const trackStatus = await channel.track({ key: user.username });
          console.log(trackStatus, "TRACK STATUS");
        }
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log(state, "SYNC STATE");
        channel.send({
          type: "broadcast",
          event: "getUserDeck/" + channels,
          payload: { data: { user: props.user, userDeck: props.userDeck } },
        });
      })
      .on("presence", { event: "join" }, (object) => {
        setPresences((presences) => [...presences, object]);
      })
      .on("presence", { event: "leave" }, (object1234) => {
        channel.unsubscribe();
      })
      .on("broadcast", { event: "getUserDeck/" + channels }, (payload) => {
        setLoading(true);
        setOpponentDeck((opponentDeck) => payload.payload?.data?.userDeck);
        setOpponentInfo((opponentInfo) => payload.payload.data?.user);
        setLoading(false);
      })
      .on("broadcast", { event: "cardmove" }, (payload) => {
        // console.log(cardRefs?.current);
        console.log(payload.payload, "CARD MOVE PAYLOAD");
        cardRefs?.current[payload.payload.data.index - 1]?.click();
        oppCard = payload.payload.data.cardInfo;
        // checks();
      })
      .on("broadcast", { event: "cardmove" }, () => {
        // checks();
      });

    // supabase.removeAllChannels();
    console.log(supabase, "SUPABASE STATUS");
    // .on("presence", { event: "join" }, (object) => {
    //   setPresences((presences) => [...presences, object]);
    // });
    // .on("presence", { event: "leave" }, (object) => {
    //   channel.unsubscribe();
    // });
  }, []);

  // useEffect(() => {
  //   // const channel = supabase.channel(Router.query.id);
  //   // channel
  //     // .on("presence", { event: "join" }, (object) => {
  //     //   setPresences((presences) => [...presences, object]);
  //     // })
  //     // .on("presence", { event: "leave" }, (object) => {
  //     //   channel.unsubscribe();
  //     // });
  // }, [presences]);

  // useEffect(() => {
  //   // audioRef.current.play();

  //   supabase
  //     .on("broadcast", { event: "getUserDeck/" + channels }, (payload) => {
  //       setLoading(true);
  //       setOpponentDeck((opponentDeck) => payload.payload?.data?.userDeck);
  //       setOpponentInfo((opponentInfo) => payload.payload.data?.user);
  //       setLoading(false);
  //     })
  //     .on("broadcast", { event: "cardmove" }, (payload) => {
  //       // console.log(cardRefs?.current);
  //       // console.log(payload.payload);
  //       cardRefs?.current[payload.payload.data.index - 1]?.click();
  //       oppCard = payload.payload.data.cardInfo;
  //       // checks();
  //     })
  //     .on("broadcast", { event: "cardmove" }, () => {
  //       // checks();
  //     });
  // }, []);

  const setMyCard = (card) => {
    myCard = card;
  };

  const leaveHandler = async () => {
    supabase.removeAllChannels();
    console.log("removed all channels");
    Router.push("http://localhost:3000/lobby/");
    // supabase.subscribe(async (status) => {
    //   if (trackStatus === "ok") {
    //     const untrackStatus = await channel.untrack();
    //     console.log(trackStatus, "TRACKSTATUS LINE 57");
    //     console.log(untrackStatus, "STATUS/HAS LEFT");
    //   }
    // });
  };

  return (
    //window container
    <>
      <button onClick={() => console.log(presences)}>Music</button>
      <audio src="/audio/music.mp3" ref={audioRef} />

      <GameContainer>
        {props.userDeck &&
          props.userDeck.map((card, i) => {
            return (
              <Card
                user={user}
                setShowSet={setShowSet}
                // checks={checks}
                key={uuidv4()}
                setMyCard={setMyCard}
                index={i + 1}
                zIndex={i - 1}
                card={card}
              />
            );
          })}
        <div className="player-div"></div>
        {opponentDeck &&
          opponentDeck.length > 0 &&
          opponentDeck.map((card, i) => {
            return (
              <OpponentCard
                key={uuidv4()}
                zIndex={i + 1}
                card={card}
                ref={(el) => (cardRefs.current[i] = el)}
              />
            );
          })}
        <button onClick={leaveHandler}>Leave Room</button>
        <Player1HP user={props.user} />
        <Player2HP opp={opponentInfo} />
      </GameContainer>
    </>
  );
};

export default GameComponent;
