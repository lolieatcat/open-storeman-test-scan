// require node 14.0


const posRandomInEpoch18576 = '0x1ec51d5e475610740c871c6c19d9ae05f17102834cd46dc1fcc6597c4c1ab83f';
const crypto = require('crypto');
const Web3 = require('web3');
const fs = require('fs');


const stakeInList = require('./stakeInList.json');
const delegationList = require('./delegationList.json');
const crossChainList = require('./crossChainList.json');


function selectStakeIn() {
  const hash = crypto.createHash('sha256');
  hash.update(posRandomInEpoch18576);
  for (let i=0; i<stakeInList.length; i++) {
    hash.update(stakeInList[i].from);
    stakeInList[i].rn = Web3.utils.toBN(hash.copy().digest('hex')).modn(1000);
  }
  fs.writeFileSync('stakeInListRoll.json', JSON.stringify(stakeInList, null, 2));
}

// selectStakeIn();

function selectDelegation() {
  const hash = crypto.createHash('sha256');
  hash.update(posRandomInEpoch18576);
  for (let i=0; i<delegationList.length; i++) {
    hash.update(delegationList[i].from);
    delegationList[i].rn = Web3.utils.toBN(hash.copy().digest('hex')).modn(1000);
  }
  fs.writeFileSync('delegationListRoll.json', JSON.stringify(delegationList, null, 2));
}

// selectDelegation();

function selectCrossChain() {
  const hash = crypto.createHash('sha256');
  hash.update(posRandomInEpoch18576);
  for (let i=0; i<crossChainList.length; i++) {
    hash.update(crossChainList[i].from);
    crossChainList[i].rn = Web3.utils.toBN(hash.copy().digest('hex')).modn(1000);
  }
  fs.writeFileSync('crossChainListRoll.json', JSON.stringify(crossChainList, null, 2));
}

selectCrossChain();