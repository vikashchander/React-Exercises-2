import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import Joke from './Joke';
import './JokeShow.css';

 class JokeShow extends Component {
    static defaultProps={
           maxJokes : 10,
    } 
    constructor(props){
         super(props);
         this.state ={
           joke : JSON.parse(window.localStorage.getItem("jokes") || "[]"),
           loading:false
          }; 
        this.handleNewJokes = this.handleNewJokes.bind(this);
      this.seenJoke = new Set(this.state.joke.map(j=>j.text));
      console.log(this.seenJoke);  
      }

  componentDidMount(){
    if(this.state.joke.length ===0)    
   {
     this.getJokes();
   } 

 }

async getJokes(){
  try{let jokes = [];
  while(jokes.length<this.props.maxJokes){
    let res = await axios.get('https://icanhazdadjoke.com/' , {headers : {Accept: "application/json"}});
   // console.log(res.data.joke);
   let newJoke = res.data.joke;
   if(! this.seenJoke.has(newJoke)){
    jokes.push({id : uuid() ,text: res.data.joke , vote:0});
   }else{
     console.log("found A Duplicate")
     console.log(newJoke);
   }
    
    //console.log(jokes)
  }
     this.setState(
       st =>({
         loading:false , 
        joke:[ ...st.joke ,...jokes]
      }),
     ()=>window.localStorage.setItem('jokes', JSON.stringify(this.state.joke)),
     )
    // console.log(window.localStorage.setItem('jokes', JSON.stringify(this.state.joke))
    }catch(e){
      console.log("error is",e);
      this.setState({loading:false});
    }
}

 handleVotes(id,delta){
   this.setState(st => ({
      joke:st.joke.map( j=>
       j.id ===id? {...j,vote:j.vote+delta} :j
     )
   }),
   ()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
   );
 }

 handleNewJokes(){
  this.setState({loading:true},this.getJokes);

 }

    render() { 
      if(this.state.loading){
        return(
          <div className="JokeShow-spinner">
             <i className="far fa-8x fa-laugh fa-spin"/>
             <h2 className="JokeShow-title">Loading ....</h2>
          </div>
        )};
        let Jokes = this.state.joke.sort((a,b)=>b.vote-a.vote);
       return (
         <div className='JokeShow'>
            <div className="JokeShow-sidebar">
                <h2 className="JokeShow-title" >
                <span>Dad</span>Jokes 
                </h2>
               <img 
                 src="https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Smiling_Eyes_large.png?v=1480481060" alt="imogi" />
                <button className="JokeShow-more" onClick= {this.handleNewJokes}>Fetch Jokes</button>
               </div>
             <div className='JokeShow-list'>
          {
           Jokes.map(j=>
                <div>
                     <Joke  
                     key={j.id}
                     text={j.text} 
                     votes={j.vote}
                     upvotes = {()=>this.handleVotes(j.id,1)}
                     downvotes = {() =>this.handleVotes(j.id, -1)}
                     />
                </div>  
             )
        }
           </div>
         </div>
       )
     }
 }
export default  JokeShow;