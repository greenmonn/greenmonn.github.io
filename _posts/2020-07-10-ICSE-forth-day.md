---
title: "ICSE 2020 넷째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 넷째날

<!--more-->

넷째 날의 Technical Track에서는 meta-model, 혹은 특정한 rule을 정의하여 코드를 자동으로 생성하고 correctness를 verify하는 테크닉에 관한 `Code Generation and Verification`, 프로그래밍 개발과 유지 보수에 있어서 꼭 필요한 버전 컨트롤 시스템의 다양한 Practice와 문제점들을 해결하는 `Version Control and Programming` 세션과 같은 ecosystem 분야에 흥미가 갔다. 이어진 `Testing and Debugging` 세션에서도 재미있는 주제들이 많이 나왔는데, Fuzzing 관련해서는 greybox technique들을 중심으로 발전한 형태들이 소개되는 것 같았고, security rationale에 대한 empirical study, JIT DP의 cross-project learning, 또는 cross-project로 transfer learning을 활용한 bug localization, continuous integration의 cost에 대한 연구들이 소개되었다. 

코드 주변의 컨텍스트를 활용하여 유추하고자 하는 부분의 statement나 expression을 자동으로 생성할 수 있는 테크닉들에 관심이 갔는데, 그 중 하나가 `On learning meaningful assert statement`과 같은 페이퍼였고, 이전에 살펴보았던 bug patch를 자동으로 생성하는 테크닉들과 비슷한 전략으로 다양한 `code completion` task를 수행할 수 있을지 궁금해졌다.



## Code Generation and Verification
### Co-Evolving Code with Evolving Metamodels

## Code Artifact Analysis
### An Empirical Validation of Oracle Improvement (Journal First)
### Is Static Analysis Able to Identify Unnecessary Source Code? (Journal First)

## Version Control 
### Planning for Untangling: Predicting the Difficulty of Merge Conflicts (Technical)
### Towards Understanding and Fixing Upstream Merge Induced Conflicts in Divergent Forks: An Industrial Case Study
### Version Control Systems: An Information Foraging Perspective

## Testing & Debugging
### Schrödinger's Security: Opening the Box on App Developers' Security Rationale
### Deep Transfer Bug Localization
### A benchmark-based Evaluation of Search-based Crash Reproduction
### An Investication of Cross-project Learning in Online JIT Software DP
### An Empirical Study of Long Duration of Continuous Integration Builds


## Deep Learning Testing & Debugging
### trader: trace divergence Analysis and Embedding regulation for Debugging RNN

## Mutation with DL
### DeepMutation: A Neural Mutation Tool (Journal First)