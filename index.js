const cloneDeep = require('lodash/cloneDeep');
const find = require('lodash/find');
const Judge = require('./classes/Judge');
const Heat = require('./classes/Heat');

const HEAD_JUDGES = ['aviad', 'aviram', 'eliraz', 'idan', 'lee-he','ohad'];
let judges = [];
let heats = [];
function prepareJudgesAndHeats(){
	const judgesSource = require('./judges.json');
	judges = judgesSource.map(j => {
		const name = j.replace(/JR/gmi, '').toLowerCase();
		const isJunior = j.includes('Jr');
		const isHead = HEAD_JUDGES.includes(name);
		return new Judge({ name, isHead, isJunior })
	});

	const heatsSource = require('./heats.json');
	heats = heatsSource.map(({name, judgesCount, isJuniors})=>new Heat({name, judgesCount, isJuniors}))
}

function getRemainingHeatsCount(){
	return heats.filter(({isFull})=>!isFull).length;
}

prepareJudgesAndHeats();
console.log(`calculating for ${heats.length} heats with ${judges.length} judges`);


function getJudge(heat){
	const {isJuniors, floorJudge, headJudge} = heat;

	// Juniors restriction
	const updatedJudges = judges.filter(j=> isJuniors ? !j.isJunior : true);

return updatedJudges[0]
}

const DEBUG = false;
for(let i = 0; i < heats.length; i++){
	const heat = heats[i];
	console.log(i);
	console.log(heat.name);
	const selectedJudges = [];
	while(!heat.isFull && !DEBUG){
		const judge = getJudge(heat);

		heat.judges.push(judge.name);
		judge.heats.push(heat.details);
		selectedJudges.push(judge);
	}

	// Update is judged last
	judges.forEach(j=>j.judgedLast = false);
	selectedJudges.forEach(j=>{
		const localJ = find(judges, (cj)=>cj.name === j.name);
		localJ.judgedLast = true;
	})
}


console.log(JSON.stringify(judges, null, 4));
console.log(JSON.stringify(heats.filter(({name})=> name.includes('B14')), null, 4));
