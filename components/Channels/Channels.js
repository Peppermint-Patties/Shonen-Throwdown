import Game from '@/pages/game/[id]';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { userActions } from '@/store/slices/userSlice';
import { useUser } from '@supabase/auth-helpers-react';
import { useDispatch, useSelector } from 'react-redux';
import { gameLobby, fetchGames } from '@/store/slices/gameLobbySlice';
import { searchUser } from '@/store/slices/userSlice';
import styles from './Channels.module.css';
import {supabase} from '@/lib/supabase'

const Channels = () => {
	const dispatch = useDispatch();
	const user = useUser();
	const gameLobbyData = useSelector(gameLobby)
	//useeffect to fetch all game IDs aka channels and set game ID to channel ID
	useEffect(() => {
		// const getChannels = async () => {
		// 	const { data } = await supabase.from('game').select('id').eq('isComplete', false);
		// 	setListChannels(data);
		// 	console.log('THIS IS DATA IN CHANNELS', data);
		// };
		// getChannels();
		dispatch(fetchGames())
	}, [dispatch]);

	const channel = supabase.channel('lobby')
		channel
		.on('postgres_changes',
		{
			event:'INSERT',
			schema: 'public',
			table:'game',
			filter:'isComplete=eq.FALSE',
		},
		(payload)=>{
			console.log('this is insert',payload)
			dispatch(fetchGames())
		}
		)
		.on('postgres_changes',
		{
			event:'DELETE',
			schema: 'public',
			table:'game',
			filter:'isComplete=eq.FALSE',
		},
		(payload)=> {
			console.log('this is delete',payload)
			dispatch(fetchGames())
		}
		)
		.subscribe()

	console.log('this is gameLobbyData', gameLobbyData)

	const uuid = uuidv4();
	const handleCreateRoom = () => {
		const createChannel = async () => {
			const { data, error } = await supabase.from('game').insert([{ id: `${uuid}`, player1: user.id }]);
		};
		createChannel();
		supabase.channel(`${uuid}`).subscribe();
		Router.push(`/game/${uuid}`);
	};

	return (
		<div className={styles.gamesParent}>
			<h1 className={styles.heading}>A SHOWDOWN AWAITS!</h1>

			<button className={styles.createButton} onClick={handleCreateRoom}>
				Create New Game
			</button>
			<div className={styles.channelParent}>
				{/*create room will cause trigger to create new game row and create route user to newly created game[id].js set player1 to user who created and wait for player 2*/}
				<h2 className={styles.existingHeading}>OPEN GAMES</h2>
				{gameLobbyData.length === 0 ? (
					<h1 className={styles.noGames}>No games available, create your own game!</h1>
				) : (
					gameLobbyData.map((channel, index) => (
						<div className={styles.game} key={channel.id}>
							<Link className={styles.openGames} href={`/game/${channel.id}`}>
								Game Room: {index + 1}
							</Link>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Channels;
