// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "./LukydrawERC20TokenOZ.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract Luckdraw is
    VRFV2WrapperConsumerBase,
    ConfirmedOwner
{
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 2400000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 1;

    // Address LINK - hardcoded for Sepolia
    address linkAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;

    // address WRAPPER - hardcoded for Sepolia
    address wrapperAddress = 0xab18414CD93297B0d12ac29E63Ca20f515b3DB46;
    


    // Lucky draw variable

    // ERC20 token
    address lukydrawTokenAddress = 0x50c571bF0FC736a1a520E2F058072a2b5830C929;
    MyERC20TokenOZ lukydrawToken = MyERC20TokenOZ(lukydrawTokenAddress);

    // address pool
    address[] addressPool;

    // round history
    struct RoundHistory {
        address winner;
        uint256 randomNum;
        address[] addressPool;
    }
    RoundHistory[] roundHistory;
    
    // minimum deposit
    uint256 minDepositToken = 1 * 10**18;



    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        doLuckyDrawWithRandomNum(_randomWords[0]);
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    // Get Link tokens balance
    function getLinkBalance() public view returns (uint256) {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        return link.balanceOf(address(this)) / 10**18;
    }



    // Lucky draw logic

    // Set mininum deposit token amount
    function setMinDepositToken(uint256 _minDepositToken) external onlyOwner{
        minDepositToken = _minDepositToken * 10**18;
    }

    // Get current mininum deposit token amount
        function getMinDepositToken() external view returns (uint256){
        return minDepositToken / 10**18;
    }

    // Add address to address pool
    function joinPool() public {
        require(
            lukydrawToken.balanceOf(msg.sender) >= minDepositToken,
            "Balance not enough");
        require(
            lukydrawToken.transferFrom(
                msg.sender,
                address(this),
                minDepositToken
            ),
            "Deposit failed"
        );
        addressPool.push(msg.sender);
    }

    // Get address pool
    function getAddressPool() public view returns (address[] memory){
        return addressPool;
    }

    // Get pool balance
    function getPoolBalance() public view returns (uint256){
        return lukydrawToken.balanceOf(address(this)) / 10**18;
    }

    // Get round history
    function getRoundHistory() public view returns (RoundHistory[] memory) {
        return roundHistory;
    }

    // Send LukydrawToken
    function transferLukydrawToken(address _receiver) public onlyOwner {
        require(
            lukydrawToken.transfer(_receiver, lukydrawToken.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    // Do lucky draw, transfer token to the winner with random num given and save round history
    function doLuckyDrawWithRandomNum(uint256 _randomNum) public {
        // convert to index of address pool
        uint256 _luckyNum = _randomNum % addressPool.length;
        address _winnerAddress = addressPool[_luckyNum];

        // save to round history 
        roundHistory.push(RoundHistory({
            winner: _winnerAddress,
            randomNum: _luckyNum,
            addressPool: addressPool
        }));
        
        // clear address pool
        delete addressPool;

        // transfer to winner
        transferLukydrawToken(_winnerAddress);
    }


}