import Modal from '@/components/collection/modal';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState, useRef } from 'react';
import styles from './Collection.module.css';
import { motion } from 'framer-motion';
import container from '../../styles/variants';
import Deck from '@/components/deck/Deck';

const Collection = () => {
	const supabase = useSupabaseClient();
	const user = useUser();

	const [data, setData] = useState();
	const [searchInput, setSearchInput] = useState('');
	const [selectedCard, setSelectedCard] = useState(null);
	const [pageMessage, setPageMessage] = useState('Loading...');
	const [showModal, setShowModal] = useState(false);
	const [sortValue, setSortValue] = useState('series');

	useEffect(() => {
		setTimeout(() => {
			setPageMessage('There are no cards available!');
		}, 1000);

		if (!user) {
			const loadData = async () => {
				const { data } = await supabase.from('cards').select('*');
				setData(data);
			};
			loadData();
		} else {
			const loadData = async () => {
				const cardIds = await supabase.from('collections').select('*').eq('user_id', user.id);
				// console.log('cardIds', cardIds);
				// console.log('logged in collection', cardIds.data);
				const cardIdArr = cardIds.data.map((card) => card.cards_id);
				// console.log('cardIdArr', cardIdArr);
				const cards = await supabase.from('cards').select('*').in('id', cardIdArr);
				console.log(cards.data)
				// console.log('cards', cards.data);
				setData(cards.data);
			};
			loadData();
		}
	}, [user]);

	const filteredData = data && data.filter((card) => card.name.toLowerCase().includes(searchInput.toLowerCase()));

	const handleCardClick = (card) => {
		setSelectedCard(card);
	};

	const handleSortChange = (e) => {
		setSortValue(e.target.value);
	  };
	
	  let sortedData;

	  if (filteredData) {
		  sortedData = [...filteredData];
		  if (sortValue === 'name') {
			  sortedData.sort((a, b) => a.name.localeCompare(b.name));
		  } else if (sortValue === 'power') {
			  sortedData.sort((a, b) => a.power - b.power);
		  } else if (sortValue === 'element') {
			  sortedData.sort((a, b) => a.element.localeCompare(b.element));
		  } else if (sortValue === 'series') {
			  sortedData.sort((a, b) => a.series.localeCompare(b.series));
		  }
	  }

	return (
		<div>
			{user && <Deck />}
			<motion.div variants={container} initial="initial" animate="visible" exit="exit" className={styles.pageParent}>
				<div className={styles.searchParent}>
					<input
						className={styles.searchBar}
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search by name..."
					/>
					<label htmlFor="sort">Sort by:</label>
					<select id="sort" value={sortValue} onChange={handleSortChange}>
						<option value="name">Name</option>
						<option value="power">Power</option>
						<option value="element">Element</option>
						<option value="series">Series</option>
					</select>
				</div>
				<div className={styles.cardParent}>
					{sortedData !== undefined ? (
						sortedData.map((card) => (
							<motion.div
								whileHover={{ scale: 1.5 }}
								key={card.id}
								onClick={() => {
									setShowModal(!showModal);
									handleCardClick(card);
								}}
								className={styles.card}
								//   whileTap={{ scale: 0.5, x: window.innerWidth / 2 }}
							>
								<img src={card.image} alt={card.name} className={styles.img} />
							</motion.div>
						))
					) : (
						<div className={styles.loading}>
							<h1>{pageMessage}</h1>
						</div>
					)}
				</div>
				<div className={styles.modalParent}>
					{showModal && (
						<Modal
							userId={user ? user.id : null}
							showModal={showModal}
							setShowModal={setShowModal}
							card={selectedCard}
							onClose={() => setSelectedCard(null)}
						/>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default Collection;
