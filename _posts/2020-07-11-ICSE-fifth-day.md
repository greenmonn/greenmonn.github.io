---
title: "ICSE 2020 다섯째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 마지막날

<!--more-->

토요일까지 이어진 ICSE Technical Track이 종지부를 찍었다. Code를 Dynamic Language Model로 표현하여 Out-of-Vocabulary 문제의 해답을 제시한 논문, 그리고 이어서 Deep learning을 대상으로 한 testing & debugging 세션에서도 재미있는 주제들이 많이 소개되었다. Machine Translation 모델의 잘못된 결과를 metamorphic relationship을 통해 detect하는 Structure-Invariant Testing, 모델 자체를 고치는 것이 아니라 post-processing 과정으로써의 repair를 수행하는 것, Deep Nueral Network의 Repair에 있어 Fix Pattern과 Challenge를 소개한 Survey 논문도 있었다. 마지막으로 APR(Automated Program Repair) 분야에서는 Neural Net을 이용해 Fix Pattern을 모으고 주변의 컨텍스트를 활용하여 Code Transformation Learning을 수행하는 논문들이 괄목할 만한 성능을 보여주었다.

## ICSE-10 Most Influential Paper Award

-   Oracle-Guided Component-Based Program Synthesis: http://susmitjha.github.io/papers/icse10.pdf

## ACM SIGSOFT Distinguished Artifact Award

-   Primers or Reminders? The Effects of Existing Review Comments on Code Review
    -   코드 리뷰 시에 다른 리뷰어에 의한 기존의 리뷰를 먼저 보는 것은 bias를 초래해서 객관적인 판단을 내리지 못하게 할 수도 있지만, 다른 리뷰어들의 관점을 참고하여 놓칠 수 있었던 부분에 주목하는 긍정적인 영향이 될 수도 있다. 이를 알아보기 위한 empirical study의 흥미로운 한 instance인 것 같다. [이곳](https://sback.it/publications/icse2020.pdf)에서 읽을 수 있다.

## Code Language Model

Source code에 대한 language model을 만들어 code suggestion, readability improvement, API migration 등의 태스크에 응용하고자 하는 시도는 지속적으로 있었다.

[Language model](http://www.scholarpedia.org/article/Neural_net_language_models)은 어떤 문장이 주어졌을 때 이 문장에 대한 확률을 구하는 모델이다. 이전에 나온 단어 몇 개를 보고 다음에 나올 문장을 예측함으로써 Language Generation Task의 기초가 된다. 이를 코드의 token들에도 동일하게 적용할 수 있게 된다면, code generation과 관련된 유용한 태스크들로 발전시킬 수 있지 않을까? 하지만 이러한 물음에서부터 시작된, NLP2Code와 관련된 여러 연구들에서 공통적으로 맞닥뜨린 문제점은, 코드에서는 공통적이면서 meaningful한 token들이 지속적으로 사용되기보다는 variable identifier 등에 개발자가 임의로, 또는 컨벤션에 의해 새롭게 만들어진 unique word들이 많아서 vocabulary size가 지나치게 커지고 함께 OOV(Out-Of-Vocabulary) 문제도 굉장히 빈번하게 발생한다는 것이다. 이런 문제를 타겟팅하여 소스 코드의 Open-Vocabulary Model을 구성한 논문이 이목을 끌었다.

### Big Code ≠ Big Vocabulary: Open Vocabulary Models for Source Code


## Deep Learning Testing & Debugging

### ReluDiff: Differential Verification of Deep Neural Networks

### Structure-Invariant Testing for Machine Translation

### Automatic Testing and Improvement of Machine Translation

### Testing DNN Image Classifier for Confusion & Bias Errors

### Repairing Deep Neural Networks: Fix Patterns and Challenges

## Program Analysis and Verification

### On the Recall of Static Call Graph Construction in Practice

### mCoq: Mutation Analysis for Coq Verification Projects

## Bugs and Repair

### FixMiner: Mining Relevant Fix Patterns for Automated Program Repair

### DLFix: Context-based Code Transformation Learning for Automated Program Repair
