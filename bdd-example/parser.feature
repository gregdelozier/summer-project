Feature: testing a floating poing number parser

  Scenario: parse a single digit
     Given that we have loaded the parser library
      when we parse the string "0"
      then we will get the numerical value 0

  Scenario: parse a different single digit
     Given that we have loaded the parser library
      when we parse the string "9"
      then we will get the numerical value 9

  Scenario: parse multiple digits
     Given that we have loaded the parser library
      when we parse the string "99"
      then we will get the numerical value 99

  Scenario: parse more multiple digits
     Given that we have loaded the parser library
      when we parse the string "19"
      then we will get the numerical value 19

  Scenario: parse more multiple digits
     Given that we have loaded the parser library
      when we parse the string "-19"
      then we will get the numerical value -19

  Scenario: parse more multiple digits
     Given that we have loaded the parser library
      when we parse the string "-19.1"
      then we will get the numerical value -19.1
