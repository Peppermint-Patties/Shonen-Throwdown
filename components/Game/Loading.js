"use client";
import { gameActions } from "@/store/slices/gameSlice";
import { useUser } from "@supabase/auth-helpers-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadActions } from "@/store/slices/loadSlice";
import { supabase } from "@/lib/supabase";
import { searchUser } from "@/store/slices/userSlice";
import { fetchDeckCards } from "@/store/slices/deckSlice";
import Router, { useRouter } from "next/router";
import Throwaway from "./Throwaway";
import { useRef } from "react";
import { motion } from "framer-motion";
import UsersInLoading from "./usersInLoading"

let player2info = null;
let player2Deck2 = null;

const Loading = () => {
  const router = useRouter;
  const audioRef = useRef(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [readyHandler, setReadyHandler] = useState(() => () => {});
  const [users, setUsers] = useState();


  const user = useUser();
  const dispatch = useDispatch();

  const player = useSelector((state) => {
    return state.user.user;
  });

  const userDeck = useSelector((state) => {
    return state.deck;
  });

  const channelID = typeof window !== "undefined" && Router.query.id;

  useEffect(() => {
    if (!player) dispatch(searchUser(user.id));
    if (userDeck.length === 0) dispatch(fetchDeckCards(user.id));
  }, []);

  const channel = supabase.channel(channelID, {
    config:{
        presence:{
            key:'username'
        }
    }
});

  const player1id = async () => {
    let { data } = await supabase
      .from("game")
      .select("player1")
      .eq("id", channelID)
      .single();
    console.log("player1id", data);
    return data;
  };
  player1id();

  useEffect(() => {
    channel
    .subscribe(async (status)=>{
        if (status === 'SUBSCRIBED'){
            const presenceTrackStatus = await channel.track({
                user: player.username
            })
            console.log(presenceTrackStatus)
        }
    })

    channel.on("broadcast", { event: "readyUp/" + channelID }, (payload) => {
      console.log(payload.payload, "READY UP PAYLOAD");
      dispatch(gameActions.setPlayer1(player));
      dispatch(gameActions.setPlayer2(payload.payload.player));
      dispatch(gameActions.setPlayer2Deck(payload.payload.userDeck));
    })
    .on('presence',{event: 'sync'}, ()=>{
      const state = channel.presenceState()
      const usersInLobby = state.username ? state.username.map((user)=> user.user) : []
      setUsers(usersInLobby)
      console.log('this is state',users)
  })
  .on('presence',{event:'join'},({key, newPresences})=>{
      console.log(key, newPresences,"has joined")
  })
  .on('presence',{event:'leave'},({key, leftPresences})=>{
      console.log(key, leftPresences,"has left")
  })

    setReadyHandler(()=>()=>{
      channel.send({
        type: "broadcast",
        event: "readyUp/" + channelID,
        payload: { player, userDeck },
      });
      console.log(audioRef, "AUDIO REF");
  
      dispatch(loadActions.setLoading(false));
      if (player1id && player1id !== user.id) {
        const setPlayer2 = async () => {
          await supabase
            .from("game")
            .update({ player2: user.id })
            .eq("id", channelID);
        };
        setPlayer2();
      }
    })
  }, [user]);

  return (
    <>
    <h1>{users ? users.join(', '): 'loading'}</h1>
    <div className="load-container">
      <audio src="/audio/cut.wav" ref={audioRef} />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.7 }}
        src="/images/1star1.png"
        className="dragon-balls db1"
      />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.8 }}
        src="/images/2star.png"
        className="dragon-balls db2"
      />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.1 }}
        src="/images/3star.png"
        className="dragon-balls db3"
      />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        src="/images/4star.png"
        className="dragon-balls db4"
      />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.2 }}
        src="/images/5star.png"
        className="dragon-balls db5"
      />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.4 }}
        src="/images/6star.png"
        className="dragon-balls db6"
      />
      <motion.img
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.6 }}
        src="/images/7star.png"
        className="dragon-balls db7"
      />

      {localLoading && <div>LOADING...</div>}

      <Throwaway player2info={player2info} player2Deck={player2Deck2} />
      <div className="container1">
        <div className="textleft">
          <div className="textscroll">
            <img
              src="http://img05.deviantart.net/cef3/i/2015/122/c/4/dragon_ball_z__dbz__nuevo_logo_by_saodvd-d8rx6aw.png"
              className="dbzlogo"
            />
            <p className="dbztext">
              A Saiyan warrior who was sent to Earth as a baby and was raised by
              a kind-hearted human named Grandpa Gohan. Goku possesses
              incredible strength, speed, and martial arts skills, which he uses
              to protect the Earth from various threats. He is known for his
              cheerful and adventurous personality, and his insatiable love for
              food. Goku is also famous for his iconic spiky black hair, his
              trademark orange gi, and his ability to transform into powerful
              Super Saiyan forms when pushed to his limits.
            </p>
          </div>
        </div>
      </div>
      <button onClick={()=>{if(users.length === 2){readyHandler()}}} className="ready-btn">
        <motion.div
          initial={{
            scale: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "450px",
            width: "300px",
            backgroundImage:
              "url('http://vignette2.wikia.nocookie.net/fictional-battle-omniverse/images/8/8b/Goku_Dragon_Ball_Z.png/revision/latest?cb=20150508010447')",
            backgroundSize: "150px auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 0",
            filter: "none",
          }}
          // animate={{
          //   scale: 1.5,
          // }}
          whileHover={{
            height: "450px",
            width: "300px",
            backgroundImage:
              "url('http://vignette3.wikia.nocookie.net/vsbattles/images/5/56/Goku_%28Base%29.png/revision/latest?cb=20160315175220')",
            backgroundSize: "200px auto",
            filter: "drop-shadow(0px 0px 10px #eefe27)",
          }}
        >
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: 200 }}
            className="ready-text"
          >
            {users ? users.length === 2 ? 'Are you ready?':'Waiting for opponent!': 'loading'}
          </motion.p>
        </motion.div>
      </button>
    </div>
    </>
  );
};

export default Loading;
