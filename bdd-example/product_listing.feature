Feature: test product listings at Amazon

Scenario: blenders for sale include Hamilton Beach
    Given that we have navigated to www.amazon.com
     When we search for "blender"
     Then we find items from "Hamilton Beach"