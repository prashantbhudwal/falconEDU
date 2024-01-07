# Git Workflow @ FalconAI

## Introduction

There are two branches in the project: master and chubbi. These branches are protected and only the reviewer can merge to them. These branches are permanent and should not be deleted.

## master <prod>

- The master branch is the main branch of the project.
- app.falconai.in is deployed from the master branch.

## chubbi <dev>

- The chubbi branch is the development branch of the project.
- chubbi.falconai.in is deployed from the chubbi branch.

## Workflow

### A developer will

- create a `new branch` from the `chubbi`.
- work on the new branch for all their tasks.
- create a pull request from the new branch to the chubbi.
- assign the pull request to the reviewer.

### The reviewer will

- review the pull request and merge it to the chubbi branch.
- deploy the chubbi branch to chubbi.falconai.in.
- create a pull request from the chubbi branch to the master branch.
- review the pull request and merge it to the master branch.
- deploy the master branch to app.falconai.in.

### Hotfix
- A hotfix is a bug fix that is done on the master branch directly.
- If there is a hotfix, only the reviewer can make the changes.

### Not to do list

- Never share chubbi branch with anyone outside the team.
