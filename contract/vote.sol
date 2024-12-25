// SPDX-License-Identifier: MIT
// Contract Name: Voter
// Author: YimoEx
// Description: A protocol for a public drawing mechanism
// Copyright (c) 2024 YimoEx
pragma solidity ^0.8.26;

contract Voter {
    struct Result {
        address user;
        string message;
        uint[] exIncludes;
        uint[] numbers;
        uint timer;
        uint size;
        uint start;
        uint end;
    }
    uint public currentIndex = 0;
    bool public status = true;
    address public owner;
    Result[10] public results;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not admin");
        _;
    }

    function create(uint start, uint end, uint size, uint[] memory exIncludes, string memory message) public {
        require(exIncludes.length < size, "cannot genenrate more number!");
        require(size != 0, "none of size");
        uint range = end - start - exIncludes.length;
        require(range != 0, "none of size");
        require(range > size, "out of size");
        require(status, "the status is close");

        Result storage ptr = results[currentIndex];
        ptr.user = msg.sender;
        ptr.timer = block.timestamp;
        ptr.size = size;
        ptr.start = start;
        ptr.end = end;
        ptr.message = message;
        uint k = 0;
        for(uint i = 0;i < size;i++){
            uint n = getRandomNumber(start, end, k);
            while(checkStatus(n, ptr.numbers, exIncludes)){
                n = getRandomNumber(start, end, k);
                k++;
            }
            k++;
            ptr.numbers.push(n);
        }
        currentIndex++;
        if(currentIndex == 10) currentIndex = 0;
    }

    function get(uint id) public view returns (Result memory) {
        Result storage ptr = results[id];
        require(ptr.user != address(0), "the data is null");
        return results[id];
    }

    function get() public view returns (Result memory) {
        if(currentIndex == 0) return get(0);
        return get(currentIndex - 1);
    }

    function setStatus(bool newStatus) public onlyOwner {
        status = newStatus;
    }

    function checkStatus(uint number, uint[] memory numbers, uint[] memory ex) private pure returns (bool){
        for(uint i = 0;i < numbers.length;i++){
            if(numbers[i] == number) return true;
        }
        if(ex.length == 0) return false;
        for(uint i = 0;i < ex.length;i++){
            if(ex[i] == number) return true;
        }
        return false;
    }

    function getRandomNumber(uint start, uint end, uint skey) private view returns (uint256){
        uint256 number = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            blockhash(block.number - 1),
            skey
        )));
        return (number % (end - start + 1)) + start;
    }

}