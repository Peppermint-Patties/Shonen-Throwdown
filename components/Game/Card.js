"use client";
import { motion } from "framer-motion";
import { useState, useRef, forwardRef } from "react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "@/store/slices/gameSlice";
import { loadActions } from "@/store/slices/loadSlice";

const Card = (props, refs) => {
  const dispatch = useDispatch();
  const channels = Router.query.id;
  const audioRef = useRef(null);
  const [tapCard, setTapCard] = useState(true);

  const cardInPlay = useSelector((state) => {
    return state.game.cardInPlay;
  });

  const counter = useSelector((state) => {
    return state.game.counter;
  });

  useEffect(() => {
    const counterCheck = () => {
      if (counter > 11) {
        console.log("This game is ova");
        dispatch(gameActions.ended(true));
        dispatch(loadActions.setLoading(true));
      }
    };

    const interval = setInterval(() => {
      counterCheck();
    }, 1000);

    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    setTapCard(!tapCard);
  }, []);

  const cardHandler = () => {
    console.log(props.card);
    console.log(cardInPlay);
    if (!cardInPlay) {
      props.setMyCard(props.card, props.index);
      setTapCard(!tapCard);
      audioRef.current.play();
      supabase
        .channel(channels)
        .subscribe(async (status) => {
          console.log(status);
        })
        .send({
          type: "broadcast",
          event: "cardmove",
          payload: {
            data: {
              index: props.index,
              cardInfo: props.card,
            },
          },
        });

      dispatch(gameActions.increaseCounter());
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: props.x }}
      animate={
        tapCard
          ? {
              scale: 1,
              opacity: 1,
              x: 600,
              y: -275,
              zIndex: `${props.zIndex}`,
            }
          : {
              scale: 1,
              opacity: 1,
              backgroundImage: `${props.card.image}`,
            }
      }
      exit={{ x: -3000 }}
      onClick={cardHandler}
      whileHover={{ scale: 2 }}
      className="user-container"
      ref={refs}
    >
      <img
        src={props.card.image}
        alt={props.card.title}
        className="gameplay-card"
      />
      <audio src="/audio/Cut.wav" ref={audioRef} />
    </motion.div>
  );
};

export default forwardRef(Card);
