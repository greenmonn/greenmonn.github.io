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

-   Target Problem: Fault가 program code가 아니라 input 자체에 있을 수도 있을까? specification에 포함되지 않는 invalid input이 바로 그런 예시일 것이다. 이 논문은 그런 corrupted data를 program이 processing할 수 있는 형태로 고치려는 시도에서 출발한다. Program analysis를 사용하지 않고 black-box approach로 input repair을 접근했다는 점이 독창적인데, delta debugging에서 착안하여 (방식은 같지만 목적은 반대) invalid input fragment를 빠르게 찾아내고 동시에 content를 최대한 보존하는 input을 만들어내는 것이다. 이러한 approach를 delta debugging(ddmin)의 반대인 `ddmax`라고 이름붙였다.

- Invalid input in the wild: 실제로 JSON, Wave. OBJ 파일이나 DOT 파일을 input으로 사용하는 경우에서, input 자체가 문제가 되는 경우가 얼마나 있는지 확인하기 위한 empirical study를 먼저 진행했다. 제시한 경우들을 보면 input 자체가 따라야 할 Grammar이 있는 형태들인데, lexical 버전의 ddmax의 경우에는 input의 grammar check를 하지 않고 단지 program exit status만을 feedback으로 활용하여 passing input의 maximum subset을 찾는다. (그런데 논문에는 `ANTLER` 자체에서 제공하는 `error recovery strategy`를 활용한다고는 되어 있다. 그러고 나서 edit distance 등으로 원래의 failing input과 얼마나 다른지를 계산한다고 하는데..) syntactic ddmax (like tree delta debugging)의 경우에는 `ANTLR`을 이용하여 input의 초기 AST 상태를 파싱하기는 하지만, 여전히 repair 과정에서 Grammar에 대한 정보를 사용하지는 않는다.

- Lexical Repair vs. Syntactic Repair
Lexical Repair은 input을 단순히 sequence로 보고 나누는 반ㅁ년, Syntactic Repair은 기본적으로 input을 structure로 파싱해서 tree 단위로 delta debugging scheme을 적용한다.

- Evaluation: 실제로 ddmax가 얼마나 input을 많이 고칠 수 있었는지에 대해서는, real-world crawling example과 이들에 mutation을 해서 만들어낸 추가적인 데이터에 대해서 실험했다. syntatic하게 input의 AST를 만들어서 repair를 수행한 버전이 가장 좋은 repair 성능을 보였다. (더 많은 passing input을 generate하기도 했고, 만들어진 data의 loss 측면에서도 더 좋았다)


모든 실험이 아마도 저자의 노트북일 Lenovo Thinkpad에서 이뤄졌다고 하는데, 생각보다 소박한 시스템(?)이라 인상에 남는다. 재택 근무 중이셨을까 (...)

### [2] Which Variables Should I Log?

Logging할 때 어떤 variable을 tracking할 지 추천해 준다면 어떨까? logging할 때 한 가지 variable에 대해서만 생각하느라 자주 log statement를 수정하는 나로써는 굉장히 흥미가 당기는 질문이었다. 이미 존재하는 logging statement를 재료로 새로운 log statement를 추천해 줄 수 있지 않을까? 하지만 이러한 prediction task가 쉽지는 않다. 두 가지 이유 때문인데, 1) different labels: 서로 다른 logging statement마다 타겟으로 하는 variable이 다르고, 그에 해당하는 label도 다를 수밖에 없다. 2) OOV words: program token, identifier들은 단순히 natural language의 vocabulary와는 다르다. 수많은 가능한 단어들이 존재한다.

이러한 두 가지 challenge를 극복하고자 multi-label classification problem 대신 representation learning problem으로 접근한다. logging statement 주변의 코드 snippet을 RNN encoder에 통과시켜서 적절한 representation을 배우도록 하고, 두 번째 단계로 이 representation을 binary classifier에 통과시켜서 (로깅할지, 말지) 둘 중 하나를 선택하게 하는 것이다. 직관적으로 보면 각 token이 해당 프로그램 스니펫에서 어떤 역할을 하는지를 먼저 representation으로 배운 다음에, 이렇게 정제된 정보 위에서 logging을 해야 할지 말지에 대한 classification을 수행한다는 아이디어가 representation의 활용을 현명하게 한 예시(?) 같아서 굉장히 마음에 들었다.

* novel method for mapping program tokens into word embeddings: making use of pretrained word embeddings of natural language tokens - 아직 이 과정에 어떤 novelty가 있는지 깊게 살펴보지는 못했지만, 역할을 표현하는 데에 natural language token이 과연 필요할까? 에 대한 의문이 들었다. 내가 생각한 방향과 논문이 생각한 방향을 비교해 볼 것.
 
* representation learning: 학습 데이터가 굉장히 복잡하고 큰 dimension을 가지고 있더라도 깊고 방대한 neural network를 통해 데이터의 선형 분리가 가능한 형태의 representation을 도출할 수 있다는 것.

### [3] Boosting Automated Program Repair with Bug-Inducing Commits

(NIER: New Ideas and Emerging Results)
이전에 Historial Spectrum based Fault Localization의 저자인 Ming Wen 씨가 APR에 대해서도 멋진 아이디어를 꺼내놓았다.

search-based patch generation에서는 ingredient space와 mutation operator를 어떻게 정의하는지에 대한 결정을 통해 search space가 정의된다. 

지금까지 해당 프로젝트 자체의 history에서 생성된 patch와 다른 프로젝트들에서 수집된 patch들의 fixing pattern들을 학습하여 이들을 정의하는 방법들이 제시되었지만, 여기서는 버그가 어떻게 'fix'되었는지가 아니라 bug가 어떻게 'introduced'되었는지를, bug-inducing commit의 정보를 통해 학습하는 것이 효과적이라는 것을 보인다. preliminary approach는 bug-inducing commit으로부터 도출된 fixing ingrediant와 mutation operator들을 사용하여 APR을 수행한 결과 기존 테크닉들이 고치지 못한 11개의 버그에 대한 패치를 새롭게 찾아냈다고 한다. NIER 트랙으로 paper가 공개되어 있지 않아서 테크니컬한 detail은 알 수 없어 아쉬웠다. 실제로 bug-inducing commit으로부터 ingrediant와 mutation operator를 어떻게 만들어낼 수 있는지에 대한 과정을 명확하게 알고 싶다.

### [4] Cooperative API Misuse Detection Using Correction Rules

마찬가지로 NIER 트랙에 소개된 논문인데, API misuse로 인한 bug를 특정한 대상으로 삼은 것에 관심이 갔다. API usage에 대한 specification을 infer하고 misuse를 detect하고자 하는 기존의 테크닉들은 여전히 큰 false-positive rate 때문에 상용화하기에는 무리가 있는 단계다. 이 논문에서는 개발자들이 manual하게 detect하고 fix한 해당 API misuse에 대해서 **correction rule**을 infer 하고, 다른 프로젝트에서도 동일하게 해당 API를 쓰는 경우에 대해 적용할 수 있도록 한다. knowledge transfer의 관점에서, 여러 프로젝트에서 공통으로 사용되는 API misuse에 대한 버그를 접근한다는 점에서 의미있는 방향인 것 같았는데, correction rule이 얼마나 general한지 (어떤 형태일까? 단순한 patch일까? 아니면 patch의 template일까?), 어떻게 이 rule을 infer할 수 있는지 (learning-based patch generation 처럼 seq2seq model이나 predefined rule에 대한 classification일까?)가 더 궁금했다.


### [5] Seenomaly: Vision-Based Linting of GUI Animation Effects Against Design-Don't Guidelines

Linting의 범위를 GUI Animation으로 확장했다는 점에서, 꽤 명확하고 재미있는 접근이라고 생각했다. card movement, menu slide in/out, snackbar display 등등 이렇게 말하면 안 와닿을 수도 있지만, 프레젠테이션에서 모아놓고 보니 평소에 `아 올드하다.. 정신없다..` 라고 생각했던 각종 안티패턴들을 쉽게 떠올릴 수 있었다. 놀랍게도 `제발 이렇게 만들지는 마!!` 라고 되어 있는 Don't guideline이 따로 있다고 한다. ([Android Material Design Guideline](https://material.io/design/introduction/)) 이것만으로는 데이터가 부족하기 때문에 VAE(Variational AutoEncoder)와 GAN을 함께 사용하여 다양한 don't example들을 synthesize했다. 여기서는 linting을 위한 실제 classification task에 집중하기보다는 unlabelled GUI animation을 grouping하여 dataset을 만들어내는 것에 집중했다.  

* GUI Animation features: vision-based feature extractor를 사용하여 unlabelled GUI animation들에 대한 temporal-spatial feature를 훈련시킨다. 이 과정은 unsupervised로 이뤄진다. 그리고 이렇게 학습된 feature들을 바탕으로 명확한 don't guideline의 경우, 그리고 이들의 linted 버전을 feature space에 위치시킨 후 KNN classification을 수행하게 된다. 즉, 타겟 애니메이션의 k-nearest neighbors중 몇 개가 don't guideline에 속하는지 아닌지를 판단하여 classification을 수행하게 된다. 

* Comment: 최근에 Code Reusability에 대한 문제를 건드려 보고 싶어서, application의 실제 internal logic과 연관되는 GUI component를 추출하는 것에 대해 program slicing 측면으로 생각을 했었다. 여기서는 linting의 측면에서 GUI animation의 특성을 classify하는 문제이기 때문에 내가 생각하던 target problem과는 조금 다르지만, GUI component의 visual semantic을 feature extractor로 뽑아내고 clustering을 수행하는 아이디어에서 어느 정도 영감을 받을 수 있을 것 같다. 

### [6] Testing File System Implementations on Layered Models
갑작스레 GUI에서 low level로 내려와 system call sequence에 대해서 논의하게 되었다. (나의 관심사란 대체 무엇인가..) 파일 시스템을 테스트하기 위해 다양한 system call sequence를 input으로 robustness를 평가할 수 있을 것이다. (이런 점에서는 GUI를 테스트 하기 위해 event sequence를 generate하는 것과 동일하다) 

이 연구는 파일 시스템과 같이 여러 layer로 분리된 복잡한 전체 시스템을 테스트하고자 한다. `layered model checking`이라고 이름붙인 이 개념은 먼저 전체 abstract한 모 델에 대한 abstract workload를 먼저 생성하고 layer by layer로 이를 concrete한 system call sequence로 확정하는 단계를 거친다. 



## Defect Prediction

### [1] The Impact of Mislabeled Changes by SZZ on JIT Defect Prediction

* JIT defect prediction: 어떤 change가 일어났을 때 바로, 이 change가 defect를 내포할 수 있는지 바로 판단할 수 있다면 얼마나 좋을까?

그러기 위해 먼저 어떤 bug의 원인이 되는 change가 어떤 commit에서부터 비롯되는지 알아야 할 필요가 있다. (bug-inducing commit) 기존에 제안된 SZZ algorithm(bug-fixing commit의 changed line에서부터 candidate commits들을 observe하는 방식)에 많은 noise가 있음이 밝혀졌고 SZZ algorithm으로 만들어진 데이터를 JIT defect prediction model을 train할 때 사용하는 것은 결국 모델 자체의 부정확성에 큰 영향을 미칠 것이다.

이 연구에서는 이렇게 mislabeled bug-inducing change들이 실제 JIT defect prediction model의 성능에 얼마나 큰 영향을 미치는지를 확인한다.

4가지의 SZZ variant (B-SZZ, AG-SZZ, MA-SZZ, and RA-SZZ)에 대해서 evaluation을 수행하는데, 그 결과 RA-SZZ가 가장 mislabeled change를 적게 만들었다고 한다. 

실제로 Defect Prediction Model에 들어가는 feature 중 중요하게 작용하는 것이 한 change에서 변경된 파일의 갯수와 같은 statistical한 metric인데, 이런 것들은 SZZ algorithm의 mislabeling으로부터 만들어진 noise에 크게 영향을 받지 않았다고 한다. 하지만 그 다음으로 중요한 metric에 대해서는 noise의 영향을 어느 정도 받았다고 한다.


### [2] Understanding the Automated Parameter Optimization on Transfer Learning for Cross-Project Defect Prediction: An Empirical Study

## Software Development

### [1] Improving the Pull Request Review Process Using Learning-to-rank Algorithms

개인적으로 Review process가 협업을 중심으로 한 소프트웨어 개발 사이클에서 굉장히 중요한 역할을 차지한다고 생각한다. 하지만 막상 내가 리뷰어가 되어서 누군가의 코드 리뷰를 하기란 굉장히 귀찮은 일(...)이 되고 만다. 

결국 리뷰의 결과는 이 Pull Request를 Merge할지, 말지가 되는 것인데 단순히 이를 binary classification 문제로 본다면, 잘못된 prediction으로 인한 cost도 굉장히 클 것이고, 여기서 소개하는 연구는 현재 열려있는 전체 pull request들에 ranking을 매기고자 한다. (가장 빨리 리뷰할 수 있는 것부터 추천) 이렇게 Learning-to-Rank 모델을 이용해서 기존의 classification 기반 decision prediction을 보완할 수 있을 것이다.

LtR 모델에 들어가는 metric들은 총 18가지인데, Source Code Metrics, Textual Information Metrics, Contributor's Experience Metrics 등이 있다.

* 기존의 LtR 알고리즘들: ListNet, RankNet, MART, random forest
### [2] A Tale from the Trenches: Cognitive Biases and Software Development

## Keynote: Formal Reasoning and the Hacker Way - Peter O'Hearn
