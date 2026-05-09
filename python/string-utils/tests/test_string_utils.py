import sys
from pathlib import Path

# Ensure parent package is importable when running directly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest

from string_utils import process_text


def test_uppercase_words_with_five_or_more_characters():
    assert process_text("quick brown jumps") == "QUICK BROWN JUMPS"


def test_lowercase_words_with_four_or_fewer_characters():
    assert process_text("The fox is on") == "the fox is on"


def test_mixed_length_words_are_transformed_accordingly():
    assert process_text("The quick brown fox jumps") == "the QUICK BROWN fox JUMPS"


def test_exactly_four_character_words_are_lowercased():
    assert process_text("four FIVE") == "four five"


def test_exactly_five_character_words_are_uppercased():
    assert process_text("hello WORLD") == "HELLO WORLD"


def test_single_long_word():
    assert process_text("elephant") == "ELEPHANT"


def test_single_short_word():
    assert process_text("cat") == "cat"


def test_single_character_word():
    assert process_text("I") == "i"


def test_empty_string_returns_empty_string():
    assert process_text("") == ""


def test_whitespace_only_string_returns_empty_string():
    assert process_text("   ") == ""


def test_multiple_spaces_between_words_are_collapsed():
    assert process_text("The   quick    fox") == "the QUICK fox"


def test_leading_and_trailing_whitespace_is_stripped():
    assert process_text("  hello world  ") == "HELLO WORLD"


def test_tabs_and_newlines_are_treated_as_whitespace():
    assert process_text("The\tquick\nbrown") == "the QUICK BROWN"


def test_already_uppercase_short_word_becomes_lowercase():
    assert process_text("THE FOX") == "the fox"


def test_already_lowercase_long_word_becomes_uppercase():
    assert process_text("elephant") == "ELEPHANT"


def test_mixed_case_input_is_normalized():
    assert process_text("hElLo WoRlD") == "HELLO WORLD"


def test_numeric_strings_are_treated_as_short_words():
    assert process_text("123 12345") == "123 12345"


def test_special_characters_count_toward_word_length():
    assert process_text("hi! hello!") == "hi! HELLO!"


def test_hyphenated_word_treated_as_single_token():
    assert process_text("well-known fact") == "WELL-KNOWN fact"


def run_all_tests():
    """Run all tests in this module and print results."""
    import inspect

    test_functions = [
        (name, obj)
        for name, obj in inspect.getmembers(inspect.getmodule(run_all_tests))
        if inspect.isfunction(obj) and name.startswith("test_")
    ]

    passed = 0
    failed = 0

    for name, fn in test_functions:
        try:
            fn()
            passed += 1
            print(f"  ✓ {name}")
        except AssertionError as e:
            failed += 1
            print(f"  ✗ {name} — {e}")

    total = passed + failed
    print(f"\n{passed} passed, {failed} failed — {total} total")
    return failed == 0


if __name__ == "__main__":
    import sys

    success = run_all_tests()
    sys.exit(0 if success else 1)

