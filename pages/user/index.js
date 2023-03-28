import { useSelector, useDispatch } from "react-redux";
import AccountDetails from "@/components/Account/AccountDetails";
import classes from "../../styles/UserPage.module.css";
import { motion } from "framer-motion";
import container from "@/styles/variants";
import { useState, useEffect } from "react";
import AccountUpdateForm from "@/components/Account/AccountUpdateForm";
import { searchUser } from "@/store/slices/userSlice";
import { useUser } from "@supabase/auth-helpers-react";

const UserPage = () => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const user = useUser();
  const publicUser = useSelector((state) => {
    return state.user.user;
  });

  const loadState = useSelector((state) => {
    return state.user.loading;
  });

  useEffect(() => {
    // console.log("loading");
    if (user) {
      dispatch(searchUser(user.id));
    }
  }, [user]);

  return (
    <motion.div
      variant={container}
      initial="initial"
      animate="visible"
      exit="exit"
      className={classes.container}
    >
      {loadState === true && <div>Loading</div>}
      {loadState === false && toggle === false && (
        <AccountDetails setToggle={setToggle} toggle={toggle} user={publicUser} />
      )}
      {toggle && <AccountUpdateForm setToggle={setToggle} toggle={toggle} />}
    </motion.div>
  );
};

export default UserPage;
