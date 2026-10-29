# S01E03 — what it shows

Work in progress for the MEGA.dev course. Local verification is not course acceptance.

## Deliverables

- Signed source page: [decision 0002](src/routes/kb/decisions/0002-triage-by-cause/+page.svx).
- Actual compiled HTML: [rendered decision 0002](rendered/kb/decisions/0002-triage-by-cause/index.html).
- All rendered KB pages and browser assets are under `rendered/`.
- [Shared parser issue — 379 reports](https://github.com/madpawel/mega-s01e03-what-it-shows/issues/2).
- [booking-v3 hint issue — 33 reports](https://github.com/madpawel/mega-s01e03-what-it-shows/issues/1).

## Engineering outcome

After the first ticket submission, the course page published a newer desk update for 5 October:
the parser was fixed (`fix(dates): parse dd/mm for eu locales`), while the booking-v3 hint
was not fixed because that form was retired. The parser ticket is therefore completed;
the hint ticket is closed as not planned. The signed KB page records these distinct outcomes.
The report counts remain a snapshot of the earlier 4 October export.

## Reproduce

Use Node 26 (TypeScript type stripping is used by the analysis and verification scripts).

```sh
npm ci
npm run analyze
npm run build
npm run verify
npm run preview
```

Open http://127.0.0.1:4173/kb/decisions/0002-triage-by-cause .
Serve `rendered/` as the web root; opening HTML with file:// does not load root-relative assets correctly.

The client hydrates the real exported components. Change the first report's channel from
form to app in the dedupe explorer: its verdict changes from different causes to same cause.

## Evidence and scope

The supplied 2026-10-04 export has 427 rows representing 412 unique report IDs.
The exported classifier and tenant directory place 379 in parser and 33 in hint.
The living page computes its counts from that source data, not from these snapshot notes.
Five reports noted as one-day moves remain footnoted under their tenant-based classification;
their symptom wording alone does not establish an additional cause.

The timeline distinguishes receipt from merger; the large early-July merge bar is not an onset date.
Intake tags and browser locales are not authoritative tenant configuration.
Unknown tenants are not automatically duplicate reports.

All original export files, including accepted decision 0001, remain unchanged.
`source-baseline.json` records their SHA-256 hashes.
The new decision is proposed, not falsely labelled adopted by the support desk.
No production system was changed.

The page frontmatter carries the exact course-issued publication signature, as required by the challenge.
Its desk ref is derived by the exported RenderStamp component, not typed into the page.

## Privacy

Only the course-provided KB, added source/build files and generated public-page assets belong here.
The course explicitly requires its publication signature in the page frontmatter; the account owner approved that disclosure.
No account credentials, sign-in links, unrelated course receipts, private browser captures or agent logs
are part of the deliverable.
