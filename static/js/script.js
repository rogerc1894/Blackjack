
//
// Blackjack game
//

let blackjackGame =
{
    'player': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box',
            'cardCnt': 0, 'dealtCards': [], 'score': 0, 'softHand': false},

    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box',
               'cardCnt': 0, 'dealtCards': [], 'score': 0, 'softHand': false},
    
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

    /* tally of games played from the 'PLAYER's (Your) perspective */
    'wins': 0,
    'losses': 0,
    'pushes': 0,

    'isStand': false,
    'holeCardUp': false,
    'gameOver': true,
}

const PLAYER = blackjackGame['player']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-deal-button').addEventListener('click', btnDeal);
document.querySelector('#blackjack-hit-button').addEventListener('click', btnHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', btnStand);


function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function btnDeal()
{
    if (blackjackGame['gameOver'] === true)
    {
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < yourImages.length; i++)
        {
            yourImages[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++)
        {
            dealerImages[i].remove();
        }

        //console.log('Player cards dealt', PLAYER['dealtCards'].length);
        // for (let i = 0; i < PLAYER['dealtCards'].length; i++)
        // {
        //     PLAYER['dealtCards'].shift();
        // }

        while (typeof (j = PLAYER['dealtCards'].shift()) !== 'undefined')
        {
            ;//console.log(j);
        }
        //console.log('Player cards dealt', PLAYER['dealtCards'].length);

        //console.log('Dealer cards dealt', DEALER['dealtCards'].length);
        // for (let i = 0; i < DEALER['dealtCards'].length; i++)
        // {
        //     DEALER['dealtCards'].shift();
        // }

        while (typeof (j = DEALER['dealtCards'].shift()) !== 'undefined')
        {
            ;//console.log(j);
        }
        //console.log('Dealer cards dealt', DEALER['dealtCards'].length);

        PLAYER['cardCnt'] = 0;
        DEALER['cardCnt'] = 0;

        for (let i = 0; i < blackjackGame['playedCards'].length; i++)
        {
            blackjackGame['playedCards'][i] = 0;
        }

        PLAYER['score'] = 0;
        DEALER['score'] = 0;

        showScore(PLAYER);
        showScore(DEALER);

        PLAYER['softHand'] = false;
        DEALER['softHand'] = false;

        document.querySelector('#blackjack-result').style.color = 'black';
        document.querySelector('#blackjack-result').style.fontWeight = 'normal';
        document.querySelector('#blackjack-result').textContent = "Let's play";

        blackjackGame['isStand'] = false;
        blackjackGame['holeCardUp'] = false,
        blackjackGame['gameOver'] = false;

        startDeal();
    }
}

function btnHit()
{
    if (PLAYER['cardCnt'] < 2)
    {
        return;
    }
    else if (blackjackGame['isStand'] === false)
    {
        blackjackHit(PLAYER);
    }
}

function btnStand()
{
    if (DEALER['cardCnt'] >= 2 && blackjackGame['gameOver'] === false)
    {
        blackjackGame['isStand'] = true;
        dealerLogic();
    }
}

async function startDeal()
{
    if (PLAYER['cardCnt'] < 2)
    {
        for (let i = 0; i < 2; i++)
        {
            blackjackHit(PLAYER);
            await sleep(1000);

            blackjackHit(DEALER);
            await sleep(1000);
        }
    }
}

function blackjackHit(activePlayer)
{
    /* no more 'PLAYER' hits after 'standing' */
    if (activePlayer === PLAYER && blackjackGame['isStand'] === true)
    {
        return;
    }

    /* get a random (unplayed) card from the deck */
    let result = randomCard();

    let suit = result[0];
    let card = result[1];

    /* save the cards dealt to each player, mainly for dealer's face-down cards */
    activePlayer.dealtCards.push(`${suit}${card}`);

    if (activePlayer === DEALER && DEALER.cardCnt < 2)
    {
        /*
        ** The dealer flips-over his first card when the (2nd)
        ** 'hole card' is dealt. The 'hole card' remains face-down
        ** until all other players have completed their hands.
        */
        if (DEALER.cardCnt !== 0)
        {
            suit = DEALER.dealtCards[DEALER.cardCnt-1].slice(0, 1);
            card = DEALER.dealtCards[DEALER.cardCnt-1].slice(1, 3);  /* in case of 10 card need 2-digits */

            flipCard(suit, card, DEALER);
        }

        /* The dealer deals the cards face down initially,'cb' is for
        ** 'card back'. Dealer cards that are face-down do not add to
        ** the dealer's score until they are 'flipped'.
        */
        suit = 'c';
        card = 'b';

    }

    if (activePlayer !== DEALER ||
        DEALER.cardCnt < 2 ||
        blackjackGame['holeCardUp'] === true)
    {
        showCard(suit, card, activePlayer);

        activePlayer['cardCnt']++;

        updateScore(card, activePlayer);
        showScore(activePlayer);
    
    }

}

function randomCard()
{
    let cnt = 0;
    let i;
    
    while (cnt < 52)
    {
        i = Math.floor(Math.random() * 52);

        /*
        ** keep track of cards already played and only
        ** choose from those that are still in the deck
        */
        if (blackjackGame['playedCards'][i] === 0)
        {
            blackjackGame['playedCards'][i] = 1;
            break;
        }

        /* make sure we don't get stuck forever if all cards have been played */
        cnt++;
    }
    
    /* suit is 0-3, Hearts, Clubs, Diamonds, and Spades */
    let suit = Math.floor(i / 13);

    /*
    ** cards are 0-12, Ace-King for Hearts and Clubs,
    ** King-Ace for Diamonds and Spades
    */
    let card = Math.floor(i % 13);

    if (blackjackGame['suits'][suit] === 'h' ||
        blackjackGame['suits'][suit] === 'c')
    {
        return [blackjackGame['suits'][suit], blackjackGame['cards1'][card]];
    }
    else
    {
        return [blackjackGame['suits'][suit], blackjackGame['cards2'][card]];
    }

}

function showCard(suit, card, activePlayer)
{
    if (activePlayer['score'] <= 21)
    {
        let cardImage = document.createElement('img');

        cardImage.src = `static/images/${suit}${card}.png`;

        document.querySelector(activePlayer['div']).appendChild(cardImage);

        hitSound.play();
    }

}

function flipCard(suit, card, activePlayer)
{
    let dimg = document.querySelector('#dealer-box').querySelectorAll('img');

    /* replace the previously face-down image with the face-up 'hole-card' */
    dimg[activePlayer.cardCnt - 1].src = `static/images/${suit}${card}.png`;

    hitSound.play();

    /* update and show the score after flipping the 'hole-card' face-up */
    updateScore(card, activePlayer);
    showScore(activePlayer);

}

function updateScore(card, activePlayer)
{
    if (card !== 'a')
    {
        activePlayer['score'] += blackjackGame['cardMap'][card];

        if (activePlayer['score'] > 21 && activePlayer['softHand'] == true)
        {
            activePlayer['score'] -= (blackjackGame['cardMap']['a'][1] -
                                      blackjackGame['cardMap']['a'][0])

            activePlayer['softHand'] = false;
        }
    }

    else /* (card === 'a') */
    {
        if (activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21)
        {
            activePlayer['score'] += blackjackGame['cardMap'][card][1];
            activePlayer['softHand'] = true;
        }
        else
        {
            activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    }
}

function showScore(activePlayer)
{
    if (activePlayer['score'] > 21)
    {
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
    }
    else
    {
        document.querySelector(activePlayer['scoreSpan']).style.color = '#FFFFFF';
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }

    /*
    ** automatically start the 'DEALER' play-bot if the 'PLAYER'
    ** has a score of 21 (possible blackjack?), or more ('busted')
    */
    if (blackjackGame['isStand'] === false &&
        DEALER['cardCnt'] === 2 &&
        PLAYER['score'] >= 21)
    {
        blackjackGame['isStand'] = true;
        dealerLogic();
    }
}

async function dealerLogic()
{
    /* flip-over the 'hole card' first, then play out the 'DEALER's hand */
    let suit = DEALER['dealtCards'][1].slice(0, 1);
    let card = DEALER['dealtCards'][1].slice(1, 3); /* in case of 10 card need 2-digits */
    
    flipCard(suit, card, DEALER);

    blackjackGame['holeCardUp'] = true;

    while (DEALER['score'] < 17)
    {
        await sleep(1000);
        blackjackHit(DEALER);
    }

    blackjackGame['gameOver'] = true;

    showResult(computeWinner());

}

/*
** Compute winner, update the wins, losses, and pushes (ties),
** and return who just won, if any.
*/
function computeWinner()
{
    let winner;
    
    /* if the 'PLAYER' didn't 'bust' */
    if (PLAYER['score'] <= 21)
    {
        if (PLAYER['score'] > DEALER['score'] || (DEALER['score'] > 21))
        {
            blackjackGame['wins']++;
            winner = PLAYER;
        }
        else if (PLAYER['score'] < DEALER['score'])
        {
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if (PLAYER['score'] === DEALER['score'])
        {
            /* when both scores are 21, a natrual blackjack wins over a 21 */
            if (PLAYER['score'] === 21 && DEALER['score'] === 21)
            {
                if (PLAYER['cardCnt'] === 2 && DEALER['cardCnt'] > 2)
                {
                    blackjackGame['wins']++;
                    winner = PLAYER;
                }
                else if (DEALER['cardCnt'] === 2 && PLAYER['cardCnt'] > 2)
                {
                    blackjackGame['losses']++;
                    winner = DEALER;
                }
                else
                {
                    blackjackGame['pushes']++;
                }
            }
            else
            {
                blackjackGame['pushes']++;
            }
        }
    }
    /* else, player 'busted' and loses, if the dealer did not 'bust' too */ 
    else if (DEALER['score'] <= 21)
    {
        blackjackGame['losses']++;
        winner = DEALER;
    }
    /* else, both the player AND the dealer busted! */
    else
    {
        blackjackGame['pushes']++;
    }

    return winner;

}

function showResult(winner)
{
    let message, messageColor;
    
    if (blackjackGame['gameOver'] === true)
    {
        if (winner === PLAYER)
        {
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
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

        document.querySelector('#wins').textContent = blackjackGame['wins'];
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        document.querySelector('#pushes').textContent = blackjackGame['pushes'];

        document.querySelector('#blackjack-result').style.color = messageColor;
        document.querySelector('#blackjack-result').style.fontWeight = 'bold';
        document.querySelector('#blackjack-result').textContent = message;
    }
}




