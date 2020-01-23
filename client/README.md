# HILTI IT Competition 2020 - Client

This is a the documentation for the prototype developed fot the Hilti IT-competition 2020.
The client was developed based on the React Framwork. React is a JavaScript library for creating user interfaces. It was released by Facebook under a BSD license in 2013 and has been making waves ever since, having a lasting impact on the entire JavaScript front-end landscape. With React, virtual DOMs and excellent rendering performance are achieved. In addition, it offers a modular component architecture that serves as a basis for modular and easily comprehensible frontend code.

***Important***: The explained functions and structure of the prototype are shown in principle. For detailed questions please contact the developers!

## Principle Structure
The source code consist of 4 specific folders, which are: 
> * assets: Background images and stylings
> * components: Functions for routing an its authentication
> * containers: Contains most of the functions and frontend data of the prototype
> * contracts: Migrated SmartContracts and the HILTI-token (ERC20) for Blockchain operations

Next to it are the start function of the program and imports which are necessary for the block chain connection.

## Containers -> Main Folder

Following the most important functions and and specifications to be observed are described

### Login.js

When landing on the login page, the user must first use a specific email address. This would be:

* **Email: test.test@hilti.com**
* **Password: test.test@hilti.com**

This generates, as seen in Line 100, all users, tools with specific addresses on the blockchain. This is done using the contract function [addUser].

The following users and tools are generated and assigned to each other

* **Bob     ->      Hilti Saebelsaegen - WSR 22-A**
* **Tracy   ->      Hilti DD 30-W light diamond drilling machine**
* **Susi    ->      No Tool registered**
* **Paul    ->      No Tool registered**
* **Greg    ->      No Tool registered**
* **Glenn   ->      No Tool registered**


If users and tools are already registered on the block chain, the following login can be used.
The corresponding code can be seen in line 184 and line 206

* **Email: bob.foreman@hilti.com**
* **Password: bob**

* **Email: tracy.projectlead@hilti.com**
* **Password: tracy**

If the login is successful, the user is redirected to the dashboard after his data has been retrieved from the block chain. The user's data structure can be seen in the contract [conracts/HiltiContract.sol]. Retrieved parameters are:

* **creditedAmount**
* **currentDiscount**

### Dashboard.js

The following picture shows the dashboard for the viewer. Underlying script is the dashboard.js

Dashboard Overview: ![alt test](screenshots/Screenshot.jpg)

On the right side there are three different displays. These are: 

* **Current account balance Hilit Token**
* **Current Discount**
* **Credited Tokens**

In the tab Hilti Token the user can perform different actions by two buttons. First, he can get a discount on his next purchase at Hilti by redeeming his token. Secondly he can send a certain number of tokens to another user. 

Below this, the value of the discount he currently gets is shown. The lowest tab lists the tokens to be claimed. Every time he performs a data upload he gets a token which is called a credited token. 

The middle of the dashboard shows the history of his data. In the prototype random values between 0 and 100 are selected. This could then be replaced in a testing environment with different sensor data from the device, such as usage time, acceleration and powerconsumption. 

At the bottom of the dashboard a table of all transactions to or from the blockchain is listed. These are:

* **Data upload**
* **Claiming**
* **Transfer**

This guarantees consistency and re-examination by the user and enables him to develop a basic understanding of the methodology.

The functions and the graphical interface can be found in the *dashboard* folder, where the data chart and title is defined in a separate folder called *subContainers*. 

Do not hesitate to explore this sourcecode and we are looking forward to your feedback. 