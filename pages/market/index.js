import { collectionCards, fetchCollection } from "@/store/slices/collectionSlice";
import { fetchAllCards, marketCards } from "@/store/slices/marketSlice";
import { searchUser, updateWallet } from "@/store/slices/userSlice";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from './market.module.css'

const Market = () => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const dispatch = useDispatch();
    const cardsData = useSelector(marketCards)
    const userData = useSelector((state)=>{
        return state.user.user
    })
    const collection = useSelector(collectionCards)
    const cardPrice = 10
    
    console.log('this is my collection:', collection)

    const [noMoney, setNoMoney] = useState(false);

    useEffect(()=>{
        dispatch(fetchAllCards())
        dispatch(searchUser(user.id))
        dispatch(fetchCollection(user.id))
        
        console.log('this is running')
    },[dispatch])

    const cardsBySeries = cardsData.reduce((acc, card) => {
        if (acc.hasOwnProperty(card.series)) {
          acc[card.series].push(card);
        } else {
          acc[card.series] = [card];
        }
        return acc;
      }, {});

    console.log(cardsBySeries["One Piece"])

    const getRandomCard = async(cards) =>{
        if(userData.wallet > cardPrice){
            const updatedWallet = userData.wallet - cardPrice;
            const userId = user.id
            dispatch(updateWallet({updatedWallet, userId}))
            let power3orLowerCards = cards.filter(card => card.power <= 3);
            let power4Cards = cards.filter(card => card.power === 4);
            let power5Cards = cards.filter(card => card.power === 5);
            let randomNumber = Math.random();
            let randomCard;

            if (randomNumber < 0.7) {
            randomCard = power3orLowerCards[Math.floor(Math.random() * power3orLowerCards.length)];
            } else if (randomNumber < 0.9) {
            randomCard = power4Cards[Math.floor(Math.random() * power4Cards.length)];
            } else {
            randomCard = power5Cards[Math.floor(Math.random() * power5Cards.length)];
            }

            const existsInCollection = collection.some(c => c.cards_id === randomCard.id);

            if(existsInCollection){
                const existingRow = collection.find(c => c.cards_id === randomCard.id && c.user_id === user.id);
                const updatedQuantity = existingRow.quantity + 1;
                await supabase.from('collections')
                .update({ quantity: updatedQuantity })
                .eq('cards_id', randomCard.id)
                .eq('user_id', user.id);
            } else{
                await supabase.from('collections').insert([
                    { 
                        user_id: user.id,
                        cards_id: randomCard.id,
                    },
                ])
            }
            console.log(randomCard)
            return randomCard;
        }
        else{
            setNoMoney(true)
            setTimeout(()=>{
                setNoMoney(false);
            }, 2000);
        }
    }

    const getThreeCards = (cards) =>{
        let selectedCards = [];
        let power3orLowerCards = cards.filter(card => card.power <= 3);
        let power4Cards = cards.filter(card => card.power === 4);
        let power5Cards = cards.filter(card => card.power === 5);

        for (let i = 0; i < 3; i++) {
            let randomNumber = Math.random();
            let selectedCard;

            if (randomNumber < 0.7) {
            selectedCard = power3orLowerCards[Math.floor(Math.random() * power3orLowerCards.length)];
            } else if (randomNumber < 0.9) {
            selectedCard = power4Cards[Math.floor(Math.random() * power4Cards.length)];
            } else {
            selectedCard = power5Cards[Math.floor(Math.random() * power5Cards.length)];
            }

            selectedCards.push(selectedCard);
        }
        console.log(selectedCards)
        return selectedCards;
    }

    return(
        <div>
            <h1>Currency: {userData ? `${userData.wallet} tokens` : 'loading'}</h1>
            <h1>One Piece Booster Pack</h1>
            <button onClick={()=>getRandomCard(cardsBySeries['One Piece'])}>Pull One 10 tokens</button>
            <button onClick={()=>getThreeCards(cardsBySeries['One Piece'])}>Pull Three 30 tokens</button>
            {noMoney ? <p className={styles.error}>Not enough Currency!</p>:null}
        </div>
    )
};

export default Market;