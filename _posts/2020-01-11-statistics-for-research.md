---
title: "연구를 위한 통계학"
tags: [statistics]
---

[번역] Statistics Tutorial

<!--more-->

원문: https://explorable.com/statistics-tutorial

> 이 통계학 튜토리얼은 여러분이 통계학의 핵심 개념과 이 개념들이 실제로 연구의 방법론적인 측면에 어떻게 적용되는지에 대해 안내합니다.

과학자들은 대부분 연구 결과를 분석하기 위해 통계를 사용합니다. 왜 연구자들은 통계를 사용할 수밖에 없을까요? 어떤 '현상'을 이해하기 위해서, 통계는 가설을 입증하거나 반박할 수 있는 유용한 도구가 됩니다. 대부분의 과학적 이론에 관한 지식을 얻는 방법으로써 통계는 사실 필수적입니다.

> 참고: [통계는 무엇인가?](https://explorable.com/what-is-statistics)

### 연구 데이터

먼저 연구의 재료가 되는 데이터를 어떻게 수집하고 사용하는지에 대해서부터 시작하겠습니다. 과학적 탐구[science investigation]의 결과는 보통, 아니 사실은 거의 대부분의 경우 연구자들이 필요로 하는 것보다 지나치게 많은 정보를 담고 있습니다. 이 데이터(재료)는 raw data, 즉 날것의 데이터로 불리죠. 이 데이터를 좀더 똑똑하게 분석하기 위해서, raw data는 결과 데이터로 가공됩니다. 데이터를 가공하기 위한 다양한 방법론들이 존재하지만, 기본적으로 raw data를 정리하고 구조화해서 목적에 부합하는 데이터로 재탄생시키는 과정으로 요약할 수 있습니다. 이렇게 구조화시킨 정보가 어떤 형식을 갖고 있든지간에 "data set"이라고 부를 수도 있겠지요.

데이터를 더 정확하고 깊이있게 분석하기 위해, 이 다음 단계에서 연구자들은 다양한 통계적 방법을 적용하게 됩니다. 각기 다른 연구의 특성에 따라 어떤 이는 descriptive statistics[기술 통계학: 우리가 수집한 데이터를 묘사하고 설명하는 기법]을 적용하고자 할 수도 있고, exploratory research[탐구적 리서치*: 어떤 문제에 대한 더 많은 정보를 수집하기 위해 또는 잠정적인 가설을 보다 구체적으로 만들기 위해 수행하는 리서치]에서 데이터셋에 대한 직관적인 아이디어를 얻기 위해 통계적 도구들을 바로 적용하기도 합니다.

> 참고: 기술 통계, 추리 통계 (https://drhongdatanote.tistory.com/25)

raw data를 보존해서 좋은 이유는 처음의 생각과 다르게 흘러간다고 생각한다면 다시 처음으로 돌아가 점검할 수 있다는 점입니다. 여러분이 결과를 이미 분석했을 때 이런 일들이 자주 일어나죠.

raw data는 실제로 어떤 현상이 일어나는지 더 명확하게 파악할 수 있기 때문에 새로운 가설에 대한 아이디어를 떠올릴 수 있게 합니다. 실험에 사용되는 변수(variable)를 조절한다면 '결론'이 영향을 받게 되겠죠. 통계학에서 parameter(인자)는 주어진 표본, 또는 이들의 한 면모를 특징지을 수 있는 양적인 수치를 일컫습니다.

> variable & parameter?

> 참고: third(confounding) variable: variables that the researcher failed to control, or eliminate, threating the internal validity of an experiment.

### 중심 경향(Central Tendency)과 정규분포(Normal Distribution)

이 부분에서는 '분포'와 중심 경향에 관해, 그리고 이들이 어떻게 실제로 데이터셋과 연관되는지에 대해 알아보겠습니다.

실제 세상에서 많은 데이터는 정규분포를 따릅니다. 정규분포는 전체 값의 중간에 더 많은 값들이 분포되는 frequency curve, 또는 frequency distribution을 일컫습니다. 많은 실험들이 정규분포추정에 기반하여 이루어집니다. 이러한 근본 가정이 결과에서 중심 경향, 평균, 중간값, 그리고 mode를 찾아내는 것이 중요한 이유입니다. 이 값들은 데이터의 전체적인 성질을 상당히 정확하게 설명할 수 있습니다. 특히 이 값들이 데이터가 어떻게 분포되어 있는지를 아는 상태에서 좀더 효과적입니다. 보통은 표준편차가 분포를 설명하기 위해 가장 자주, 간단하게 쓰입니다.

하지만 표준편차 외에도 variance, standard error of the mean, standard error of the estimate, 또는 range (데이터의 극단적인 값들을 설명해준다) 등의 값들을 통해 데이터의 분포를 다양한 측면에서 파악할 수 있습니다.

어떤 데이터를 정규분포로 나타낼 때, 여러분은 보통 충분히 큰 샘플의 산술평균을 사용하고, 표준편차를 구할 것입니다. 하지만, 우리가 알고자 하는 distribution이 애초에 정규분포에서 크게 벗어나 있는 경우, 또는 샘플에 우연히 outlier가 많이 포함되어 있는 경우나 측정 자체가 잘못된 경우 정규분포추정이 불가능합니다. 한 예시로 F-distribution의 경우 정규분포보다 훨씬 왼쪽으로 쏠려 있는 양상을 관찰할 수 있습니다.

![](https://t1.daumcdn.net/cfile/tistory/996757455C4E55380A)

그러므로 연구자들은 range, median, mode를 관찰해서 결과가 정규분포를 따르는지 재확인하게 됩니다. 만일 정규분포가 아니라면, 이것은 분석에 어떤 통계 검정 방법을 쓸지 결정하는 데에 큰 영향을 미치게 됩니다.

또다른 도구들: - [Quartile](https://explorable.com/quartile) - [Trimean](https://explorable.com/quartile)

### 가설 검정 - 통계학 튜토리얼

어떤 가설이 맞는지 틀렸는지 어떻게 알까?

[이것을 결정하기 위해 왜 통계학을 사용할까?](https://explorable.com/why-statistics-matter)

연구에서 통계학을 사용한다는 것은 단순히 식에 값을 대입해서 p-value를 구하고 통계 소프트웨어를 쓸 수 있게 되는 것 이상의 일입니다. 연구에 통계학을 적용하는 것은 기본적으로 다음과 같은 것들을 포함합니다:

    1. Learning basic statistics
    2. Understanding the relationship between probability and statistics
    3. Comprehension of the two major branches in statistics: descriptive statistics and inferential statistics
    4. Knowledge of how statistics relates to the scientific method

연구에서 통계학은 식과 계산에 관한 것만은 아닙니다. (여기에 대한 오해 때문에 기본적인 통계 개념을 이해하려 하지 않고 경솔하게 도출된 결론들이 난무합니다)

통계적 추정을 통해 우리는 전체 표본의 샘플으로부터 결론을 도출할 수 있습니다.

실험을 수행할 때에 결정적인 부분은 가설을 테스트(검정)하는 과정입니다. 이 통계 튜토리얼에서 가장 중요하게 다루는 부분이기도 합니다.

가설 검정은 대립가설(alternative hypothesis)과 귀무가설(null hypothesis)을 설정하는 것으로 시작됩니다. 귀무가설에 대해 반대되는 입장의 대립가설을 세우고, 주어진 증거를 통해 이를 기각하거나 채택하게 됩니다. 주어진 가설들은 그들 각각에 대해 '통계적으로' 검증됩니다.

연구자들은 신뢰구간(confidence interval)을 설정하게 되는데, 이 신뢰구간이 결과가 귀무가설을 지지하는지 대립가설을 지지하는지를 결정할 수 있는 경계를 결정합니다.

실험군과 대조군 사이의 모든 차이를 단순히 대립가설을 지지하는 증거로 받아들일 수는 없습니다. 대립가설을 채택하기 위해 이 결과는 통계적으로 유의한 차이를 보여야 합니다. 바로 유의 검정(significance test)이 필요한 이유입니다.

주의할 점은 data dredging, data snooping이나 이후에 대조 실험에서 가설 검증 없이 데이터 fishing(picking)을 하는 것은 진실과 아무런 관련이 없음에도 잘못 인과관계를 설정하는 결론에 도달할 수 있다는 것입니다.

가설의 내용에 따라, 여러분은 양측 검정 또는 단측 검정 중 하나의 방법을 고르게 됩니다.

대조군이 실험적 확률(experimental probability)로 대체될 때도 있습니다. 종종 어떤 연구가 윤리적으로 문제가 될 수 있는 현상을 다룰 때, 또는 실험을 위해 너무 큰 비용이나 시간이 소모될 때에 실제로 실험을 수행하는 것이 현실적으로 불가능하기 때문입니다. 이때 [true experimental design](https://explorable.com/true-experimental-design)는 [quasi-experimental approach](https://explorable.com/quasi-experimental-design)로 대체됩니다.

정확하게만 이루어진다면, 통계는 연구에 사용된 변수들의 인과관계를 파악하는 데에도 사용될 수 있습니다. 또한 [third variable](https://explorable.com/confounding-variables)을 알아내는 데에도 통계를 사용할 수 있는데, 반대로 통계를 사용해서 부정직한 의도로 third variable를 조작하거나 '가릴' 수도 있지만 말입니다.

통계를 잘못 사용하는 것은 꽤 흔하게 있는 일이며, 사람들이 어떤 결과를 가지고 다른 이들에게 영향력을 행사하려는 한 계속해서 발생할 것입니다. 실험 데이터에 대한 적절한 [statistical treatment](https://explorable.com/statistical-treatment-of-data)가 비윤리적인 통계학의 사용을 예방할 수 있습니다. [통계의 철학](https://explorable.com/philosophy-of-statistics)은 [statistical validity](https://explorable.com/statistical-validity)를 확인하고 통계에서의 윤리 강령을 수립하며 통계학을 적절히 사용하는 법에 대해 기술합니다.

### 신뢰도와 실험 오차

통계 검정은 샘플로부터 추출한 데이터를 사용합니다. 이후에 이 결과는 전체 표본에 대한 것으로 일반화됩니다. 하지만 우리는 이 결과가 옳은 결론을 반영하는지 어떻게 알 수 있을까요?

어떤 사람들의 믿음과는 반대로, 연구에서 발생하는 오차는 유의성 검정(significance testing)의 필수적인 부분입니다. 아이러니하게도 오차 발생의 가능성은 연구 자체를 과학적으로 만드는 중요한 요인입니다. 만일 어떤 가설이 아예 부정될 수 없다면, 이것은 검증 가능(testable)하지 않고 그러므로 과학적이지도 않습니다. (정의에 의해)

만일 어떤 가설이 검증 가능하다면 이것은 잘못되었을 가능성도 지니고 있는 것입니다. 여기에는 랜덤 오차 또는 연구 자체의 특성에 따른 문제들을 포함한 실험 오차가 포함됩니다. 실험 오차는 Type-1 error와 Type-2 error로 나뉘어질 수 있고, ROC Curve는 true positive와 false positive에 대한 민감도를 확인하는 데에 사용할 수 있습니다. ([참고](https://nittaku.tistory.com/297))

통계적 검증력 분석은 귀무가설을 기각하기 위한 p-value를 얻기 위해 필요한 샘플의 수를 결정하기 위해 사용됩니다.

오차의 범위는 신뢰구간(confidence interval)과도 연관되어 있으며 통계적 유의성, 샘플 사이즈와 예측 결과 사이의 관계에도 영향을 미칩니다. 효과 크기(effect size: ES)는 표본에서 두 변수 사이의 상관관계의 정도를 측정합니다. 결과를 전체 표본으로 일반화시키기위해 필요한 샘플링 사이즈를 결정하는 데에 이 수치가 도움을 줍니다.

연구 결과가 일반적으로 적용될 수 있는 것인지 또는 랜덤한 '아웃라이어 실험' 때문인지를 확인하기 위해 다른 이들에 의해 연구를 재현할 수 있어야 합니다. 연구 재현은 [random error](https://explorable.com/random-error)와 [systematic error](https://explorable.com/systematic-error)를 모두 찾아낼 수 있습니다.

[크론바흐 알파](https://explorable.com/cronbachs-alpha)는 내적일관성(internal consistency)과 테스트 스코어의 신뢰도를 측정하는 데에 사용됩ㄴ다.

실험, 혹은 연구를 재현하는 것은 결과의 신뢰성을 통계적으로 확신할 수 있도록 해 줍니다. (실험을 여러 번 수행해서 outlier가 없음을 통계적으로 확인합니다.)

결과에 아웃라이어가 포함될 때 흔한 경우는 [평균으로의 회귀](https://explorable.com/regression-to-the-mean)가 발생하는 것이다. 이때 실험군과 대조군 사이의 결과에 통계적으로 유의한 차이가 존재하지 않게 된다.

### 통계적 검정

연구에 주로 쓰이는 몇 가지 통계 검정, 혹은 통계적 기법들을 소개합니다.

#### 변수들 간 관계

과학자들에게 변수들 간의 관계를 알아내는 것은 매우 중요합니다. 이는 그들이 연구하는 분야의 본질을 이해하는 데에 도움을 줄 수 있습니다. 선형관계(linear relationship)는 두 변수가 비례하여 증가하거나 감소하는 경우입니다. 비선형관계(non-linear relationship)는 변수들이 비례하거나 같은 비율로 움직이지 않는 경우입니다. 상관관계는 두 데이터셋이나 변수들 사이의 관계를 표현하는 또다른 도구입니다.

측정 척도(https://explorable.com/measurement-scales)는 변수들을 분류하거나, (가능하다면) 값을 정량화하는 데에 사용됩니다.

[피어슨 상관 계수](https://explorable.com/pearson-product-moment-correlation)는 두 변수 사이의 선형관계를 표현하는 데에만 사용됩니다. [스피어만 상관 계수](https://explorable.com/spearman-rank-correlation-coefficient)는 순서가 있는 변수들의 선형 관계에 보통 쓰입니다. [켄달의 타우 계수](http://www.cbgstat.com/method_Spearman_correlation_analysis/Spearman_correlation_analysis.php)는 비선형관계를 측정하는 데에 사용될 수 있습니다.

- 상관 계수에 대한 설명(참고): https://mansoostat.tistory.com/115

#### 예측

예측의 목적은 원인을 파악하는 것입니다. [상관관계는 반드시 인과관계를 의미하지는 않습니다.](https://explorable.com/correlation-and-causation) 선형회귀에서 여러분은 종종 [독립변수(manipulated variable)](https://www.statisticshowto.datasciencecentral.com/manipulated-variable/)를 측정하게 됩니다. 상관관계와 선형회귀 간의 차이는 무엇일까요? 기본적으로 상관관계 연구는 변수 사이의 연관도를 확인하는 반면 선형 회귀는 그래프에서 가장 적합한 라인을 찾는 과정입니다.

회귀분석과 다른 모델링 도구에는 다음과 같은 것들이 있습니다:

- [Linear Regression](https://explorable.com/linear-regression-analysis)
- [Multiple Regression](https://explorable.com/multiple-regression-analysis)
- Path Analysis (extension of the regression model)
- [Factor Analysis](https://explorable.com/factor-analysis) (attempting to uncover underlying factors of something)
- [Meta-Analysis](https://explorable.com/meta-analysis) (using effect size(ES))

[베이지안 확률](https://explorable.com/bayesian-probability)은 상호작용을 기반으로 미래의 사건의 가능성을 예측하는 방식입니다. (측정을 시작하고 이후에 결과나 예측을 얻는 방식이 아닌)

#### 가설을 통계적으로 검정하기

[스튜던트의 T 검정](https://explorable.com/students-t-test)은 귀무가설이 옳은지 아닌지를 나타낼 수 있는 검정입니다. 연구에서 이는 실험군과 대조군과 같은 두 그룹 사이의 유의미한 차이를 검정하기 위해 사용됩니다.

T 검정은 데이터가 정규분포를 따르고 분산이 동일하다고 가정합니다. (이는 [F-test](https://explorable.com/f-test)로 측정 가능합니다.)

T 검정의 종류:

- Independent One-Sample T-Test(https://explorable.com/independent-one-sample-t-test)
- Independent Two-Sample T-Test(https://explorable.com/independent-two-sample-t-test)
- Dependent T-Test for Paired Samples(https://explorable.com/dependent-t-test-for-paired-samples)

[Wilcoxon Signed Rank Test](https://explorable.com/wilcoxon-signed-rank-test)는 비모수(non-parametric: 모집단의 분포를 가정하지 않는다) 데이터에 사용될 수 있습니다.

[Z 검정](https://explorable.com/z-test)은 T 검정과 비슷하지만, 30 아래의 샘플 사이즈에는 잘 사용되지 않습니다.

[카이제곱 검정](https://explorable.com/chi-square-test)은 데이터가 정량적이라기보단 정성적일 때 사용됩니다.

#### 셋 이상의 그룹을 비교할 때

[ANOVA](https://explorable.com/anova), 분산 분석(Analysis of Variance)는 그룹들 사이에 서로 다른 평균치보다는 서로 다른 가변성이 있는지를 검정할 때 사용됩니다. 분산 분석은 둘보다 많은 그룹일 때에도 적용될 수 있습니다. F 분포는 ANOVA의 p-value를 계산할 때 사용됩니다.

- 참고: [위키피디아: 분산 분석](https://ko.wikipedia.org/wiki/%EB%B6%84%EC%82%B0_%EB%B6%84%EC%84%9D)

#### 비모수 통계학

비모수 통계학을 사용하는 보편적인 방법

- [Cohen's Kappa](https://explorable.com/cohens-kappa)
- [Mann-Whitney U-test](https://explorable.com/mann-whitney-u-test)
- [Spearman's Rank Correlation Coefficient](https://explorable.com/spearman-rank-correlation-coefficient)

#### 또다른 통계학의 주요한 용어

- [이산 변수(Discrete Variables)](https://explorable.com/discrete-variables)

> Full Reference:
> Oskar Blakstad (Feb 13, 2008). Statistics Tutorial. Retrieved Jan 21, 2020 from Explorable.com: https://explorable.com/statistics-tutorial
