'use client';
import { userActions } from '@/store/slices/userSlice';
import { gameActions } from '@/store/slices/gameSlice';
import { useUser } from '@supabase/auth-helpers-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadActions } from '@/store/slices/loadSlice';
import { supabase } from '@/lib/supabase';
import { searchUser } from '@/store/slices/userSlice';
import { fetchDeckCards } from '@/store/slices/deckSlice';
import Router from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Throwaway from './Throwaway';
import Throwaway2 from './Throwaway2';

let player2info = null;
let player2Deck2 = null;

const Loading = () => {
	// const [throwaway, setThrowaway] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [trackingStatus, setTrackingStatus] = useState([]);

	// const router = useRouter();

	const user = useUser();
	const dispatch = useDispatch();

	const player = useSelector((state) => {
		return state.user.user;
	});

	const userDeck = useSelector((state) => {
		return state.deck;
	});

	const loading = useSelector((state) => {
		return state.load;
	});

	const lobbyPlayers = useSelector((state) => {
		return state.gameLobby.players;
	});

	useEffect(() => {
		if (!player) dispatch(searchUser(user.id));
		if (userDeck.length === 0) dispatch(fetchDeckCards(user.id));
	}, []);

	const player1id = async () => {
		let { data } = await supabase.from('game').select('player1').eq('id', Router.query.id).single();
		console.log('player1id', data);
		return data;
	};
	player1id();

	const channel = supabase.channel(Router.query.id, {
		config: { presence: { key: player.username } }
	});

	useEffect(() => {
		channel.on('broadcast', { event: 'readyUp' + Router.query.id }, (payload) => {
			console.log(payload.payload, 'READY UP PAYLOAD');
			dispatch(gameActions.setPlayer1(player));
			dispatch(gameActions.setPlayer2(payload.payload.data));
			dispatch(gameActions.setPlayer2Deck(payload.payload.userDeck));
		});
	}, [user]);

	const readyHandler = async () => {
		await channel.send({
			type: 'broadcast',
			event: 'readyUp' + Router.query.id,
			payload: { data: player, userDeck }
		});

		dispatch(loadActions.setLoading(false));
		if (player1id && player1id !== user.id) {
			const setPlayer2 = async () => {
				await supabase.from('game').update({ player2: user.id }).eq('id', Router.query.id);
			};
			setPlayer2();
		}
	};

	return (
		<div>
			<Throwaway player2info={player2info} player2Deck={player2Deck2} />
			<Throwaway2 />
			{lobbyPlayers?.length === 2 ? <button onClick={readyHandler}>Ready?</button> : 'Waiting for opponent to join'}
		</div>
	);
};

export default Loading;
