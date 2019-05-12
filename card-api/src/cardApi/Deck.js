import React, { Component } from 'react';
import './Deck.css';

class Deck extends Component{
   constructor(props){
     super(props);
     let angle = Math.random() *90 -45;
     let xTransformation = Math.random() *40 -20;
     let yTransformation = Math.random() * 40-20;
     this._Transform  = `translate(${xTransformation}px , ${yTransformation}px) rotate(${angle}deg)`;
   }

    render() {
      return (
        
        <img className="Deck"
        style ={{transform:this._Transform}}
        key = {this.props.key}
        src={this.props.image} 
        alt ={this.props.name}/>
      )
    }
}
export default Deck;