/**
 * Copyright (c) 2024 YimoEx
 * Licensed under the MIT License
 */

class Provider {

    constructor(){
        if(typeof window.ethereum === 'undefined') return null;
        this.eth = window.ethereum;
        this.web3 = new Web3(window.ethereum);
        this.voter = '0xD805F997b56784f40B98C6fD3D41dDA15A0F6Ba2';
        this.voter_abi_json = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"},{"internalType":"uint256","name":"size","type":"uint256"},{"internalType":"uint256[]","name":"exIncludes","type":"uint256[]"},{"internalType":"string","name":"message","type":"string"}],"name":"create","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"get","outputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256[]","name":"exIncludes","type":"uint256[]"},{"internalType":"uint256[]","name":"numbers","type":"uint256[]"},{"internalType":"uint256","name":"timer","type":"uint256"},{"internalType":"uint256","name":"size","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"}],"internalType":"struct Voter.Result","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"get","outputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256[]","name":"exIncludes","type":"uint256[]"},{"internalType":"uint256[]","name":"numbers","type":"uint256[]"},{"internalType":"uint256","name":"timer","type":"uint256"},{"internalType":"uint256","name":"size","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"}],"internalType":"struct Voter.Result","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"results","outputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"timer","type":"uint256"},{"internalType":"uint256","name":"size","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"newStatus","type":"bool"}],"name":"setStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"status","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]';
        this.voter_abi = JSON.parse(this.voter_abi_json);
        this.voter_contract = new this.web3.eth.Contract(this.voter_abi, this.voter);
    }

    walletConnect(success, err){
        this.eth.request({ method: 'eth_requestAccounts' })
        .then(accounts => accounts[0])
        .then((account) => {
            return this.account = account;
        })
        .then(success)
        .catch(err);
    }

    voterIndex(success, err){
        this.voter_contract.methods.currentIndex()
        .call()
        .then(success)
        .catch(err);
    }

    async gasPrice(){
        return await this.web3.eth.getGasPrice();
    }

    async voterReadLast(success, err){
        return this.voter_contract.methods.get().call()
        .then(success)
        .catch(err);
    }

    async voterCreate(start, end, size, message, ex = []){
        if(start > end) return false;
        if(end - start < size) return false;
        return await this.voter_contract.methods.create(start, end, size, ex, message)
        .send({from: this.account});
    }

    async voterEstimate(start, end, size, message, ex = []){
        if(start > end) return false;
        if(end - start < size) return false;
        return await this.voter_contract.methods.create(start, end, size, ex, message)
        .estimateGas({from: this.account});
    }

}
