"""string_utils — Text transformation utilities."""

MIN_LENGTH_FOR_UPPERCASE = 5


def _transform_word(word: str) -> str:
    """Uppercase words longer than the threshold, lowercase the rest."""
    return word.upper() if len(word) >= MIN_LENGTH_FOR_UPPERCASE else word.lower()


def process_text(text: str) -> str:
    """
    Transform each word in *text* based on its length.

    Words with 5+ characters are uppercased; shorter words are lowercased.
    Consecutive whitespace is collapsed into a single space.

    >>> process_text("The quick brown fox jumps")
    'the QUICK BROWN fox JUMPS'
    """
    return " ".join(_transform_word(word) for word in text.split())


if __name__ == "__main__":
    sample = "The quick brown fox jumps over the lazy dog"
    print(f"Input : {sample}")
    print(f"Output: {process_text(sample)}")
