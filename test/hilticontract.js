// This script is designed to test the solidity smart contract HiltiContract.js

// Truffle-assertions npm package for testing events
//const truffleAssert = require('truffle-assertions');

var HiltiContract = artifacts.require('HiltiContract');

contract('HiltiContract', function (accounts) {
    const hiltiID = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const tool1 = accounts[3];
    const tool2 = accounts[4];
    const tool3 = accounts[5];
    const data1 = 1000;
    const data2 = 1100;
    const data3 = 1200;
    //const emptyAddress = '0x00000000000000000000000000000000000000';

    console.log("ganache-cli accounts used here...");
    console.log("hiltiID: accounts[0] ", accounts[0]);
    console.log("user1: accounts[1] ", accounts[1]);
    console.log("user2: accounts[2] ", accounts[2]);
    console.log("user3: accounts[3] ", accounts[3]);
    console.log("tool1: accounts[4] ", accounts[4]);
    console.log("tool2: accounts[5] ", accounts[5]);
    console.log("tool3: accounts[6] ", accounts[6]);

    // 1st Test
    it("Testing smart contract function addUser(), addTool(), registerTool()", async () => {
        const hiltiContract = await HiltiContract.deployed();
        // Add users (also for following tests)
        await hiltiContract.addUser(user1, "Test1", { from: hiltiID });
        await hiltiContract.addUser(user2, "Test2", { from: hiltiID });
        // Add tools (also for following tests)
        await hiltiContract.addTool(tool1, "Test1", { from: hiltiID });
        await hiltiContract.addTool(tool2, "Test2", { from: hiltiID });
        // Register Tool
        await hiltiContract.registerTool(user1, tool1, { from: hiltiID });
        // Retrieve the data
        const resultUser1 = await hiltiContract.fetchUserData.call(user1);
        const resultUser2 = await hiltiContract.fetchUserData.call(user2);
        const resultTool1 = await hiltiContract.fetchToolData.call(tool1);
        const resultTool2 = await hiltiContract.fetchToolData.call(tool2);
        // Retrieve value of list
        let toolList = resultUser1[1];
        // Verify the result set
        assert.equal(resultUser1[0], user1, 'Error: Invalid user1');
        assert.equal(resultUser2[0], user2, 'Error: Invalid user2');
        assert.equal(resultTool1[0], tool1, 'Error: Invalid tool1');
        assert.equal(resultTool2[0], tool2, 'Error: Invalid tool2');
        assert.equal(toolList[0], tool1, 'Error: Invalid registration of tool1 to user1');
        assert.equal(resultTool1[3], true, 'Error: Tool not marked as assigned');
    })

    // 2nd Test
    it("Testing smart contract function requestUpload() and uploadData()", async () => {
        const hiltiContract = await HiltiContract.deployed();
        // request data upload of tool1
        await hiltiContract.requestUpload(tool1, { from: hiltiID });
        // user1 uploads data1 to tool1
        await hiltiContract.uploadData(tool1, data1, { from: user1 });
        // Retrieve the data
        const resultUser1 = await hiltiContract.fetchUserData.call(user1);
        const resultTool1 = await hiltiContract.fetchToolData.call(tool1);
        // Retrieve value of list
        let dataList = resultTool1[1];
        let timestampList = resultTool1[2];
        // Verify the result set 
        assert.equal(resultTool1[5], false, 'Error: Upload request not set to false after upload');
        assert.equal(Number(resultUser1[2]), 1, 'Error: credited amount not correct');
        assert.equal(Number(dataList[0]), data1, 'Error: Invalid data storage');
        console.log("data: ", Number(resultTool1[1]));
        console.log("timestamp: ", Number(resultTool1[2]));
    })

    // 3rd Test
    it("Testing smart contract function claimTokens() and transferTokens()", async () => {
        const hiltiContract = await HiltiContract.deployed();
        // claim tokens of user1
        await hiltiContract.claimTokens({ from: user1 });
        // Retrieve the data
        const resultUser1 = await hiltiContract.fetchUserData.call(user1);
        // Retrieve the balance of users
        let balance1 = await hiltiContract.balanceOf(user1, { from: user1 });
        // transfer token of user1 to user2
        await hiltiContract.transferTokens(user2, 1, { from: user1 });
        // Retrieve the balance of users
        let balance2 = await hiltiContract.balanceOf(user1, { from: user1 });
        let balance3 = await hiltiContract.balanceOf(user2, { from: user1 });
        // Verify the result set 
        assert.equal(Number(resultUser1[2]), 0, 'Error: credited amount not correct');
        assert.equal(balance1, 1, 'Error: token balance not correct after claim');
        assert.equal(balance2, 0, 'Error: token balance of user1 not correct after transfer');
        assert.equal(balance3, 1, 'Error: token balance of user2 not correct after transfer');
    })

    // 3rd Test
    it("Testing smart contract function redeemDiscount()", async () => {
        const hiltiContract = await HiltiContract.deployed();
        // redeem discount of user2
        await hiltiContract.redeemDiscount(1, { from: user2 });
        // Retrieve the data of user2
        const resultUser2 = await hiltiContract.fetchUserData.call(user2);
        // Retrieve the balance of user2
        let balance1 = await hiltiContract.balanceOf(user2, { from: user2 });
        // Verify the result set 
        assert.equal(Number(resultUser2[3]), 1, 'Error: discount amount not correct');
        assert.equal(balance1, 0, 'Error: token balance not correct after redeem');
    })

});