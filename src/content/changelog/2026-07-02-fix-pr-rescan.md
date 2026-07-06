---
title: "Fix PRs now re-scan themselves before opening"
date: 2026-07-02
version: "v0.4.0"
tag: Release
description: "The biggest trust upgrade yet: every generated diff is scanned again before the pull request is created. If the fix does not fully close the finding, the PR is not opened."
items:
  - "Re-scan step added to codesafe fix, on by default"
  - "PR descriptions now include a before/after finding count"
  - "New exit code 3 for partially-fixed findings in CI"
---
