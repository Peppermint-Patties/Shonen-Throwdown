"use client";
import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchUser } from "@/store/slices/userSlice";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import container from "@/styles/variants";
import { fetchDeckCards } from "@/store/slices/deckSlice";
import styles from "../styles/home.module.css";
import Router from "next/router";
import shonenthrowdown from "../public/images/shonenthrowdown.gif";
import Image from "next/image";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const Home = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useUser();

  const userData = useSelector((state) => {
    return state.user.user;
  });

  const loadState = useSelector((state) => {
    return state.user.loading;
  });

  const shouldReload = useSelector((state) => {
    return state.game.shouldReload;
  });

  useEffect(() => {
    // console.log("loading");

    if (shouldReload) {
      window.location.reload();
    }
    if (user) {
      dispatch(searchUser(user.id));
      dispatch(fetchDeckCards(user.id));
    }
    // console.log(userData, "USERDATA");
  }, [userInfo]);

  if (user && userData?.username === null) {
    router.push("/login/setup-account");
  }
  return (
    <motion.div
      className={styles.pageContainer}
      variants={container}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      {loadState ? (
        <div className={styles.loading}>LOADING...</div>
      ) : (
        <div className={styles.homepageContainer}>
          <div className={styles.imgContainer}>
            <Image
              priority
              className={styles.img}
              src={shonenthrowdown}
              alt="Shonen Throwdown Logo with two cards"
            />
            <button
              className={`${roboto.className} ${styles.button}`}
              onClick={() => router.push("/lobby")}
            >
              PLAY NOW &#62;
            </button>
          </div>
          <div className={styles.section}>
            <img
              className={styles.sectionImg}
              src="http://rubberslug.s3.amazonaws.com/user/3/262b639333041368802c7e7c7bbe5ff/fdoxmylygp_o.jpg"
              alt="soul society"
            />
            <div className={styles.sectionInfo}>
              <div className={styles.sectionTextContainer}>
                <h2>Featured Card</h2>
                <h1>Ichigo Kurosaki</h1>
                <button
                  className={roboto.className}
                  onClick={() => router.push("/market")}
                >
                  PULL NOW &#62;
                </button>
              </div>
              <img
                className={styles.cardImg}
                src="https://i.imgur.com/SfS6xsj.png"
                alt="card art for Ichigo Kurosaki"
              />
            </div>
          </div>
          <div className={styles.section}>
            <img
              className={styles.sectionImg}
              src="https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg"
              alt="wood background"
            />
            <div className={styles.sectionInfo}>
              <img
                className={styles.cardImg2}
                src="https://i.imgur.com/1RbpkCe.png"
                alt="4 cards fanned out"
              />
              <div className={styles.sectionTextContainer}>
                <h2>EASY TO LEARN, FUN TO PLAY!</h2>
                <h1>BEGIN YOUR ADVENTURE</h1>
                <h1>WITH OUR HOW TO PLAY!</h1>
                <button
                  className={roboto.className}
                  onClick={() => router.push("/how-to-play")}
                >
                  LEARN MORE &#62;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const getServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // if (session && userData?.[0].username === null) {
  // 	return {
  // 		redirect: {
  // 			destination: '/login/setup-account',
  // 			permanent: false
  // 		}
  // 	};
  // }

  console.log(session, "getting session");
  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
export default Home;
