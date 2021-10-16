# Blackjack

*** 21-Oct-16 version 01.00.03 ***

Added volume control slider.

Fixed bug where ocassionally the exact same card(s) would be dealt twice in the same hand.
Usually this would only occur during hands where many low value cards were pulled from the
deck. Specifically, on two separate ocassions, two (2) three of diamonds cards were dealt
to the player when the player had a total of six (6) cards in the hand and the dealer had
also been dealt five (5) or six (6) low value cards.

*** 21-Oct-02 version 01.00.02 ***

Shortened the delay between drawing cards in automatic 'play-bot' mode for the Dealer.

Change the card height to be 40% of the play window's size to prevent the cards from getting very large as the screen's view port size is reduced.

Added automatic scroll bars to the 'play window' if the played cards overflow the 'play window' box due smaller screen sizes.


*** 21-Sep-25 version 01.00.01 ***

Added favicon image to the 'Title'

Added decorative image's to both sides (left and right) of the "Blackjack" header.

Validated index.html using the W3C Markup Validation Service (https://validator.w3.org)

Added copyright statement.

Modified the script.js file to use all '.' (dot) notation for accessing elements of
the main game's object. Was using a mixture of '.' (dot) notation and element name (['element-name'])
notation.


*** Initial commit ***

Basic Blackjack game (no betting, just win/lose)

