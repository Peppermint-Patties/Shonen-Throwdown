import { addToCollection, collectionCards, fetchCollection, updateCardQuantity } from '@/store/slices/collectionSlice';
import { fetchAllCards, marketCards } from '@/store/slices/marketSlice';
import { searchUser, updateWallet } from '@/store/slices/userSlice';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './market.module.css';
import MarketModal from '@/components/market/marketModal';

const Market = () => {
	const user = useUser();
	const dispatch = useDispatch();
	const cardsData = useSelector(marketCards);
	const userData = useSelector((state) => {
		return state.user.user;
	});
	const collection = useSelector(collectionCards);
	const singleCardPrice = 10;
	const tripleCardPrice = 25;

	console.log('this is my collection:', collection);

	const [noMoney, setNoMoney] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [newCards, SetNewCards] = useState([]);
	const [currentBanner, setCurrentBanner] = useState(3);

	useEffect(() => {
		dispatch(fetchAllCards());
		dispatch(searchUser(user.id));
		dispatch(fetchCollection(user.id));

		console.log('this is running');
	}, [dispatch]);

	const cardsBySeries = cardsData.reduce((acc, card) => {
		if (acc.hasOwnProperty(card.series)) {
			acc[card.series].push(card);
		} else {
			acc[card.series] = [card];
		}
		return acc;
	}, {});

	console.log(cardsBySeries);

	const getRandomCard = async (cards) => {
		if (userData.wallet >= singleCardPrice) {
			const updatedWallet = userData.wallet - singleCardPrice;
			const userId = user.id;
			dispatch(updateWallet({ updatedWallet, userId }));
			let power3orLowerCards = cards.filter((card) => card.power <= 3);
			let power4Cards = cards.filter((card) => card.power === 4);
			let power5Cards = cards.filter((card) => card.power === 5);
			let randomNumber = Math.random();
			let randomCard;

			if (randomNumber < 0.8) {
				randomCard = power3orLowerCards[Math.floor(Math.random() * power3orLowerCards.length)];
			} else if (randomNumber < 0.95) {
				randomCard = power4Cards[Math.floor(Math.random() * power4Cards.length)];
			} else {
				randomCard = power5Cards[Math.floor(Math.random() * power5Cards.length)];
			}

			const randomCardId = randomCard.id;
			const existingRow = collection.find((c) => c.cards_id === randomCard.id && c.user_id === user.id);
			const updatedQuantity = existingRow.quantity + 1;
			dispatch(updateCardQuantity({ updatedQuantity, randomCardId, userId }));
			SetNewCards([randomCard]);
			setShowModal(true);

			return [randomCard];
		} else {
			setNoMoney(true);
			setTimeout(() => {
				setNoMoney(false);
			}, 2000);
		}
	};

	const getThreeCards = async (cards) => {
		let selectedCards = [];
		let copyOfCards = [...cards];
		if (userData.wallet >= tripleCardPrice) {
			const updatedWallet = userData.wallet - tripleCardPrice;
			const userId = user.id;
			dispatch(updateWallet({ updatedWallet, userId }));

			for (let i = 0; i < 3; i++) {
				let randomNumber = Math.random();
				let selectedCard;

				if (randomNumber < 0.8) {
					let power3orLowerCards = copyOfCards.filter((card) => card.power <= 3);
					selectedCard = power3orLowerCards[Math.floor(Math.random() * power3orLowerCards.length)];
					copyOfCards = copyOfCards.filter((card) => card.id !== selectedCard.id);
				} else if (randomNumber < 0.95) {
					let power4Cards = copyOfCards.filter((card) => card.power === 4);
					selectedCard = power4Cards[Math.floor(Math.random() * power4Cards.length)];
					copyOfCards = copyOfCards.filter((card) => card.id !== selectedCard.id);
				} else {
					let power5Cards = copyOfCards.filter((card) => card.power === 5);
					selectedCard = power5Cards[Math.floor(Math.random() * power5Cards.length)];
					copyOfCards = copyOfCards.filter((card) => card.id !== selectedCard.id);
				}

				selectedCards.push(selectedCard);
			}

			const selectedCardsIds = selectedCards.map((card) => card.id);
			const matchingRows = collection.filter((c) => selectedCardsIds.includes(c.cards_id));
			const updatedRows = matchingRows.map((row) => {
				return {
					...row,
					quantity: row.quantity + 1
				};
			});

			let updatedQuantity = updatedRows[0].quantity;
			let randomCardId = updatedRows[0].cards_id;
			dispatch(updateCardQuantity({ updatedQuantity, randomCardId, userId }));
			updatedQuantity = updatedRows[1].quantity;
			randomCardId = updatedRows[1].cards_id;
			dispatch(updateCardQuantity({ updatedQuantity, randomCardId, userId }));
			updatedQuantity = updatedRows[2].quantity;
			randomCardId = updatedRows[2].cards_id;
			dispatch(updateCardQuantity({ updatedQuantity, randomCardId, userId }));

			SetNewCards(selectedCards);
			setShowModal(true);
			return selectedCards;
		} else {
			setNoMoney(true);
			setTimeout(() => {
				setNoMoney(false);
			}, 2000);
		}
	};

	const handleBannerClick = (bannerNumber) => {
		setCurrentBanner(bannerNumber);
	};

	return (
		<div className={styles.pageParent}>
			<div className={styles.currencyContainer}>
				<h1 className={styles.h1}>{userData ? `${userData.wallet} tokens` : 'loading'}</h1>
			</div>
			<nav className={styles.nav}>
				<div
					className={styles.cardBanner}
					style={{
						backgroundColor: currentBanner === 1 ? 'yellow' : 'blue',
						color: currentBanner === 1 ? 'black' : 'white'
					}}
					onClick={() => handleBannerClick(1)}
				>
					<h1>One Piece</h1>
				</div>
				<div
					className={styles.cardBanner}
					style={{
						backgroundColor: currentBanner === 2 ? 'yellow' : 'blue',
						color: currentBanner === 2 ? 'black' : 'white'
					}}
					onClick={() => handleBannerClick(2)}
				>
					<h1>Naruto</h1>
				</div>
				<div
					className={styles.cardBanner}
					style={{
						backgroundColor: currentBanner === 3 ? 'yellow' : 'blue',
						color: currentBanner === 3 ? 'black' : 'white'
					}}
					onClick={() => handleBannerClick(3)}
				>
					<h1>Bleach</h1>
				</div>
				<div
					className={styles.cardBanner}
					style={{
						backgroundColor: currentBanner === 4 ? 'yellow' : 'blue',
						color: currentBanner === 4 ? 'black' : 'white'
					}}
					onClick={() => handleBannerClick(4)}
				>
					<h1>DBZ</h1>
				</div>
			</nav>
			{currentBanner === 1 && (
				<div className={styles.banner}>
					<img className={styles.img} src="https://i.imgur.com/zKeGQID.png" alt="One Piece Banner" />
					<div>
						<button className={styles.button} onClick={() => getRandomCard(cardsBySeries['One Piece'])}>
							Pull One 10 tokens
						</button>
						<button className={styles.button} onClick={() => getThreeCards(cardsBySeries['One Piece'])}>
							Pull Three 25 tokens
						</button>
					</div>
				</div>
			)}
			{currentBanner === 2 && (
				<div className={styles.banner}>
					<img className={styles.img} src="https://i.imgur.com/HhwbDvp.png" alt="Naruto Banner" />
					<div>
						<button className={styles.button} onClick={() => getRandomCard(cardsBySeries['Naruto'])}>
							Pull One 10 tokens
						</button>
						<button className={styles.button} onClick={() => getThreeCards(cardsBySeries['Naruto'])}>
							Pull Three 25 tokens
						</button>
					</div>
				</div>
			)}
			{currentBanner === 3 && (
				<div className={styles.banner}>
					<img className={styles.img} src="https://i.imgur.com/Gnfe44n.png" alt="Bleach Banner" />
					<div>
						<button className={styles.button} onClick={() => getRandomCard(cardsBySeries['Bleach'])}>
							Pull One 10 tokens
						</button>
						<button className={styles.button} onClick={() => getThreeCards(cardsBySeries['Bleach'])}>
							Pull Three 25 tokens
						</button>
					</div>
				</div>
			)}
			{currentBanner === 4 && (
				<div className={styles.banner}>
					<img className={styles.img} src="https://i.imgur.com/eiqVfQA.png" alt="Dragon Ball Z Banner" />
					<div>
						<button className={styles.button} onClick={() => getRandomCard(cardsBySeries['DBZ'])}>
							Pull One 10 tokens
						</button>
						<button className={styles.button} onClick={() => getThreeCards(cardsBySeries['DBZ'])}>
							Pull Three 25 tokens
						</button>
					</div>
				</div>
			)}
			{noMoney ? <p className={styles.error}>Not enough Currency!</p> : null}
			<div className={styles.modalParent}>
				{showModal && <MarketModal cardArr={newCards} showModal={showModal} setShowModal={setShowModal} />}
			</div>
		</div>
	);
};

export default Market;
