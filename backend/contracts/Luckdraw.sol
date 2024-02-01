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
    uint32 callbackGasLimit = 100000;

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

    // round
    struct Round {
        address winner;
        uint256 requestId;      // VRF request id
        uint256 randomNum;      // VRF random number
        uint256 luckyNum;       // winner index in address pool
        address[] addressPool;  // address pool
    }
    Round[] roundHistory;
    Round currentRound;
    
    // minimum deposit
    uint256 minDepositToken = 1 * 10**18;



    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function requestRandomWords()
        public 
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
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
        currentRound.randomNum = _randomWords[0];
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
            currentRound.requestId == 0,
            "Current round is currently in progress"
        );
        require(
            lukydrawToken.balanceOf(msg.sender) >= minDepositToken,
            "Balance not enough"
        );
        require(
            lukydrawToken.transferFrom(
                msg.sender,
                address(this),
                minDepositToken
            ),
            "Deposit failed"
        );
        currentRound.addressPool.push(msg.sender);
    }

    // Get address pool
    function getCurrentRound() public view returns (Round memory){
        return currentRound;
    }

    // Get pool balance
    function getPoolBalance() public view returns (uint256){
        return lukydrawToken.balanceOf(address(this)) / 10**18;
    }

    // Get round history
    function getRoundHistory() public view returns (Round[] memory) {
        return roundHistory;
    }

    // Send LukydrawToken
    function transferLukydrawToken(address _receiver) public onlyOwner {
        require(
            lukydrawToken.transfer(_receiver, lukydrawToken.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    // Request lucky draw random number
    function requestLuckyDrawRandomNumber() public {
        require(
            currentRound.addressPool.length != 0,
            "Current Round don't have participator"
        );
        require(
            currentRound.requestId == 0,
            "Already request random number to VRF"
        );

        currentRound.requestId = requestRandomWords();
    }

    // Make lucky draw transfer, transfer token to the winner and save round history
    function makeLuckyDrawTransfer() public {

        require(
            currentRound.randomNum != 0,
            "Random number is not ready"
        );

        // convert to index of address pool
        currentRound.luckyNum = currentRound.randomNum % currentRound.addressPool.length;
        currentRound.winner = currentRound.addressPool[currentRound.luckyNum];

        // save to round history 
        roundHistory.push(currentRound);
        
        // clear address pool
        address _winnerAddress = currentRound.winner;
        delete currentRound;

        // transfer to winner
        transferLukydrawToken(_winnerAddress);
    }

    // FOR TEST: set current round randomNum
    function setCurrentRoundRandomNum(uint256 _myRandomNum) public {
        require(
            currentRound.requestId == 0,
            "Already sent VRF request, can not set manually"
        );
        currentRound.randomNum = _myRandomNum;
    }


}
