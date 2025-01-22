Game.registerMod("Perfect Bot", {
    init: function() {
		const CLICKS_PER_SECOND = 10;
        const AUTOCLICKER_INTERVAL = 1000 / CLICKS_PER_SECOND;
		const LOGIC_UPDATES_PER_SEC = 4;
		const LOGIC_UPDATE_INTERVAL = 1000 / LOGIC_UPDATES_PER_SEC;
		const NUM_OF_BUILDINGS = 20;
		this.buildings_arr = new Array(NUM_OF_BUILDINGS); /* There are 20 buildings */
		this.true_never_click = false;
		this.logic_achievements = new Map(); /* Achievements that require alterting the logic to obtain */
		

		this.auxiliary_init();
		
		this.intervalId = setInterval(this.autoclicker, AUTOCLICKER_INTERVAL);
		
		setInterval(() => {
			this.logic(NUM_OF_BUILDINGS, CLICKS_PER_SECOND);
		}, LOGIC_UPDATE_INTERVAL);
        
    },
	logic: function(num_of_buildings, clicks_per_sec){
		/* auto buying */
		let item_to_buy = this.buying_handler(num_of_buildings, clicks_per_sec);
		if(item_to_buy.getPrice() <= Game.cookies) item_to_buy.buy(); /* buy the best valued item once we can afford it */
		this.golden_cookie_clicker();

		/* achievements */
		this.achievement_handler();


	},
	achievement_handler: function(){
		function get_tabloid_addiction(){
			for(let i = 0; i < 50; i ++){
				document.querySelector("#commentsText1").click();
			}
		}
		function get_god_complex(){
			Game.bakeryNameSet("orteil");
			Game.bakeryNameSet("perfect bot");
		}

		function get_olden_days(){
			document.querySelector("#logButton").click();
			document.querySelector("#oldenDays > div").click();
			document.querySelector("#logButton").click();
		}

		function get_whats_in_a_name(){
			document.querySelector("#bakeryName").click();
			Game.ConfirmPrompt();
		}

		async function get_free_achievements(){
			await Promise.all([get_tabloid_addiction(), get_god_complex(), get_olden_days(), get_whats_in_a_name()]);

		}
		const has_free_achievements = () =>{
			return this.logic_achievements.get('tabloid addiction') && this.logic_achievements.get('god complex') 
			&& this.logic_achievements.get("olden days") && this.logic_achievements.get("change name");
		}

		
		if(!has_free_achievements()){
			get_free_achievements();
			
		}

		

	},
	buying_handler: function(num_of_buildings, clicks_per_sec){
		/* value = (building-CPS)/ (cost * time-to-afford) | building-CPS is per not total*/
		/* function that calculates the value (to handle buildings and upgrades) */
		function calculate_value(item_cps, item_price, idle_cps, mouse_cps){
			return item_cps / ((item_price ** 2) / (idle_cps + (mouse_cps * clicks_per_sec)));
		}

		let curr_value = 0;
		/* calculate values per building */
		let best_purchase = null;
		for(let i = 0; i < num_of_buildings; i ++){
			let temp_value = calculate_value(this.buildings_arr[i].storedCps, this.buildings_arr[i].getPrice(), Game.cookiesPs, Game.computedMouseCps);
			if(curr_value <= temp_value){
				curr_value = temp_value;
				best_purchase =  this.buildings_arr[i];
			}
		}


		/* calculate values per upgrades (there are a lot of upgrades and different effects they have) */
		let curr_upgrades = Game.UpgradesInStore;
		for(let i = 0; i < curr_upgrades.length; i ++){
			let original_mouse_cps = Game.computedMouseCps;
			let original_idle_cps = Game.cookiesPs;
			curr_upgrades[i].bought = 1; /* Kind of buys it, but doesn't remove from the store or give achievements */
			Game.CalculateGains(); /* recalculate the CPS otherwise it will take a while */
			let delta_mouse_cps = Game.computedMouseCps - original_mouse_cps;
			let delta_idle_cps = Game.cookiesPs - original_idle_cps;
			let temp_value = calculate_value(delta_idle_cps + (delta_mouse_cps * clicks_per_sec), curr_upgrades[i].getPrice(), original_idle_cps, original_mouse_cps);
			curr_upgrades[i].bought = 0;
			Game.CalculateGains();

			if(curr_value <= temp_value){
				curr_value = temp_value;
				best_purchase = curr_upgrades[i];
			}
		}
		
		console.log("Best option is ", best_purchase.name);
		return best_purchase;
	},
	golden_cookie_clicker: function(){
		let curr_cookies = Game.shimmers;
		for(let i = 0; i < curr_cookies.length; i ++){
			if(curr_cookies[i].type === 'golden' && curr_cookies[i].wrath === 0) curr_cookies[i].pop();
		}
	},
	autoclicker: function(){
		if(!this.true_never_click) Game.ClickCookie();
	},
	get_idle_cps: function(){

	},
	update_achievement_status: function(){
		this.logic_achievements.set("tabloid addiction", Game.Achievements['Tabloid addiction'].won);
		this.logic_achievements.set("god complex", Game.Achievements['God complex'].won);
		this.logic_achievements.set("olden days", Game.Achievements['Olden days'].won);
		this.logic_achievements.set("change name", Game.Achievements['What\'s in a name'].won);



		this.logic_achievements.set("true neverclick", Game.Achievements['True Neverclick'].won);
		this.logic_achievements.set("fading luck", Game.Achievements['Fading luck'].won);
		this.logic_achievements.set("polymath", Game.Achievements['Polymath'].won);
		this.logic_achievements.set("ren baker", Game.Achievements['Renaissance baker'].won);
		this.logic_achievements.set("mathematician", Game.Achievements['Mathematician'].won);
		this.logic_achievements.set("base 10", Game.Achievements['Base 10'].won )

		this.logic_achievements.set("grandmapocalypse", Game.Achievements['Grandmapocalypse'].won);
		this.logic_achievements.set("wrath cookie", Game.Achievements['Wrath cookie'].won);
		this.logic_achievements.set("debt evasion", Game.Achievements['Debt evasion'].won);

	},
	auxiliary_init: function(){
		/* initialize the logic_achievements map */
		this.update_achievement_status();

		/* add all 20 buildings to the array */
		this.buildings_arr[0] = Game.Objects['Cursor'];
		this.buildings_arr[1] = Game.Objects['Grandma'];
		this.buildings_arr[2] = Game.Objects['Farm'];
		this.buildings_arr[3] = Game.Objects['Mine'];
		this.buildings_arr[4] = Game.Objects['Factory'];
		this.buildings_arr[5] = Game.Objects['Bank'];
		this.buildings_arr[6] = Game.Objects['Temple'];
		this.buildings_arr[7] = Game.Objects['Wizard tower'];
		this.buildings_arr[8] = Game.Objects['Shipment'];
		this.buildings_arr[9] = Game.Objects['Alchemy lab'];
		this.buildings_arr[10] = Game.Objects['Portal'];
		this.buildings_arr[11] = Game.Objects['Time machine'];
		this.buildings_arr[12] = Game.Objects['Antimatter condenser'];
		this.buildings_arr[13] = Game.Objects['Prism'];
		this.buildings_arr[14] = Game.Objects['Chancemaker'];
		this.buildings_arr[15] = Game.Objects['Fractal engine'];
		this.buildings_arr[16] = Game.Objects['Javascript console'];
		this.buildings_arr[17] = Game.Objects['Idleverse'];
		this.buildings_arr[18] = Game.Objects['Cortex baker'];
		this.buildings_arr[19] = Game.Objects['You'];

		/* Freeze the array so it is immutable */
		Object.freeze(this.buildings_arr); 
	}
});