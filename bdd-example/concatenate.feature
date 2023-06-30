Feature: we can concatenate strings

Scenario: concatenate simple strings
    Given we have imported the concatenation library
    When  we concatenate "cat" and "dog" 
    Then  we get "catdog"

Scenario: concatenate other simple strings
    Given we have imported the concatenation library
    When  we concatenate "catd" and "og" 
    Then  we get "catdog"

Scenario: concatenate even more simple strings
    Given we have imported the concatenation library
    When  we concatenate "al" and "exander" 
    Then  we get "alexander"

Scenario Outline: concatenate some strings
    Given we have imported the concatenation library
    When  we concatenate "<first>" and "<second>" 
    Then  we get "<result>"

  Examples: various animals
    | first | second | result    |
    | cat   | dog    | catdog    |
    | zebra | cow    | zebracow  |
    | bunny | bird   | bunnybird |

  Examples: various colors
    | first | second | result    |
    | red   | blue   | redblue   |
    | red   | green  | redgreen  |
    | blue  | white  | bluewhite |

  Examples: various length words
    | first | second | result    |
    | a     | i      | ia        |
    | a     | hippopotamus | ahippopotamus  |
    | hippopotamus | a | hippopotamusa  |
    | hippopotamus  | hippopotamus  | hippopotamushippopotamus |
