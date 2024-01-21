### Get List of Lottery Rounds

Returns all lottery rounds on chain.
```
getLotteryRounds()

returns
[
  {
    "round_no": "1",
    "created_time": "2018-01-01 00:00:00",
    "draw_time": "2018-01-02 00:00:00",
    "is_resolved": true,
    "winner": 5,
    "base_prize":10,
    "participants": [
      {
        "wallet_addr": "0x0000000",
        "joined_time": "2018-01-01 00:00:00",
        "seq_no": 5
      }
    ]
  }
]
```
### Create Lottery Round

Creates a new lottery round on chain. Only admin can call this function.
Only one lottery may be active at a time.

```
createLotteryRound(uint base_prize, string created_time?, string addr)

Params:
base_prize: base prize of the lottery round
created_time: created time of the lottery round
addr: wallet address of the admin

returns
{
    "status": "success",
    "message": "Lottery round created successfully"
}

if error
{
    "status": "error",
    "message": "Already having an active lottery round"
}

```

### Join Lottery Round

Joins the active lottery round on chain.
Participants must have sufficient balance to join the lottery round. Balance is only deducted if successfully joined the lottery round.

```
joinLotteryRound(string wallet_addr, string joined_time)

Params:
wallet_addr: wallet address of the participant
joined_time: joined time of the participant

returns
{
    "status": "success",
    "message": "Joined lottery round successfully"
}

if error
{
    "status": "error",
    "message": "No active lottery round"
}

```

### Draw Lottery Round

Draws the active lottery round. Only admin can call this function.
Contract randomly selects a winner index from the list of participants and returns to front end, then disburse the prize to the winner and close the lottery round.

```
drawLotteryRound(string draw_time, string addr)

Params:
draw_time: draw time of the lottery round
addr: wallet address of the admin

returns
{
    "status": "success",
    "winner_no": 5,
    "message": "Lottery round drawn successfully"
}

if error
{
    "status": "error",
    "message": "No active lottery round"
}

```

