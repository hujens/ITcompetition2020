pragma solidity ^0.5.0;

import "../client/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

//Import role contracts to use its modifiers
import "./HiltiRole.sol";

//Import HiltiToken contract to use its functions
import "./HiltiToken.sol";

contract HiltiContract is HiltiToken, HiltiRole {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                   //Contract Owner
    uint8 private constant TOKEN_AMOUNT = 1;         //Amount of Hilti Tokens a user receives per upload
    uint8 private constant MAXIMUM_DISCOUNT = 20;    //Maximum Discount

    struct UserData {
        address userAccount;
        address[] toolList;         //List of registered Tools for this users
        uint256 creditedAmount;     //HiltiToken Balance
        uint256 currentDiscount;    //HiltiDiscount
        string name;
    }

    struct ToolData {
        address toolAccount;
        uint256[] usageTime;        //List of usageTime
        uint256[] timeStamps;       //List of Timestamps
        bool isAssigned;            //To check whether tool is already assigned to a user
        address userAccount;        //Assigned User
        bool uploadRequest;         //To check whether data can be uploaded
        string name;
    }

    mapping(address => UserData) userData;  // Mapping to store user related information
    mapping(address => ToolData) toolData;  // Mapping to store tool related information

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event ToolAssigned(address accountUser, address accountTool);
    event DataUploaded(address accountUser, address accountTool, uint timeStamp, uint256 usageTime);
    event UploadRequest(address accountTool);
    event AccountCredited(address accountUser, uint256 amount);
    event DiscountCredited(address accountUser, uint256 amount);
    event HiltiTokenTransferred(address sender, address recipient, uint256 amount);
    event UserAdded(address accountUser);
    event ToolAdded(address accountTool);


    


    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    *      This needs to be a Hilti account!
    */
    constructor() public
    {
        //The account deploying the contract becomes the first Hilti account and the Owner of this contract
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/


    /**
    * @dev Modifier that checks if a user is registered
    */
    modifier checkUser(address _userAddress)
    {
        require(userData[_userAddress].userAccount != address(0), "User is not registered");
        _;
    }

    /**
    * @dev Modifier that checks if a tool is registered
    */
    modifier checkTool(address _toolAddress)
    {
        require(toolData[_toolAddress].toolAccount != address(0), "Tool is not registered");
        _;
    }

    /**
    * @dev Modifier that checks if a tool is already registered for a user
    */
    modifier requireFreeTool(address _toolAddress)
    {
        require(toolData[_toolAddress].isAssigned == false, "Tool is already assigned");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Add User - Only allowed by Hilti account
    */
    function addUser(address _account, string memory _name) public onlyHilti {
        //check that not a hilit/tool addresse
        //check that not already registered as user

        //create struct entry for this user
        userData[_account] = UserData({
            userAccount: _account,
            toolList: new address[](0),
            creditedAmount: 0,
            currentDiscount: 0,
            name: _name
        });
        emit UserAdded(_account);
    }

    /**
    * @dev Add Tool - Only allowed by Hilti account
    */
    function addTool(address _account, string memory _name) public onlyHilti {
        //check that not a hilti/user address
        //check that not already registered as tool

        //create struct entry for this tool
        toolData[_account] = ToolData({
            toolAccount: _account,
            usageTime: new uint256[](0),
            timeStamps: new uint256[](0),
            isAssigned: false,
            userAccount: address(0),
            uploadRequest: false,
            name: _name
        });
        emit ToolAdded(_account);
    }

    function get() public view returns (uint) {
        return TOKEN_AMOUNT;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    // function to add tool to user

    /**
    * @dev Register a tool for a certain user
    */
    function registerTool (
                                address _accountUser,
                                address _accountTool
                            )
                            public
                            onlyHilti
                            checkUser(_accountUser)
                            requireFreeTool(_accountTool)
    {
        toolData[_accountTool].isAssigned = true;
        toolData[_accountTool].userAccount = _accountUser;
        userData[_accountUser].toolList.push(_accountTool);
        emit ToolAssigned(_accountUser, _accountTool);
    }

    // TODO: function to remove tool from user

    // TODO: function to request upload from user --> emit Event
    // check if it is tool (directly fom tool? from Hilti account?)
    /**
    * @dev function to request upload from user --> emit Event
    */
    function requestUpload (
                                address _accountTool
                            )
                            public
                            onlyHilti
                            checkTool(_accountTool)
    {
        //check if data upload not requested yet
        require(toolData[_accountTool].uploadRequest == false, "This tool already requires data upload");
        //save data to struct
        toolData[_accountTool].uploadRequest = true;
        //emit event
        emit UploadRequest(_accountTool);
    }


    /**
    * @dev upload tool data (by user), get token for it (mint 1 token)
    */
    function uploadData (
                                address _accountTool,
                                uint256 _usageTime
                            )
                            public
                            checkUser(msg.sender)
                            checkTool(_accountTool)
    {
        //check if right tool
        require(toolData[_accountTool].userAccount == msg.sender, "This tool is not registered on your account");
        //check if data needs to be uploaded
        require(toolData[_accountTool].uploadRequest == true, "This tool does not request data upload");
        // set upload request back to false
        toolData[_accountTool].uploadRequest = false;
        //save data to struct
        toolData[_accountTool].usageTime.push(_usageTime);
        toolData[_accountTool].timeStamps.push(block.timestamp);
        //credit Hilti Token_Amount to balance
        userData[msg.sender].creditedAmount += (TOKEN_AMOUNT); //TODO: use safemath .add() somehow not working
        //emit event
        emit DataUploaded(msg.sender, _accountTool, block.timestamp, _usageTime);
    }

    /**
    * @dev claim credited tokens
    */
    function claimTokens ()
                            public
                            checkUser(msg.sender)
    {
        //check if credited amount is >0
        require(userData[msg.sender].creditedAmount != 0, "No amount was credited to your address.");
        uint256 elegibleAmount = userData[msg.sender].creditedAmount;
        //delete so he can not ask twice for crediting
        delete userData[msg.sender].creditedAmount;
        //mint Hilti token to the sender address
        _mint(msg.sender, elegibleAmount);
        //emit event
        emit AccountCredited(msg.sender, elegibleAmount);
    }

    /**
    * @dev transfer tokens to other address
    */
    function transferTokens (
                                address _recipient,
                                uint256 _amount
                            )
                            public
                            checkUser(msg.sender)
                            checkUser(_recipient)
    {
        //check if token balance is >= _amount
        uint256 tokenBalance = balanceOf(msg.sender);
        require(tokenBalance >= _amount, "TokenBalance not large enough");
        //transfer tokens
        transfer(_recipient, _amount);
        //emit event
        emit HiltiTokenTransferred(msg.sender, _recipient, _amount);
    }

    /**
    * @dev redeem discount by sending tokens (burning them)
    */
    function redeemDiscount (
                                uint256 _amount
                            )
                            public
                            checkUser(msg.sender)
    {
        //check if token balance is >= _amount
        uint256 tokenBalance = balanceOf(msg.sender);
        require(tokenBalance >= _amount, "TokenBalance not large enough");
        //check if MAXIMUM_DISCOUNT is not reached
        require(userData[msg.sender].currentDiscount <= MAXIMUM_DISCOUNT, "You are already at the maximum discount level");
        //burn tokens
        _burn(msg.sender, _amount);
        //calculate discount to add in %
        //TODO: do not hardcode this
        uint256 eligibleDiscount = _amount;
        //credit discount
        userData[msg.sender].currentDiscount += (eligibleDiscount); //TODO: use safemath operators
        //emit event
        emit DiscountCredited(msg.sender, eligibleDiscount);
    }

    /**
    * @dev Check user information
    *
    */
    function fetchUserData
                                (
                                    address _account
                                )
                                public
                                view
                                returns(
                                    address,
                                    address[] memory,
                                    uint256,
                                    uint256,
                                    string memory
                                )
    {
        return(
            userData[_account].userAccount,
            userData[_account].toolList,
            userData[_account].creditedAmount,
            userData[_account].currentDiscount,
            userData[_account].name
        );
    }

    /**
    * @dev Check tool information
    *
    */
    function fetchToolData
                                (
                                    address _account
                                )
                                public
                                view
                                returns(
                                    address,
                                    uint256[] memory,
                                    uint256[] memory,
                                    bool,
                                    address,
                                    bool,
                                    string memory
                                )
    {
        return(
            toolData[_account].toolAccount,
            toolData[_account].usageTime,
            toolData[_account].timeStamps,
            toolData[_account].isAssigned,
            toolData[_account].userAccount,
            toolData[_account].uploadRequest,
            toolData[_account].name
        );
    }

}