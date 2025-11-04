# Grade 2 Math Sheet Hub

A lightweight site with a landing page plus two printable/interactive worksheets tailored to Grade 2 skills:

- `addition-subtraction.html` – stacked two-digit addition & subtraction with instant feedback, confetti, and regeneration button.
- `mixed-practice.html` – skip counting, place value, comparisons, word problems, and time reading in one quick set.

Each worksheet randomizes on load and can be used directly in the browser or printed to paper.

## Run Locally
Open `index.html` in any modern browser. Use the cards on the landing page to jump into either worksheet.

## Deploy (already set up via GitHub Pages)
1. Commit any changes locally (`git commit -am "Describe change"`).
2. Push to `main` (`git push origin main`). GitHub Pages is configured to serve from `main` → root, so deploys happen automatically at `https://mayukh288.github.io/math-sheet-grade2/`.

## Customize
- Update card copy or add new worksheet links inside `index.html` to grow the hub.
- Tweak question generators in each worksheet (`generateProblems()` or section-specific helpers) to match your lesson plans.
- Replace background/gradient styles for your own brand.
