window.addEventListener("load",function(){
	for(let button of document.querySelectorAll("button")){
		button.addEventListener("click",function(e){
			chosen_action = button.value;
		});
	}
	let player_list;
	let human_count = 1;
	let ai_count = 3;
	let player_count = ai_count+human_count;
	let counter_amount = player_count <= 5 && player_count >= 3 ? 11 : player_count == 6 ? 7 : player_count == 7 ? 7 : 0;
	let names = ["Alex", "Ben", "Charlie", "Darren", "Eli", "Freya", "Greg"];
	let turn_count = 0;
	let last_turn_time = new Date().getTime();
	let chosen_action = "";
	let counters;
	let deck;
	function rand(num_1,num_2=0){
		if(num_2==0){
			return Math.floor(Math.random()*num_1);
		} else {
			return Math.floor(Math.random()*(num_2+1-num_1))+num_1;
		}
	}
	function shuffle(list){
		for(let i = 0;i<list.length;i++){
			let j = rand(list.length);
			let temp = list[j];
			list[j] = list[i];
			list[i] = temp;
		}
		return list;
	}
	class Card{
		constructor(value){
			this.element = document.createElement("tr");
			
			this.value = value;
			this.value_element = document.createElement("td");
			
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
			for(let value=3;value<=35;value++){
				this.card_list.push(new Card(value));
			}
			this.card_list = shuffle(this.card_list);
			for(let card of this.card_list){
				this.element.appendChild(card.element);
			}
		}
		draw(){
			for(let card of this.card_list){
				card.draw();
			}
		}
		take(){
			let removed_card = this.card_list.shift();
			removed_card.element.remove();
			return removed_card.value;
		}
	}
	class Player{
		constructor(name,counter_amount,type){
			this.element = document.createElement("tr");
			
			this.name = name+" ("+type+")";
			this.name_element = document.createElement("td");
			this.element.appendChild(this.name_element);
			
			this.counter_amount = counter_amount;
			this.counter_amount_element = document.createElement("td");
			this.element.appendChild(this.counter_amount_element);
			
			this.card_list = [];
			this.card_list_element = document.createElement("td");
			this.element.appendChild(this.card_list_element);
			
			
			this.type = type;
			this.turn = false;
		}
		draw(){
			this.name_element.innerHTML = this.name+(this.turn?"*":"");
			this.counter_amount_element.innerHTML = this.counter_amount;
			this.card_list_element.innerHTML = this.card_list.toString();
		}
		go(){
			if(this.type=="human"&&chosen_action=="")return;
			if(this.type=="ai"){
				if(new Date().getTime()<=last_turn_time+1000)return;
				if(this.counter_amount == 0||rand(1,4)==1){
					this.take();
				} else {
					this.pass();
				}
			} else {
				if(chosen_action=="take"){
					this.take();
				} else if(chosen_action=="pass"){
					this.pass();
				}
				chosen_action="";
			}
			last_turn_time = new Date().getTime();
		}
		take(){
			this.card_list.push(deck.take());
			this.counter_amount += counters.take();
		}
		pass(){
			this.counter_amount--;
			counters.pass();
			turn_count=(++turn_count)%player_count;
		}
	}
	class PlayerList{
		constructor(){
			this.element = document.querySelector(".players");
			this.player_list = [];
			
			for(let i = 0; i < player_count; i++) {
				this.player_list.push(new Player(names[i], counter_amount,i+1>ai_count?"human":"ai"));
			}
			this.player_list = shuffle(this.player_list);
			
			for(let player of this.player_list){
				this.element.appendChild(player.element);
			}
		}
		go(){
			this.player_list[turn_count].go();
		}
		draw(){
			let count = 0;
			console.log(turn_count);
			for(let player of this.player_list){
				player.turn = count==turn_count;
				player.draw();
				count++;
			}
		}
	}
	class Counters{
		constructor(){
			this.element = document.querySelector(".counters");
			this.count = 0;
		}
		draw(){
			this.element.innerHTML = counters.count;
		}
		take(){
			let taken_count = this.count;
			this.count = 0;
			return taken_count;
		}
		pass(){
			this.count++;
		}
	}
	function frame(){
		player_list.go();
		player_list.draw();
		counters.draw();
		window.requestAnimationFrame(frame);
	}
	start();
	function start() {
		player_list = new PlayerList();
		player_list.draw();
		counters = new Counters();
		counters.draw();
		deck = new Deck();
		deck.draw();
		window.requestAnimationFrame(frame);
	}
});