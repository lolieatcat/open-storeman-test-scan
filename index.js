const smgAbi = require('./abi.StoremanLib.json');
const crossAbi = require('./abi.RapidityLib.json');
const incentiveAbi = require('./abi.IncentiveLib.json');
const Web3 = require('web3');
const fs = require('fs');

const rpc = 'http://192.168.1.2:8545';

const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const fromBlock = 9000000;

const toBlock = 10342800;

async function main() {
  // await getAllDelegation();
  // await getAllCrossChain();
  // await getAllStakeIn();
  // await getAllStakeOut();
  // await getAllWorkList();
  // await getDailyWork();
}

main();

async function getAllDelegation() {
  const smgScAddr = '0xaa5a0f7f99fa841f410aafd97e8c435c75c22821';
  let sc = new web3.eth.Contract(smgAbi, smgScAddr);

  let ret = await sc.getPastEvents('delegateInEvent', { fromBlock, toBlock });
  let result = [];
  for (let i=0; i<ret.length; i++) {
    const find = result.filter(v=>v.from === ret[i].returnValues.from);
    if (find && find.length > 0) {
      continue;
    }
    result.push({
      from: ret[i].returnValues.from,
      value: ret[i].returnValues.value
    });
  }

  fs.writeFileSync('./delegationList.json', JSON.stringify(result, null, 2));
  console.log('done, total', result.length);
}

async function getAllCrossChain() {
  const smgScAddr = '0x62de27e16f6f31d9aa5b02f4599fc6e21b339e79';
  let sc = new web3.eth.Contract(crossAbi, smgScAddr);

  let ret = await sc.getPastEvents('UserFastMintLogger', { fromBlock, toBlock });
  let result = [];
  for (let i=0; i<ret.length; i++) {
    let tx = await web3.eth.getTransaction(ret[i].transactionHash);

    const find = result.filter(v=>v.from === tx.from);
    if (find && find.length > 0) {
      continue;
    }

    result.push({
      from: tx.from,
      value: ret[i].returnValues.value,
      type:'wan->eth'
    });
  }

  ret = await sc.getPastEvents('SmgFastMintLogger', { fromBlock, toBlock });
  for (let i=0; i<ret.length; i++) {
    const find = result.filter(v=>v.from === ret[i].returnValues.userAccount);
    if (find && find.length > 0) {
      continue;
    }
    result.push({
      from: ret[i].returnValues.userAccount,
      value: ret[i].returnValues.value,
      type:'eth->wan'
    });
  }

  fs.writeFileSync('./crossChainList.json', JSON.stringify(result, null, 2));
  console.log('done, total', result.length);
}

async function getAllStakeIn() {
  const smgScAddr = '0xaa5a0f7f99fa841f410aafd97e8c435c75c22821';
  let sc = new web3.eth.Contract(smgAbi, smgScAddr);

  let ret = await sc.getPastEvents('stakeInEvent', { fromBlock, toBlock });
  let result = [];
  for (let i=0; i<ret.length; i++) {
    const find = result.filter(v=>v.from === ret[i].returnValues.from);
    if (find && find.length > 0) {
      continue;
    }
    result.push({
      from: ret[i].returnValues.from,
      value: ret[i].returnValues.value
    });
  }

  fs.writeFileSync('./stakeInList.json', JSON.stringify(result, null, 2));
  console.log('done, total', result.length);
}

async function getAllStakeOut() {
  const smgScAddr = '0xaa5a0f7f99fa841f410aafd97e8c435c75c22821';
  let sc = new web3.eth.Contract(smgAbi, smgScAddr);

  let ret = await sc.getPastEvents('stakeOutEvent', { fromBlock, toBlock });
  let result = [];
  for (let i=0; i<ret.length; i++) {
    const find = result.filter(v=>v.from === ret[i].returnValues.from);
    if (find && find.length > 0) {
      continue;
    }
    result.push({
      from: ret[i].returnValues.from,
      // value: ret[i].returnValues.value
    });
  }

  fs.writeFileSync('./stakeOutList.json', JSON.stringify(result, null, 2));
  console.log('done, total', result.length);
}

async function getAllWorkList() {
  const smgScAddr = '0xaa5a0f7f99fa841f410aafd97e8c435c75c22821';
  let sc = new web3.eth.Contract(smgAbi, smgScAddr);

  let ret = await sc.getPastEvents('stakeInEvent', { fromBlock, toBlock });
  let result = [];
  for (let i=0; i<ret.length; i++) {
    // const find = result.filter(v=>v.from === ret[i].returnValues.from);
    // if (find && find.length > 0) {
    //   continue;
    // }
    result.push({
      from: ret[i].returnValues.from,
      value: ret[i].returnValues.value,
      wkAddr: ret[i].returnValues.wkAddr,
    });
  }

  sc = new web3.eth.Contract(incentiveAbi, smgScAddr);
  ret = await sc.getPastEvents('incentiveEvent', { fromBlock, toBlock });
  let result2 = [];
  for (let i=0; i<ret.length; i++) {
    const find = result2.filter(v=>v.wkAddr === ret[i].returnValues.wkAddr);
    if (find && find.length > 0) {
      continue;
    }
    result2.push({
      wkAddr: ret[i].returnValues.wkAddr,
    });
  }

  let final = [];
  // console.log(result.length, result2.length);
  // console.log('result2', result2);
  // console.log('result1', result);

  let old = [];

  result2.forEach(w => {
    const a = result.find(v=>v.wkAddr === w.wkAddr);
    if (a) {
      final.push({
        address: a.from,
        wkAddr: a.wkAddr
      });
    } else {
      old.push({
        wkAddr: w.wkAddr
      });
    }
  });

  fs.writeFileSync('./workList.json', JSON.stringify(final, null, 2));
  console.log('done, total', final.length);
  console.log('old', old.length);
}


async function getDailyWork() {
  const smgScAddr = '0xaa5a0f7f99fa841f410aafd97e8c435c75c22821';
  let sc = new web3.eth.Contract(smgAbi, smgScAddr);

  sc = new web3.eth.Contract(incentiveAbi, smgScAddr);
  ret = await sc.getPastEvents('incentiveEvent', { fromBlock, toBlock });
  let result2 = [];
  for (let i=0; i<ret.length; i++) {
    result2.push({
      wkAddr: ret[i].returnValues.wkAddr,
    });
  }

  fs.writeFileSync('./DailyWorkList.json', JSON.stringify(result2, null, 2));
  console.log('done, total', result2.length);
}

