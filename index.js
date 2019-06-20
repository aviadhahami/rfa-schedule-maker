const fs = require('fs');
const cloneDeep = require('lodash/cloneDeep');
const sortBy = require('lodash/sortBy');
const find = require('lodash/find');
const flatten = require('lodash/flatten');
const Judge = require('./classes/Judge');
const Heat = require('./classes/Heat');

const HEAD_JUDGES = ['aviad','MichaelA', 'eliraz', 'idan', 'lee-he'];
const BAD_JUDGES = ['roni','shaked','shay','IdoJr'];
const LANGS = [{name:'sergey', langs:['R']}];

let judges = [];
let heats = [];
function prepareJudgesAndHeats(){
	const judgesSource = require('./judges.json');
	judges = judgesSource.map(j => {
		const name = j.replace(/JR/gmi, '').toLowerCase();
		const isJunior = j.includes('Jr');
		const isHead = HEAD_JUDGES.includes(name);
		const isBad = BAD_JUDGES.includes(name);
		const langs = flatten(LANGS.filter(lang=>lang.name === j).map((lang)=>lang.langs));
		return new Judge({ name, isHead, isJunior, isBad, langs })
	});

	const heatsSource = require('./heats.json');
	heats = heatsSource.map(({name, judgesCount, isJuniors})=>new Heat({name, judgesCount, isJuniors}))
}
prepareJudgesAndHeats();
console.log(`calculating for ${heats.length} heats with ${judges.length} judges`);
const isJudgedLast = ({judgedLast})=>!judgedLast;
const isHead = ({isHead})=> isHead;
const removeJuniorsFilterGenerator = (isJuniors)=> ({isJunior})=> isJuniors ? !isJunior : true;
const getJuniorsFilterGenerator = (isJuniors)=> ({isJunior})=> isJuniors ? isJunior : false;
const getBadJudgesFilterGenerator = (allowBadJudges)=> ({isBad})=> allowBadJudges ? isBad : false;
const removeBadJudgesFilterGenerator = (allowBadJudges)=> ({isBad})=> allowBadJudges ? !isBad : true;

const getRandom = arr => arr[Math.floor(Math.random() * (arr.length))];

const getMinimums = arr => {
	const sorted = sortBy(arr, 'totalHeats');
	const min = (sorted[0] || {}).totalHeats || 0;
	// console.log(min);
	return arr.filter(k=>k.totalHeats === min);
};

function getJudge(heat){
	const {isJuniors, floorJudges, headJudge, allowBadJudges} = heat;
	const badJudgesGetter = getBadJudgesFilterGenerator(allowBadJudges);
	const removeJuniors = removeJuniorsFilterGenerator(isJuniors);
	const badJudgesRemover = removeBadJudgesFilterGenerator(allowBadJudges);

	if(heat.allowBadJudges){
		return getRandom(
			getMinimums(
				badJudgesGetter(judges)
			)
		)
	}





	if(!headJudge || floorJudges.length < 2){
		return getRandom(
			getMinimums(judges
				.filter(isHead)
				.filter(isJudgedLast))) || getRandom(judges.filter(isHead));
	}

	// Restrictions, assuming head judge chosen
	const tempList =
		getRandom(
			getMinimums(
				judges
				// .filter(j=>!isHead(j))
					.filter(isJudgedLast) // Last judge
					.filter(removeJuniors)
			)
		);

	return tempList || getRandom(judges); // Juniors
}

const DEBUG = false;

for(let i = 0; i < heats.length; i++){
	const heat = heats[i];
	let selectedJudges = [];
	while(!heat.isFull && !DEBUG){
		const judge = getJudge(heat);

		// console.log(heat.judges);
		if(heat.judges.map(j=>j.toLowerCase()).includes(judge.name.toLowerCase())){
			// console.log('dup');
			continue;
		}

		judge.judgedLast = true;
		if(judge.isHead){
			if(!heat.headJudge){
				heat.headJudge = judge.name;
			}else if(heat.floorJudges.length < 2){
				heat.floorJudges.push(judge.name);
				continue;
			}
		}

		heat.judges.push(judge.name);
		judge.heats.push(heat.details);
		judge.totalHeats++;
		selectedJudges.push(judge);
		judges = sortBy(judges, 'totalHeats', 'desc');
	}

	// Update is judged last
	judges.forEach(j=>j.judgedLast = false);
	selectedJudges.forEach(j=>{
		const localJ = find(judges, (cj)=>cj.name === j.name);
		localJ.judgedLast = true;
		// console.log('updated',localJ.name);
	});

	selectedJudges = [];
}


// console.log(JSON.stringify(judges, null, 4));
// console.log();
const cleanHeats = heats.map(({floorJudges, headJudge, judges, name})=>({floorJudges, headJudge, judges, name}));
const cleanJudges = judges.map(({name, heats, totalHeats})=>({name, heats, totalHeats}));
fs.writeFileSync('./dist/heats.results.json',JSON.stringify(cleanHeats, null, 4));
fs.writeFileSync('./dist/judges.results.json',JSON.stringify(cleanJudges, null, 4));
