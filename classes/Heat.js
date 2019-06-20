module.exports = class Heat{
	constructor({name, time = 0, floorJudgesCount = 2, allowBadJudge = false, judgesCount, isJuniors = false, langs=[]}){
		this.isJuniors = isJuniors;
		this.name = name;
		this.time = time;
		this.judgesCount = judgesCount;
		this.langs = langs;
		this.judges = [];
		this.headJudge = undefined;
		this.floorJudge = [];
		this.floorJudgeCount = floorJudgeCount;
	}


	get details(){
		return {name: this.name, time: this.time}
	}

	get isFull(){
		return (this.judgesCount === this.judges.length) && this.headJudge && this.floorJudge;
	}
};
