import React, { Component } from 'react';
import Deck from './Deck';
import './Card.css'
import axios from "axios";


const cardBaseApi = 'https://deckofcardsapi.com/api/deck';
//https://deckofcardsapi.com/api/deck/${deck_id}/draw/

class Card extends Component{
   constructor(props){
       super(props);
       this.state = {deck:null, drawn:[ ]}
       this.handleCards = this.handleCards.bind(this);
   }

   async componentDidMount(){
    let deck = await axios.get(`${cardBaseApi}/new/shuffle/`);
       this.setState({deck:deck.data});
       console.log(deck.data);
   } 
   
  async handleCards(){
      let deck_id = this.state.deck.deck_id;
      try {
        let cardsUrl = `${cardBaseApi}/${deck_id}/draw/`;
        let cardResponse = await axios.get(cardsUrl);
        if(!cardResponse.data.success){
            throw new Error("No card Remaining")
        }
        console.log("inside handlecards",cardResponse.data.cards[0]);
        let cardsdata =cardResponse.data.cards[0];
        this.setState(data=>
       ({     drawn:[
                ...data.drawn,
                {
                    id:cardsdata.code,
                    image:cardsdata.image,
                    name:`${cardsdata.value} of ${cardsdata.suit}`
                }
            ]
        }));
        } 
      catch (error) {
        alert(error);
      }
    
}

    render(){
        const cards = this.state.drawn.map(c=>
            <Deck image={c.image} name={c.name} key={c.id} />
        )
        return(
            <div>
            <h1>Card Dealer</h1>
            <button onClick={this.handleCards}>Click Here !!</button>
            <div className="Card-Area">{cards}</div>
            </div>);
    }
}

export default  Card;