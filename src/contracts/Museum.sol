// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract OBGGovernance is IERC20 {

    // This is where we set token details
    string public constant name = "OBGCoin";
    string public constant symbol = "OBG";
    uint8 public constant decimals = 18;

    // Shout out to the blockchain if something is Approved or Transfered
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);

    // Keep track of balances and allowance
    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalSupply_ = 10 * 10**18;

    // We create/declare this library below
    using SafeMath for uint256;

    // Contract Deployer gets total Supply
    constructor() public {
        balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address reciever, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[reciever] = balances[reciever].add(numTokens);
        emit Transfer(msg.sender, reciever, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}

    contract UONFTMuseum is ERC721 {

        IERC20 public token;

        constructor() ERC721("UOMuseum", "UONFT") public {
            token = new OBGGovernance();
        }

        //Values for math (part 2)
        uint256 public totalAuctionvalue;

        struct User {
            uint id;
            bool auctionBuyer;
            bool member;
            uint256 OBGCoins;
            uint256 auctionValue;
        }

        //Events for Data Structs
        event Donate(uint256 amount);
        event userCreated(uint id, bool auctionBuyer, bool member, uint256 OBGCoins, uint256 auctionValue);

        //Events for ERC721
        event auctionItembought(uint256 indexed id);

        //mappings for Data Structs
        uint256 numberOfusers;
        mapping(uint => address) public idToaddress;
        mapping(address => User) public users;

        //mapping for ERC721
        mapping(uint256 => string) private _tokenURIs;

        //creates user data, definetly will delete this
        function createUser() public {
            numberOfusers++;
            users[msg.sender] = User(numberOfusers - 1, false, true, 0, 0);
            idToaddress[numberOfusers - 1] = msg.sender;
            emit userCreated(numberOfusers - 1, false, true, 0, 0);
        }

        //sign-in a member (part 2)
        function memberSignup(address memberAddress) public {
            numberOfusers++;
            uint256 obgtokens = 100000000000000000;
            users[memberAddress] = User(numberOfusers - 1, false, true, obgtokens, 0);
            idToaddress[numberOfusers -1] = memberAddress;
            emit userCreated(numberOfusers - 1, true, false, obgtokens, 0);
        }

        //auctioneer buys existing NFT (part 2)
        function auctioneerTransfer(address _from, address _to, uint256 _tokenId) public payable {
            totalAuctionvalue += msg.value;
            if (users[_to].member == true) {
                safeTransferFrom(_from, _to, _tokenId);
                users[_to].auctionBuyer = true;
                users[_to].auctionValue = msg.value;
            } else {
                safeTransferFrom(_from, _to, _tokenId);
                numberOfusers++;
                users[_to] = User(numberOfusers - 1, true, false, 0, msg.value);
                emit userCreated(numberOfusers - 1, true, false, 0, msg.value);
            }
        }

        //auctioneer mints new NFT (part 2)
        function auctioneerMint(address _to, string memory _tokenURI) public payable {
            totalAuctionvalue += msg.value;
            if (users[_to].member == true) {
                mintAuctionnft(_to, _tokenURI);
                users[_to].auctionBuyer = true;
                users[_to].auctionValue = msg.value;
            } else {
                mintAuctionnft(_to, _tokenURI);
                numberOfusers++;
                users[_to] = User(numberOfusers - 1, true, false, 0, msg.value);
                emit userCreated(numberOfusers - 1, true, false, 0, msg.value);
            }
        }

        //Governance distribution (most likely will delete this)
        function giveTokens() payable public {
            uint256 tokens = 1000000000000000000;
            uint256 obgCoinbalance = token.balanceOf(address(this));
            require(tokens > 0, "Not enough Tokens");
            require(tokens <= obgCoinbalance, "Too many tokens");
            token.transfer(msg.sender, tokens);
            User storage _user = users[msg.sender];
            _user.OBGCoins = _user.OBGCoins + tokens;
            emit Donate(tokens);
        }

        //NFT functions
        function totalMint() public view returns(uint256) {
            return totalSupply();
        }

        //Mint an NFT
        function mintAuctionnft(address _to, string memory _tokenURI) public {
            uint _tokenId = totalSupply().add(1);
            _mint(_to, _tokenId);
            _setTokenURI(_tokenId, _tokenURI);
            giveTokens();
            emit auctionItembought(_tokenId);
        }
    }
