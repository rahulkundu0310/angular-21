# Angular 21 + ESLint + Prettier + Husky + lint-staged – Setup & Restore Guide

## 1. Install Husky and lint-staged

1. Install dev dependencies:

    ```bash
    npm install --save-dev husky lint-staged
    ```

2. Initialize Husky (creates `.husky` and may add `"prepare": "husky"` in `package.json`):

    ```bash
    npx husky init
    ```

3. Replace contents of `.husky/pre-commit` with:
    ```bash
    npx lint-staged
    ```

## 2. Configure lint-staged in package.json

4. In `package.json`, add:
    ```json
    "lint-staged": {
      "*.{ts,html}": "eslint --fix",
      "*.{css,scss,json,md,js}": "prettier --write"
    }
    ```

## 3. Line-ending fix for Windows + Linux

5. Create `.gitattributes` in the project root (if it does not exist).

6. Add the following rule to prevent script execution errors across different operating systems:
    ```text
    .husky/* eol=lf
    ```

## 4. Initialize Git and connect to personal GitHub repo

7. Initialize the repo and set the branch:

    ```bash
    git init
    git branch -M main
    ```

8. Set personal identity for this repository:

    ```bash
    git config user.email "r.kundu5@gmail.com"
    git config user.name "Rahul Kundu"
    ```

9. Add remote using personal SSH alias:
    ```bash
    git remote add origin git@github.com-rahul-personal:rahulkundu0310/angular-21.git
    ```

## 5. Make Husky hook executable (once per hook)

10. Stage all files:

    ```bash
    git add .
    ```

11. Mark `pre-commit` as executable in the Git index:
    ```bash
    git update-index --chmod=+x .husky/pre-commit
    ```

## 6. Ensure Husky is registered with current .git

12. If `.git` was recreated (or you re-ran `git init`), re-register Husky:
    ```bash
    npx husky
    ```

## 7. First commit and push

13. Commit:

    ```bash
    git commit -m "chore: initial commit of angular 21 enterprise boilerplate"
    ```

14. Push:
    ```bash
    git push -u origin main
    ```

## 8. Normal usage (everyday workflow)

15. When you change files:

    ```bash
    git add <files>
    git commit -m "your message"
    ```

    - Husky runs `npx lint-staged`.
    - `lint-staged` runs:
        - `eslint --fix` on `*.ts` and `*.html`
        - `prettier --write` on `*.css`, `*.scss`, `*.json`, `*.md`, and `*.js`

16. Push as usual:
    ```bash
    git push
    ```

## 9. If .git is deleted and you want to restore everything

If you delete the `.git` folder and later want to restore Git + Husky for this project:

17. Reinitialize Git and branch:

    ```bash
    git init
    git branch -M main
    ```

18. Reapply personal identity:

    ```bash
    git config user.email "r.kundu5@gmail.com"
    git config user.name "Rahul Kundu"
    ```

19. Re-add remote:

    ```bash
    git remote add origin git@github.com-rahul-personal:rahulkundu0310/angular-21.git
    ```

20. Re-register Husky with the new `.git`:

    ```bash
    npx husky
    ```

21. Stage all files:

    ```bash
    git add .
    ```

22. Reapply executable permission for the `pre-commit` hook:

    ```bash
    git update-index --chmod=+x .husky/pre-commit
    ```

23. Commit:

    ```bash
    git commit -m "chore: reconnect repo and restore husky"
    ```

24. Push and set upstream:
    ```bash
    git push -u origin main
    ```
