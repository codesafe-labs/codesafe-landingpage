---
title: "Faster scans on large monorepos"
date: 2026-05-22
version: "v0.3.2"
tag: Fix
description: "Scan time on repos over 2,000 files dropped by roughly 60% thanks to parallel file walking and smarter ignores."
items:
  - "node_modules, build output, and lockfiles skipped by default"
  - ".codesafeignore support"
  - "Progress output no longer flickers in CI logs"
---
