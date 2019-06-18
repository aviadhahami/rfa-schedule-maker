const Judge = require('./classes/judge');

const HEAD_JUDGES = ['aviad', 'aviram', 'eliraz', 'idan', 'lee-he','ohad'];

const judgesSource = require('./judges.json');
const judges = judgesSource.map(j=>{
	const name = j.replace(/JR/gmi, '').toLowerCase();
	const isJunior = j.includes('Jr');
	const isHead = HEAD_JUDGES.includes(name);
	return new Judge({name, isHead ,isJunior})
});
console.log(judges.filter(({isHead})=>isHead).length);
