
//
// Blackjack Game
//
// Simple version without betting, just win, lose, or tie.
//
// Copyright © 2021 Roger Covietz
// All Rights Reserved
//

let blackjackObj =
{
    /* See: https://ambitiouswithcards.com/new-deck-order/ */

    'playedCards': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,      // Ace - King of Hearts
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,      // Ace - King of Clubs
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,      // King - Ace of Diamonds
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],    // King - Ace of Spades

    /* card suit order from the 'top' (back-side) of a new deck of cards */
    'suits': ['h', 'c', 'd', 's'],                              // Hearts, Clubs, Diamonds, Spades

    /* card order from the 'top' (back-side) of a new deck for Hearts and Clubs */
    'cards1': ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'b'],

    /* card order from the 'top' (back-side) of a new deck for Diamonds and Spades */
    'cards2': ['k', 'q', 'j', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'a', 'b'],
    
    'cardMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'j': 10, 'q': 10, 'k': 10, 'a': [1, 11], 'b': 0},

    'player': {'scoreBox': '#players-blackjack-score', 'cardsBox': '#player-box',
               'cardCnt': 0, 'dealtCards': [], 'score': 0, 'softHand': false},

    'dealer': {'scoreBox': '#dealers-blackjack-score', 'cardsBox': '#dealer-box',
               'cardCnt': 0, 'dealtCards': [], 'score': 0, 'softHand': false},
    
    /* tally of played hands from the 'PLAYER's (your) perspective */
    'wins': 0,
    'losses': 0,
    'pushes': 0,

    'playerStands': false,
    'holeCardUp': false,
    'gameOver': true,
};

const PLAYER = blackjackObj.player
const DEALER = blackjackObj.dealer

var volume = document.getElementById("volume").value / 100;
var mainSoundStart = false;

const mainSound = new Audio('static/sounds/smb_main.mp3'); 
const dealSound = new Audio('static/sounds/smb_jump-small.wav'); 
//const hitSound = new Audio('static/sounds/swish.m4a');
const hitSound = new Audio('static/sounds/smb_bump.wav');
const winSound = new Audio('static/sounds/smb_powerup.wav');
const lossSound = new Audio('static/sounds/smb_bowserfalls.wav');
const blackjackSound = new Audio('static/sounds/smb_flagpole.wav');

document.querySelector('#volume').addEventListener('input', setVolume);

document.querySelector('#blackjack-deal-button').addEventListener('click', btnDeal);
document.querySelector('#blackjack-hit-button').addEventListener('click', btnHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', btnStand);

//document.getElementById('volume').addEventListener('load', jsStart);

//window.onload = function()
//{
//    jsStart(3);
//};

//document.addEventListener('mousemove', jsStart);

// window.addEventListener("DOMContentLoaded", event => {
//     const mainSound = document.querySelector('audio');
//     mainSound.volume = 7;
//     mainSound.play();
// });
  
// if (typeof mainSound.loop == 'boolean')
// {
//     mainSound.loop = true;
// }
// else
// {
//     mainSound.addEventListener('ended', function() {
//         this.currentTime = 0;
//         this.play();
//     }, false);
// }

function jsStart()
{
    if (false == mainSoundStart)
    {
        mainSound.volume = volume / 4;
        mainSound.play();
        mainSoundStart = true;
    }
}


function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


function setVolume()
{
    var bubble = document.getElementById('bubble');

    bubble.innerHTML = document.getElementById('volume').value;
    
    volume = document.getElementById("volume").value / 100;

    mainSound.volume = volume / 10;
    dealSound.volume = volume;
    hitSound.volume = volume;
    winSound.volume = volume;
    lossSound.volume = volume;
    blackjackSound.volume = volume;
}


async function btnDeal()
{
    if (blackjackObj.gameOver === true)
    {
        if (false == mainSoundStart)
        {
            setVolume();
            mainSound.play();
            mainSound.loop = true;
            await sleep(1000);
            mainSoundStart = true;
        }

        dealSound.play();
        await sleep(400);

        let playerImages = document.querySelector('#player-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < playerImages.length; i++)
        {
            playerImages[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++)
        {
            dealerImages[i].remove();
        }

        //console.clear();

        while (PLAYER.dealtCards.length > 0)
        {
            //console.log('Player cards dealt', PLAYER.dealtCards.length);
            //console.log('Player cards dealt', PLAYER.dealtCards);
            PLAYER.dealtCards.shift();
        }

        //console.log('Player cards dealt', PLAYER.dealtCards.length);

        // while (typeof (j = PLAYER.dealtCards.shift()) !== 'undefined')
        // {
        //     ;//console.log(j);
        // }

        while (DEALER.dealtCards.length > 0)
        {
            //console.log('Dealer cards dealt', DEALER.dealtCards.length);
            //console.log('Dealer cards dealt', DEALER.dealtCards);
            DEALER.dealtCards.shift();
        }

        // console.log('Dealer cards dealt', DEALER['dealtCards'].length);

        // while (typeof (j = DEALER.dealtCards.shift()) !== 'undefined')
        // {
        //     ;//console.log(j);
        // }

        blackjackObj.playedCards.fill(0);
        
        PLAYER.cardCnt = 0;
        DEALER.cardCnt = 0;

        PLAYER.score = 0;
        DEALER.score = 0;

        showScore(PLAYER);
        showScore(DEALER);

        PLAYER.softHand = false;
        DEALER.softHand = false;

        document.querySelector('#blackjack-result').style.color = 'black';
        document.querySelector('#blackjack-result').style.fontWeight = 'normal';
        document.querySelector('#blackjack-result').textContent = "Let's play";

        blackjackObj.playerStands = false;
        blackjackObj.holeCardUp = false,
        blackjackObj.gameOver = false;

        startDeal();

    } /* End if (blackjackObj.gameOver === true) */

} /* END function btnDeal() */


function btnHit()
{
    if (PLAYER.cardCnt < 2)
    {
        return;
    }
    else if (blackjackObj.playerStands === false)
    {
        blackjackHit(PLAYER);
    }
}


function btnStand()
{
    if (DEALER.cardCnt >= 2 && blackjackObj.gameOver === false)
    {
        blackjackObj.playerStands = true;
        dealerLogic();
    }
}


function getRandomNum(limit)
{
    var ms = new Date().getMilliseconds();

    ms = Math.floor((ms * (Math.random() * 3.14159)) % limit);

    return (ms);

}


async function startDeal()
{
    if (PLAYER.cardCnt < 2)
    {
        for (let i = 0; i < 2; i++)
        {
            blackjackHit(PLAYER);
            await sleep(673);

            blackjackHit(DEALER);
            await sleep(673);
        }
    }
}


function blackjackHit(activePlayer)
{
    /* no more 'PLAYER' hits if after 'PLAYER' is 'standing' */
    if (activePlayer === PLAYER && blackjackObj.playerStands === true)
    {
        return;
    }

    /* get a random new (unplayed) card from the deck */
    let result = dealCard();

    let suit = result[0];
    let card = result[1];

    /* save the cards dealt to each player, mainly for dealer's face-down cards */
    activePlayer.dealtCards.push(`${suit}${card}`);

    /*
    ** The dealer initially deals their first two cards face-down.
    ** Don't add the value of the dealer's face-down card(s) to the
    ** dealer's score until they are 'flipped-over'. The dealer's
    ** first card is 'flipped-over' when the second 'hole-card' is
    ** dealt. The dealer's 'hole-card' remains face-down until all
    ** other players have completed their hand.
    */
    if (activePlayer === DEALER && DEALER.cardCnt < 2)
    {
        if (DEALER.cardCnt !== 0)
        {
            suit = DEALER.dealtCards[DEALER.cardCnt-1].slice(0, 1);
            card = DEALER.dealtCards[DEALER.cardCnt-1].slice(1, 3);  /* 3 in case of 10 card need 2-digits */

            flipCard(suit, card, DEALER);
        }

        /*
        ** 'cb' stands for 'card back', meaning the card will be
        ** shown face-down.
        */
        suit = 'c';
        card = 'b';
    }

    if (activePlayer !== DEALER ||
        DEALER.cardCnt < 2 ||
        blackjackObj.holeCardUp === true)
    {
        activePlayer.cardCnt++;
        showCard(suit, card, activePlayer);
    }

} /* END function blackjackHit() */


function dealCard()
{
    let cnt = 0;
    let i;
    
    /* make sure we don't get stuck forever if all cards have been played */
    while (cnt < blackjackObj.playedCards.length)
    {
        //i = Math.floor(Math.random() * 52);
        i = getRandomNum(blackjackObj.playedCards.length);

        /*
        ** keep track of cards already played and only
        ** choose from those that are still in the deck
        */
        if (blackjackObj.playedCards[i] === 0)
        {
            blackjackObj.playedCards[i] = 1;
            cnt++;
            break;
        }

    }
    
    /* suit is 0-3, Hearts, Clubs, Diamonds, and Spades */
    let suit = Math.floor(i / 13);

    /*
    ** cards are 0-12, Ace-King for Hearts and Clubs,
    ** and King-Ace for Diamonds and Spades
    */
    let card = Math.floor(i % 13);

    if (blackjackObj.suits[suit] === 'h' ||
        blackjackObj.suits[suit] === 'c')
    {
        return [blackjackObj.suits[suit], blackjackObj.cards1[card]];
    }
    else
    {
        return [blackjackObj.suits[suit], blackjackObj.cards2[card]];
    }

} /* END function dealCard() */


function showCard(suit, card, activePlayer)
{
    if (activePlayer.score <= 21)
    {
        let cardImage = document.createElement('img');

        cardImage.src = `static/images/${suit}${card}.png`;
        //cardImage.height = 160;
        //cardImage.style.height = '10%';

        document.querySelector(activePlayer.cardsBox).appendChild(cardImage);
        
        hitSound.play();

        updateScore(card, activePlayer);
    }
}


function flipCard(suit, card, activePlayer)
{
    let dimg = document.querySelector('#dealer-box').querySelectorAll('img');

    /* replace the image of the face-down card with its face-up image */
    dimg[activePlayer.cardCnt - 1].src = `static/images/${suit}${card}.png`;

    hitSound.play();

    /* update and show the score after flipping the 'hole-card' face-up */
    updateScore(card, activePlayer);

}


function updateScore(card, activePlayer)
{
    if (card !== 'a')
    {
        activePlayer.score += blackjackObj.cardMap[card];

        if (activePlayer.score > 21 && activePlayer.softHand == true)
        {
            activePlayer.score -= (blackjackObj.cardMap['a'][1] -
                                   blackjackObj.cardMap['a'][0])

            activePlayer.softHand = false;
        }
    }

    else /* (card === 'a') */
    {
        if (activePlayer.score + blackjackObj.cardMap[card][1] <= 21)
        {
            activePlayer.score += blackjackObj.cardMap[card][1];
            activePlayer.softHand = true;
        }
        else
        {
            activePlayer.score += blackjackObj.cardMap[card][0];
        }
    }

    showScore(activePlayer);

} /* END function updateScore() */


function showScore(activePlayer)
{
    if (activePlayer.score > 21)
    {
        document.querySelector(activePlayer.scoreBox).style.color = 'red';
        document.querySelector(activePlayer.scoreBox).textContent = 'BUST!';
    }
    else
    {
        document.querySelector(activePlayer.scoreBox).style.color = '#FFFFFF';
        document.querySelector(activePlayer.scoreBox).textContent = activePlayer.score;
    }

    /*
    ** automatically start the 'DEALER' play-bot if the 'PLAYER'
    ** has a score of 21 (possible blackjack?), or more ('busted')
    */
    if (DEALER.cardCnt === 2 &&
        PLAYER.score >= 21 &&
        blackjackObj.playerStands === false)
    {
        blackjackObj.playerStands = true;
        dealerLogic();
    }
}


async function dealerLogic()
{
    /* flip-over the 'hole card' first, then play out the 'DEALER's hand */
    let suit = DEALER.dealtCards[DEALER.cardCnt-1].slice(0, 1);
    let card = DEALER.dealtCards[DEALER.cardCnt-1].slice(1, 3); /* 3 in case of 10 card need 2-digits */
    
    flipCard(suit, card, DEALER);

    blackjackObj.holeCardUp = true;

    while (DEALER.score < 17)
    {
        await sleep(673);
        blackjackHit(DEALER);
    }

    blackjackObj.gameOver = true;

    showResult(computeWinner());
}

/*
** Compute winner, update the wins, losses, or pushes (ties)
** counter, and if not a draw, return who just won.
*/
function computeWinner()
{
    let winner;
    
    /* if the 'PLAYER' didn't 'bust' */
    if (PLAYER.score <= 21)
    {
        if (PLAYER.score > DEALER.score || (DEALER.score > 21))
        {
            blackjackObj.wins++;
            winner = PLAYER;
        }
        else if (PLAYER.score < DEALER.score)
        {
            blackjackObj.losses++;
            winner = DEALER;
        }
        else if (PLAYER.score === DEALER.score)
        {
            /* when both scores are 21, a natrual blackjack wins over a 21 */
            if (PLAYER.score === 21 && DEALER.score === 21)
            {
                if (PLAYER.cardCnt === 2 && DEALER.cardCnt > 2)
                {
                    blackjackObj.wins++;
                    winner = PLAYER;
                }
                else if (DEALER.cardCnt === 2 && PLAYER.cardCnt > 2)
                {
                    blackjackObj.losses++;
                    winner = DEALER;
                }
                else
                {
                    blackjackObj.pushes++;
                }
            }
            else
            {
                blackjackObj.pushes++;
            }
        }
    }

    /* else, player 'busted' and loses, if the dealer did not 'bust' too */ 
    else if (DEALER.score <= 21)
    {
        blackjackObj.losses++;
        winner = DEALER;
    }

    /* else, both the player AND the dealer busted! */
    else
    {
        blackjackObj.pushes++;
    }

    return winner;

} /* END function computeWinner() */


function showResult(winner)
{
    let message, messageColor;
    
    if (blackjackObj.gameOver === true)
    {
        if (winner === PLAYER)
        {
            message = 'You won!';
            messageColor = 'green';

            if (PLAYER.score !== 21 || PLAYER.cardCnt > 2)
            {
                winSound.play();
            }
            else
            {
                blackjackSound.play();
            }

        }
        else if (winner === DEALER)
        {
            message = 'You lost!';
            messageColor = 'red';

            lossSound.play();
        }
        else
        {
            message = 'Push!';
            messageColor = 'black';
        }

        document.querySelector('#wins').textContent = blackjackObj.wins;
        document.querySelector('#losses').textContent = blackjackObj.losses;
        document.querySelector('#pushes').textContent = blackjackObj.pushes;

        document.querySelector('#blackjack-result').style.color = messageColor;
        document.querySelector('#blackjack-result').style.fontWeight = 'bold';
        document.querySelector('#blackjack-result').textContent = message;
    }
}



