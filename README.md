# Guardian of the Chips -- The Poker Helper

[Live](https://jh177.github.io/poker-helper/)

## Background

PokerHelper is a web application for users to calculate win probabilities during a poker game. PokerHelper allows users to simulate a poker hand and see the probabilities of every possible outcome almost instantly. 

One important feature of PokerHelper is the inclusion of the poker range. A poker range is a collection of all the possible hands a player can have at a particular point in a hand. It is crucial to think about what your opponents have in the form of a range. You can input a range of the opponent and see the outcome probabilities of your hand. As the hand progresses, you can refine the opponents’ ranges based on their behaviors and update them in PokerHelper. PokerHelper will provide the updated outcome probabilities to aid your decision-making.



## Functionality & MVPs

With PokerHelper, users will be able to:
* Pick two hole cards
* Select a range of the opponent
* Select the community cards for the flop, turn, and river
* Get probabilities of win, lose and draw
* Update the opponent’s range and get the updated outcome probabilities

In addition, this project will include:
* An About tab describing the poker range and the list of poker hands
* A README file



## Wireframes

![wireframes](/assets/images/Poker-Helper%20Wireframes.jpg)

* Nav links include links to this project’s Github repo, my LinkedIn, and the About tab.
* Card Selectors will include Add buttons to select cards for user’s hole cards and community cards.
* Opponent Range Selector will have an Add button to select card combos from a list of available card combinations.
* Range Display will display the selected range.
* Outcome Display will display the probabilities of win, lose, and draw.



## Technologies, Libraries, APIs
This project will be implemented with the following technologies:
* Webpack and Babel to bundle and transpile the source JavaScript code
* npm to manage project dependencies



## Implementation Timeline

1. Friday && Weekend: Setup project, including getting webpack up and running. Get canvas to show up on the screen. Create Card and Deck classes. Get the hold cards and community cards to render to the canvas.
2. Monday: Create a Range class and render a range grid on canvas for displaying the selected range. Make the grid cells interact with card values.
3. Tuesday: Implement the logic of calculating possibilities of outcomes.
4. Wednesday: Finish implementing user controls, and focus on styling. 
5. Thursday Morning: Deploy to GitHub pages. If time, polish the README.



## Bonus features
* Add options to include multiple opponents’ ranges
* Add options to identify the opponent’s table position and provide preselected ranges based on the position
