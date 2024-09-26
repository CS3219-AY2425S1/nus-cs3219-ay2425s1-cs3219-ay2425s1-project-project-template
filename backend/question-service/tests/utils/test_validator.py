from dataclasses import dataclass
from typing import List
from unittest import TestCase

from question_service.utils import is_alnum_and_whitespaces


class TestIsAlnumAndWhiteSpaces(TestCase):
    def test_is_alnum_and_whitespaces(self) -> None:
        @dataclass
        class TestCase:
            name: str
            input: str
            expected: bool

        testcases: List[TestCase] = [
            TestCase("Valid Title", "Two Sum", True),
            TestCase("Only digits", "123 456", True),
            TestCase("Empty string", "", False),
            TestCase("Title with dashs", "One-hop", False),
            TestCase("Trailing space", "Two Sum   ", True),
            TestCase("Leading space", "   Two Sum", True),
            TestCase("Special characters", "Go!", True),
        ]

        for case in testcases:
            actual = is_alnum_and_whitespaces(case.input)
            assert actual == case.expected, f"Failed: {case.name}"
