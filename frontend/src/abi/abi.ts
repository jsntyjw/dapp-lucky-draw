//TODO integrate with web3.js

// export dummy methods for getLotteryRounds(), createLotteryRound(), joinLotteryRound(), drawLotteryRound()

// abi array
import luckyDrawABI from "./abi.json";

import Web3 from "web3";

const contractAddress = "0x50c571bF0FC736a1a520E2F058072a2b5830C929";

export const abi = {
  getLotteryRounds() {
    return [
      {
        round_no: "1",
        created_time: "2018-01-01 00:00:00",
        draw_time: "2018-01-02 00:00:00",
        is_resolved: true,
        winner: 5,
        base_prize: 10,
        participants: [
          {
            wallet_addr: "0x0000000",
            joined_time: "2018-01-01 00:00:00",
            seq_no: 5,
          },
        ],
      },
    ];
  },

  createLotteryRound(base_prize: number, created_time: string, addr: string) {
    console.log(
      `base_prize: ${base_prize}, created_time: ${created_time}, addr: ${addr}`
    );

    return {
      status: "success",
      message: "Lottery round created successfully",
    };
  },

  joinLotteryRound(wallet_addr: string, joined_time: string) {
    console.log(`wallet_addr: ${wallet_addr}, joined_time: ${joined_time}`);

    return {
      status: "success",
      message: "Joined lottery round successfully",
    };
  },

  drawLotteryRound(draw_time: string, addr: string) {
    console.log(`draw_time: ${draw_time}, addr: ${addr}`);

    return {
      status: "success",
      message: "Lottery round drawn successfully",
    };
  },

  faucet(web3Instace: Web3, addr: string) {
    // Create contract instance
    const contract = new web3Instace.eth.Contract(
      luckyDrawABI,
      contractAddress
    );

    console.log(`client wallet: ${addr}`);

    // Call the faucet function
    contract.methods
      .faucet()
      .send({
        from: addr,
      })
      .then(function (receipt) {
        console.log(receipt);
      });

    return {
      status: "success",
      message: "Faucet successfully",
    };
  },
};
