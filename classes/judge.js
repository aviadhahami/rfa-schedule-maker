module.exports = class Judge{
  constructor({ name, isHead = false, availableSince = 0, isJunior = false, langs=[] }){
    this.name = name;
    this.availableSince = availableSince;
    this.isJunior = isJunior;
    this.langs = langs;
    this.isHead = isHead;
    this.judgedLast = false;
    this.events = [];
  }


  get judgedTotal(){
    return this.events.length;
  }
}
