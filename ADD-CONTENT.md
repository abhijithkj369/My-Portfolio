# Adding content to the portfolio

All content lives in `index.html`. Nothing else needs to change.

## New project
Paste above the first card in the `#work` grid (find the comment `ADD NEW PROJECT CARDS HERE`). Newest first.

```html
<article class="card glass" data-reveal><h3>Project name</h3><p>What it is and what it achieved, in two sentences.</p><div class="tags"><span class="tag">Tool</span><span class="tag">Tool</span></div></article>
```

Card sizes: `card glass` is 1 column, `card glass wide` is 2, `card glass full` is 3 (full width).
The grid has 3 columns. Keep the total (normal = 1, wide = 2, full = 3) a multiple of 3 so the last row has no gap.

## New skill
Add `<span class="tag">Skill name</span>` inside the `.tags` div of the matching card in `#stack`.
A new skill group is a copy of one whole card in that grid.

## New hero number
In the hero `.stats` block, copy a `.stat` div and set `data-count` (the number) and `data-suffix` (for example `%` or `+`).

## New job, degree or achievement
Experience and education: copy a `<div data-reveal>` entry inside `.tl` in `#path` (newest first).
Achievements: copy a card in the small grid under the timeline.

## Story mode text
Dialogue and terminal commands are in `src/story.js` (the `cmds` list and the `chapters` array).
