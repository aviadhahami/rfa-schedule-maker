module.exports = class Judge{
	constructor({ name, isBad = false, langs = [], isHead = false, availableSince = 0, isJunior = false, langs=[] }){
		this.name = name;
		this.availableSince = availableSince;
		this.isJunior = isJunior;
		this.langs = langs;
		this.isHead = isHead;
		this.judgedLast = false;
		this.heats = [];
		this.isBad = isBad;
		this.totalHeats = 0;
		this.langs = langs;
	}


	get judgedTotal(){
		return this.heats.length;
	}
}
