"""Unit tests for the language-chart logic in scripts/generate_stats.py (stdlib only)."""
import os
import sys
import unittest
import xml.dom.minidom

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import generate_stats as gs  # noqa: E402


class LanguageChartTests(unittest.TestCase):
    def test_share_uses_all_bytes_not_top_rows(self):
        by_size = {"Python": 56, "Swift": 25, "Jupyter Notebook": 7, "JavaScript": 3,
                   "TypeScript": 3, "Shell": 6}
        rows, _, total = gs.rank_languages(by_size, {}, n=5)
        self.assertEqual(total, 100)
        self.assertEqual([n for n, _ in rows],
                         ["Python", "Swift", "Jupyter Notebook", "Shell", "JavaScript", "Other"])
        self.assertEqual(gs.format_share(rows[0][1], total), "56%")
        self.assertEqual(rows[-1], ("Other", 3))
        self.assertEqual(sum(v for _, v in rows), total)

    def test_small_share_is_not_shown_as_zero(self):
        self.assertEqual(gs.format_share(1, 1000), "<1%")
        self.assertEqual(gs.format_share(0, 1000), "0%")

    def test_repo_ties_broken_by_bytes_not_alphabet(self):
        by_size = {"Python": 900, "Swift": 500, "C++": 5, "HTML": 10, "TypeScript": 300}
        by_repo = {"Python": 5, "Swift": 1, "C++": 1, "HTML": 1, "TypeScript": 1}
        _, rows, _ = gs.rank_languages(by_size, by_repo, n=3)
        self.assertEqual([n for n, _ in rows], ["Python", "Swift", "TypeScript"])

    def test_display_names_fit_without_mid_word_cut(self):
        self.assertEqual(gs.display_name("Jupyter Notebook"), "jupyter")
        self.assertEqual(gs.display_name("JavaScript"), "javascript")
        for name in ["TypeScript", "PowerShell", "Python", "Swift", "PLpgSQL"]:
            self.assertLessEqual(len(gs.display_name(name)), gs.MAX_LABEL)

    def test_chart_is_well_formed_svg(self):
        rows, repos, total = gs.rank_languages({"Python": 3, "Swift": 1}, {"Python": 2, "Swift": 1})
        svg = gs.draw_langs(rows, repos, total)
        xml.dom.minidom.parseString(svg)
        self.assertIn(">75%<", svg)
        self.assertIn(">swift<", svg)


if __name__ == "__main__":
    unittest.main()
