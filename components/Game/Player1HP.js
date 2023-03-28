import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Player1HP = (props) => {
  // const [health, setHealth] = useState(props.myHP);
  const health = useSelector((state) => {
    return state.game.player1HP;
  });

  // useEffect(() => {
  //   setHealth(health);
  // }, [health]);
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="player1-hp"
    >
      {props.user?.username} HP: {health}
    </motion.div>
  );
};

export default Player1HP;
