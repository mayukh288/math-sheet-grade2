# Grade 2 Math Sheet Generator

A single-page worksheet generator that creates 10 random two-digit addition and subtraction problems suitable for grade 2 students. Learners can type answers directly on the page, check their work, and celebrate correct answers with a little confetti.

## Features
- Generates balanced addition and subtraction problems (no negative results)
- Colorful stacked layout that looks good when printed or used on tablets
- Instant feedback with animations for correct/incorrect answers
- Quick button to create a fresh worksheet any time

## Use It Locally
Just open `index.html` in any modern browser; no build tools or dependencies are needed.

## Publish With GitHub Pages
1. Create a new public repository in your GitHub account (for example `math-sheet-grade2`).
2. Copy the files from this folder into the repository (`index.html` and `README.md`).
3. Commit and push:
   ```bash
   git init
   git add .
   git commit -m "Add grade 2 math sheet"
   git branch -M main
   git remote add origin git@github.com:<your-username>/<repo-name>.git
   git push -u origin main
   ```
4. In the GitHub repository settings, open **Pages**, choose the `main` branch and root (`/`) folder, then save.
5. GitHub Pages will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute.

### Optional Customizations
- Swap the background image URLs in `index.html` for your own assets (local or hosted).
- Adjust the number range or total questions by editing `generateProblems()`.
- Print or export to PDF directly from the browser once the page is loaded.
