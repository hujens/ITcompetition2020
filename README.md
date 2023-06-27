# HILTI IT Competition 2020

This is a contribution for the Hilti IT-competition 2020. See also the [Youtube Video](https://youtu.be/3d117sKsYOw) for more information.
> * Group Name: ICentive
> * Participants names: Bucher David, Hunhevicz Jens
> * Project Title: A Crypto-Economic Incentive System for Tools Data Management

***Important***: The introduced concepts are exemplary and should showcase the potential of the solution. The system would need to be reviewed and tested carefully. We do not guarantee any functionality. Finally, the code is not secure. Do not use for production!

## Category
Our solution targets the following categories:

* **No connectivity at all time (Topic 2)**:
Incentivizing a trusted data upload without constant internet connection. The user uploads data when there is connection available and earns HILTI tokens instead.
* **Trust and privacy concerns (Topic 4)**: Trust - Data can be traced and validated on the ledger. Privacy - devices and users can access their service via blockchain authentication if wanted.

## Solution

Our solution offers the opportunity to combine new business models with challenges regarding IoT device data management by using crypto-economic incentive design with the HILTI-token.

For the prototype, the [Ethereum](https://ethereum.org/) blockchain is used to:
* manage devices and users using Ethereum addresses.
* store and trace relevant IoT data by device in an unchangeable and transparent manner.
* offering an automated incentive system through SmartContracts and the HILTI-token (ERC20).

### How it works

The goal was to create a win-win situation for HILTI and the tool users by creating a blockchain based incentive system. HILTI needs to upload relevant data of the tools from time to time (limited storage capability on edge devices), and construction sites usually have limited internet coverage. Therefore, automatic uploads are hardly possible. On the other hand, the tool users could move the tools to locations with internet connectivity (e.g. at night during storage, during a break, ...) and upload the data. Having said that, currently the users have no incentive to do this. 

We propose a solution based on blockchain, using a simple crypto-economic incentive system with a HILTI token. The user would receive this token when they perform the uploads. They can then use it for future HILTI purchases or discounts on the fleet leasing. HILTI on the other hand profits from the data availability of their devices to: 
* predict and plan maintainance intervals and replacements (when tools are leased through the fleet model).
* improve their tools by identifying problems and wear and tear.
* analyze usage patterns of tools by region/construction site to optimize sales and the supply chain.
* proofing the high quality of tools to everyone that is interested in that data (public data in blockchain).

In addition, the system acts as a customer loyalty bounding program.

The system is opt-in, meaning the users can decide to not perform data uploads, but also to not profit from the discount opportunities. This gives them additional privacy options. The data is anonymous in the sense that only the addresses are visible. Nevertheless, the user also profits from the data uploads by:
* proofing condition of the device for secondary market sales (trusted source).
* proofing coorect tool usage for warranty reasons.
* maybe: locking and unlocking devices over the blockchain (making theft less attractive). However, this could be an issue if there is no connection at usage time.

### Why blockchain?

Blockchain is used for the following reasons:
* data is transparent and immutable. 
* the whole process is automated through smart contracts.
* the rules are unchangeable and transparently encoded in the smart contracts. HILTI tokens can only be earned in predefined ways. The tokens can be exchanged peer-to-peer.
* data on the blockchain enables the crypto-economic incentive design

If this level of transparancy is not wanted, a private blockchain might be considered.

## Prerequisites

You need a browser with [Metamask](https://metamask.io/) installed. Optional but recommended for Option 2 of operating the application (see below): [Ganache Local Blockchain](http://truffleframework.com/ganache/).

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests for the smart conttracts (also using Truffle), and the dApp scaffolding (using React).

Clone this repository, access it in the terminal, and then move into the `client` folder and run:

```
npm install
```

## Application

This repository consists of two parts. The React front-end application is located in the `client` folder. Additional information on its functionality can be found in the `README.md` in that folder. 

The blockchain smart contracts are stored in the `contracts` folder. Test cases in the `test` folder. The necessary files to migrate the contracts onto the preferred network are in the `migration` folder. Finally, the `truffle-config.js` (Windows) and `truffle.js` (Mac) are needed to specify network properties.

For deploying the smart contracts on a test network, you have two options:

1. Use the local truffle environment.
2. Use Ganache.

### Option 1

Open the terminal and move into this repo:

```
truffle develop
compile
migrate
```
Move to the `client` folder to start the React app on `http://localhost:3000/`:

```
npm run start
```
Unlock Metamask, point it to the right port (usually port: 8545) and you are ready to go.

### Option 2

Start [Ganache UI](http://truffleframework.com/ganache/). Check the port on which the network is running (usually port: 7545). If not 7545, you need to change it in the file `truffle-config.js` (Windows) or `truffle.js` (Mac).

Open the terminal and move into this repo.

```
truffle compile
truffle migrate
```
Move to the `client` folder to start the React app on `http://localhost:3000/`:

```
npm run start
```
Unlock Metamask, point it to the right port, and you are ready to go.

## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [Metamask](https://metamask.io/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [React](https://reactjs.org/)
* [Material-UI](https://material-ui.com/)
