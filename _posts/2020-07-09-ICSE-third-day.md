---
title: "ICSE 2020 셋째날"
tags: [conference]
---

ICSE 2020 Virtual Conference 셋째날

<!--more-->

<style>
.post-content {
  margin-top: 7%;
  font-family: "Noto Sans KR";
}
</style>

삼일 째 정도부터 학회장 대신 모니터 앞에 덩그러니 앉아, 정신없이 지나가는 presentation을 따라잡으려 안간힘 쓰는 스스로의 모습에 약간 현타(...)가 오기 시작했다.

그래도 이번 학회를 통해 학계의 전체적인 연구 동향을 파악하고, 내 흥미를 이끄는 분야를 어느 정도 확립하겠다는 목표를 다잡으며 정리를 이어간다.

## Regression Testing in CI

CI가 업계의 일반적인 practice로 자리잡으면서 Regression Testing으로 발견된 버그에 대해 online으로 root cause detection / localization / repair 하려는 노력이 새롭게 주목받고 있다는 인상을 받았다. 오늘의 세션은 좀더 근본적인 cost 측면에 집중해서 좀더 전통적인(?) 주제인 test selection/prioritization[1], 그리고 build cost optimization[2]에 대해서 이야기하고 있었다.

### [1] Learning-to-Rank vs. Ranking-to-Learn: strategies for regression testing in continuous integration

Test selection/prioritization 문제에 machine learning technique을 적용한 연구들을 크게 learning-to-rank, 그리고 ranking-to-learn 전략으로 나눠서, RL을 포함해 다양한 ML 테크닉들을 비교한다. 실제 CI 환경에서 어떤 feature들이 성능에 영향을 미치는지를 파악하고 추후 이러한 ML 기반 알고리즘을 사용할 때 context에 따라 어떤 feature를 사용하고 튜닝할지에 대한 insight를 제공하는 것이 이 연구의 목표다.

![](https://www.dropbox.com/s/ztrc59gwjf6q2lh/l2r_r2l.png?dl=0)

Learning-to-rank algorithm은 test target들을 failure의 발생에 따라 서로 다른 class로 판별하는 classification, 또는 score의 regression 문제로 보거나 (_pointwise, pairwise_) 이미 label된 ranking을 직접 예측하도록 하는 regression 문제로 해석할 수 있다. (_listwise_)

미리 observe된 training dataset으로 모델을 학습하고, 추가적으로 CI가 돌 때마다 online으로 retraining을 하는 방법이 주로 사용된다고 한다.

반대로 Ranking-to-learn algorithm은 RL algorithm을 사용하여 항상 online으로 학습된다.

RQ를 보면 크게 **(1) code characteristics**, **(2) CI process characteristics** 두 가지의 측면에서 feature 각각의 중요성, inter-commit time과 같은 CI의 각 cycle의 특성에 따른 변화를 확인하고자 했고, selected ML algorithm들이 동일한 CI 환경에서 얼마나 효율적으로 prioritization을 수행했는지 비교하는 것 또한 주요한 contribution이다.

### [2] A Cost-efficient Approach to Building in Continuous Integration

`SmartBuildSkip`이라는 tool 이름에서부터 유추할 수 있듯이, CI 코스트의 주요한 부분을 차지하는 build task를 최대한 줄이고자 하는 work이다. 우리가 관심있는 것은 failing build이기 때문에, 미리 build의 outcome을 예측하여, 확실히 pass할 것 같은 build들은 넘기고 가자는 것이다.

사실 결과를 미리 예측해서 skip 여부를 결정한다는 게 주객전도(?) 같은 느낌일 수도 있지만, CI의 대부분의 build는 pass할 것이고 (가설 1), fail이 한번 일어나면 연속적으로 fail이 더 일어나는 경향을 가진다(가설 2)는 직관을 가지고 제안한 것이 `SmartBuildSkip`이다. 이 가설은 저자들의 empirical study로부터 수립된 것.

Failure의 종류를 first failure와 subsequent failure로 나눔으로써, 기존의 build-prediction approach(ex. HW17)들이 단순히 모든 build들의 history를 동일하게 보고 예측했던 것보다 높은 정확도를 얻을 수 있다는 것이다. (build의 패턴을 고려하여 예측 결과를 생성) 즉, first failure에 대해서만 prediction을 수행하고, failure가 연속될 것이라는 가정 하에 passing build가 나올 때까지 항상 build를 실행하게 된다.

Random classifier를 사용해서 first-failure를 predict하고, 같은 project의 정보만을 사용하는 within, 다른 프로젝트의 feature와 함께 학습하는 cross (targeting cold-start problem) 두 가지 variant에 대한 결과를 함께 내놓았다. correlated feature의 경우에는 build feature에 해당하는 source, file, test churn(the number of changed source lines), distance from last failure, build가 요청된 시간(_새벽에 build되면 fail 확률이 더 높다는 가정..?_) 등을 사용했고, project-specific한 feature로 프로젝트의 규모와 얼마나 오래되었는지, test density를 사용했다. (거의 JIT DP와 비슷하다)

만일 fail하는 경우에도 잘못된 prediction (false negative) 때문에 build를 skip하게 되면 failure detection이 delay될 것이다. 논문에서 리포트한 결과로는 15%의 failing build들이 1 build 지연되는 정도라고 했는데, 1 build가 지연된다는 것은 결국 다음 commit, 또는 PR이 submit되기를 기다려야 하기 때문에 적은 cost라고 할 수는 없을 것이다. 이 부분에 대한 질문이 Q&A 세션에서도 많이 나왔던 것 같다.

## Robustness of Deep Learning System

### [1] Fuzz Testing based Data Augmentation to Improve Robustness of Deep Neural Networks

Adversarial example을 그대로 만들어서 DNN에 train 시킨다면 어떤 결과가 일어날까? 단순히 DNN이 이러한 adversarial input에 대해서도 잘 평가하는 더 robust한 model이 만들어질까?

기존에 test-based program synthesis에 대한 연구들에서 제기된 over-fitting 문제처럼, input set이 program behavior에 대한 specification 모두를 대체할 수는 없다. Data Augmentation을 기존 test generation technique에서 보던 것처럼 기존의 specification을 보완하는 형태로 생각한다면, 원래 있던 training set과 adversarial input들을 적절히 조합해서 '최적의' training set을 찾으려는 시도가 가능할 것이다.

기본적인 아이디어는 mutation-based fuzzing을 DNN에 대해, (adversarial) input generation에 적용하는 것이며, 만들어진 mutated input들 중에 GA를 사용하여 loss를 최소화하는 optimal augmentation을 찾게 된다. 추가적으로 Selective Augmentation을 통해 이미 모델이 confidence를 가지고 (loss threshold, classification result) 예측하는 결과에 대해서는 새롭게 train 하지 않도록 한다. Selective Augmentation을 사용한 것과 하지 않은 것을 비교하여 evaluation을 수행한 결과도 있는데, selective augmentation을 켰을 때 accuracy가 살짝 <1% 감소하기는 하지만 training time 측면에서 30%의 시간 절약을 보여주었다.

Fitness function으로 loss를 사용하는 것은 단순하면서도 효과적인 방법이지만, coverage를 높이는 방향으로 새로운 input을 sampling하는 것 또한 고려해볼 수 있다. 논문에서는 Neuron Coverage를 fitness function으로 이용하여 얻은 accuracy 결과를 리포트하는데, 거의 비슷한 결과를 보였다. 하지만 training time이 50% 이상 증가하기 때문에 loss-based를 유지하는 것이 fuzzing에는 좀더 나은 선택일 것이다. (comment: 그럼에도 다른 coverage metric이나 좀더 다양한 confidence에 대한 measure을 시도해 보는 것이 유의미하기는 할 것 같다)

## Testing & Debugging

Debugging을 할 때 우리는 어떤 input이 어떤 program element에서 문제를 일으켰는지 찾는다.
input의 어떤 부분과 특정 program element의 interaction이 버그를 일으키는지를 찾는 것이 궁극적인 목적일 것이다. (이전에 봤던 Causal Testing에서도 특정 input의 어떤 영역이 fault를 일으키고, program element의 어떤 부분이 달라지는지를 함께 찾았다)

지금까지 든 생각은 Fault를 Localize하는 것에 있어 지금껏 faulty input과 faulty program element의 관계성에 그리 집중하지는 않았던 것 같다. 물론 program element 내에서 절대적으로 fault의 존재를 결정할 수 있고, input은 이를 발견할 수 있는 program path를 결정하는 역할이기 때문에 둘을 분리해서 생각하는 것이 크게 문제되지 않을 수도 있다. 하지만 실제 debugging practice를 생각해 보면, 우리가 이 input이 왜 문제가 될 수 있는지부터 생각하기 때문에, input 자체의 context와 faulty element의 location가 어떻게 correlated되어 있는지 판단할 수 있다면 좀더 효과적인 디버깅이 가능하겠다는 (약간 성급한) 결론이 났다.

### [1] Debugging Inputs

-   Target Problem: Fault가 program code가 아니라 input 자체에 있을 수도 있을까? specification에 포함되지 않는 invalid input이 바로 그런 예시일 것이다. 이 논문은 그런 corrupted data를 program이 processing할 수 있는 형태로 고치려는 시도에서 출발한다. Program analysis를 사용하지 않고

*   DDMax:

### [2] Which Variables Should I Log?

### [3] Boosting Automated Program Repair with Bug-Inducing Commits

### [4] Cooperative API Misuse Detection Using Correction Rules

### [5] Seenomaly: Vision-Based Linting of GUI Animation Effects Against Design-Don't Guidelines

### [6] Testing File System Implementations on Layered Models

## Defect Prediction

### [1] The Impact of Feature Reduction Techniques on Defect Prediction Models

### [2] The Impact of Correlated Metrics on the Interpretation of Defect Models

### [3] The Impact of Mislabeled Changes by SZZ on JIT Defect Prediction

### [4] Understanding the Automated Parameter Optimization on Transfer Learning for Cross-Project Defect Prediction: An Empirical Study

## Software Development

### [1] Improving the Pull Request Review Process Using Learning-to-rank Algorithms

### [2] A Tale from the Trenches: Cognitive Biases and Software Development

## Keynote: Formal Reasoning and the Hacker Way - Peter O'Hearn
