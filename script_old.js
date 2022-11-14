window.addEventListener("load", function() {
	function rand(num_1,num_2=0){
		if(num_2==0){
			return Math.floor(Math.random()*num_1);
		} else {
			return Math.floor(Math.random()*(num_2+1-num_1))+num_1;
		}
	}
	/*
	class Card {
		constructor(value){
			this.element = document.createElement("tr");
			this.value = value;
			this.value_element = document.createElement("td");
			this.value_element.innerHTML = this.value;
			this.element.appendChild(this.value_element);
		}
		draw(){
			this.value_element.innerHTML = this.value;
		}
	}
	class Deck{
		constructor(){
			this.element = document.querySelector(".deck");
			this.card_list = [];
			for(let card_value = 3; card_value <= 35; card_value++) {
				this.card_list.push(new Card(card_value));
			}
			let deck_obj = this;
			this.card_list.forEach(function(value,index){
				deck_obj.element.appendChild(deck_obj.card_list[index].element);
			});
			this.shuffle();
		}
		shuffle(){
			for(let i=0;i<this.card_list.length;i++){
				let swap_index = Math.floor(Math.random()*33);
				let swap_card = this.card_list[swap_index];
				this.card_list[swap_index] = this.card_list[i];
				this.card_list[i] = swap_card;
			}
			this.draw();
		}
		takeCard(){
			
		}
		draw(){
			let deck_obj = this;
			this.card_list.forEach(function(value, index){
				deck_obj.card_list[index].draw();
			});
		}
	}*/
	class Card {
		constructor(value){
			this.value = value;
			this.element = document.createElement("tr");
			this.value_element = document.createElement("td");
			//this.draw();
			this.element.appendChild(this.value_element);
		}
		draw(){
			this.value_element.innerHTML = this.value;
		}
	}
	class Deck {
		constructor(){
			this.element = document.querySelector(".deck");
			this.card_list = [];
			for(let card_value = 3; card_value <= 35; card_value++) {
				this.card_list.push(new Card(card_value));
			}
			//this.shuffle();
		}
		shuffle(){
			for(let i=0;i<this.card_list.length;i++){
				let swap_index = Math.floor(Math.random()*33);
				let swap_value = this.card_list[swap_index];
				this.card_list[swap_index] = this.card_list[i];
				this.card_list[i] = swap_value;
			}
			this.draw();
		}
		draw(){
			this.element.innerHTML = "";
			for(let card of this.card_list){
				card.draw();
				this.element.appendChild(card.element);
			}
		}
		take(){
			this.card_list.shift();
			this.draw();
		}
		getTopCard(){
			return this.card_list[0];
		}
	}
	class Player {
		constructor(name, counter_count, number, type) {
			this.element = document.createElement("tr");
			this.type = type;
			
			this.number = number;
			
			this.name = name;
			this.name_element = document.createElement("td");
			this.name_element.innerHTML = this.name;
			
			this.counter_count = counter_count;
			this.counter_element = document.createElement("td");
			
			this.card_list = [];
			this.card_list_element = document.createElement("td");
			
			this.turn = false;
			
			//this.draw();
			
			this.element.appendChild(this.name_element);
			this.element.appendChild(this.counter_element);
			this.element.appendChild(this.card_list_element);
			document.querySelector(".players").appendChild(this.element);
		}
		draw() {
			this.name_element.innerHTML = this.name+(this.turn?"*":"");
			this.counter_element.innerHTML = this.counter_count;
			this.card_list_element.innerHTML = this.card_list.toString();
			this.turn = player_turn%player_count == this.number;
		}
		take(){
			if(rand(1,4)==1||this.counter_count==0||selectedOption=="take"){
				selectedOption = "";
				this.card_list.push(deck.getTopCard().value);
				deck.take();
				this.counter_count+=counter_count;
				counter_count=0;
				player_turn--;
			} else {
				this.counter_count--;
				counter_count++;
				document.querySelector(".counters").innerHTML = counter_count;
			}
		}
	}
	class PlayerList{
		constructor(){
			this.element = document.querySelector(".players");
			
			this.player_list = [];
			let counter_amount = player_count <= 5 && player_count >= 3 ? 11 : player_count == 6 ? 7 : player_count == 7 ? 7 : 0;
			for(let i = 0; i < player_count; i++) {
				this.player_list.push(new Player(names[i], counter_amount,i,i+1>ai_count?"human":"ai"));
			}
			
			
			let player_list_obj = this;
			for(let player of this.player_list){
				this.element.appendChild(player.element);
			}
		}
		draw(){
			for(let player of this.player_list){
				if(player.turn&&player.type=="ai"){
					player.take();
					player_turn++;
				} else if(player.type=="human"&&selectedOption!=""){
					player.take();
					player_turn++;
				}
				player.draw();
			}
		}
	}
	let selectedOption="";
	let turn_count=0;
	let names = ["Alex", "Ben", "Charlie", "Darren", "Eli", "Freya", "Greg"];
	let player_turn = 0;
	let player_list;
	let start_time;
	let counter_count=0;
	let deck;
	let human_count = 1;
	let ai_count = 3;
	let player_count = ai_count+human_count;
	start();
	document.querySelectorAll("button").forEach(function(button){
		button.addEventListener("click",function(e){
			selectedOption = e.target.getAttribute("value");
		});
	});
	function frame() {
		if(new Date().getTime() >= start_time + player_turn * 1000) {
			player_list.draw();
		}
		if(deck.card_list.length>0){
			window.requestAnimationFrame(frame);
		}
	}

	function start() {
		player_list = new PlayerList();
		deck = new Deck();
		deck.shuffle();
		start_time = new Date().getTime();
		window.requestAnimationFrame(frame);
	}
});