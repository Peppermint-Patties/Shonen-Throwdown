'use client';
import React, { useEffect, useState, useRef, createContext } from 'react';
import Messages from '@/components/Messages/Messages';
import { supabase, useStore } from '@/lib/supabase';
import GameRoom from '@/components/GameRoom/GameRoom';
import { useUser } from '@supabase/auth-helpers-react';
import { useSelector } from 'react-redux';
import Channels from '@/components/Channels/Channels';
// import { Router } from "react-router-dom";
import { useRouter } from 'next/router';
// import Router from "next/router";
import styles from './lobby.module.css';

const Lobby = () => {
	const authUser = useUser();
	const [user, setUser] = useState();
	const router = useRouter();
	const route = router.pathname;
	console.log('🚀 ~ file: index.js:22 ~ Lobby ~ route:', route);

	useEffect(() => {
		// if (user) {
		//   dispatch(searchUser(user.id));
		//   dispatch(fetchDeckCards(user.id));
		// }
		// console.log(shouldReload);
		// if (shouldReload) {
		//   window.location.reload();
		// }
		const fetchUser = async () => {
			const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single();
			setUser(data);
		};
		fetchUser();
	}, []);

	return (
		<div className={styles.pageParent}>
			<div className={styles.background}>
				<Channels props={user} />
				<Messages props={user} />
			</div>
		</div>
	);
};

export default Lobby;
