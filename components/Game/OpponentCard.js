import { forwardRef, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const OpponentCard = (props, ref) => {
  const audioRef = useRef(null);

  const [tapCard, setTapCard] = useState(false);
  const opponentCardHandler = () => {
    setTapCard(!tapCard);
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={
        tapCard
          ? {
              scale: 1,
              opacity: 1,
              x: -600,
              y: 175,
              opacity: 1,
              zIndex: `${12 - props.zIndex}`,
            }
          : { scale: 1, opacity: 0.6 }
      }
      className="opponent-container"
      onClick={() => opponentCardHandler()}
      ref={ref}
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

export default forwardRef(OpponentCard);