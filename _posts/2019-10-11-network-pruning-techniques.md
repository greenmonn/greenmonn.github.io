---
title: 'Network Pruning 기법 분류'
tags: [deep-learning, CNN]
---

다양한 Network Pruning 기법들을 정리해보았다.
(Characteristics of Pruning Algorithms)

<!--more-->

ICLR 2019 Paper중 하나인 Rethinking the Value of Network Pruning에서 Network Pruning을 위해 지금까지 제안된 기법들을 분류하고, 지금껏 큰 의미 없이 통용되던 믿음에 대해 다시 한번 물음을 던지고 있다.

즉, Pruning 이전의 네트워크가 갖고 있는 weight들을 보존하는 것이 더 나을 것으로 기대되었지만, 실험 결과 큰 이점이 없었고, Prunedㄲㄷ Network를 랜덤하게 초기화하여 트레이닝한 결과가 더 높은 accuracy를 보여주었다는 내용이다.

이 논문에서 비교 대상이 된 Technique에 관해 먼저 정리하고, 실험 결과를 통해 어떤 Finding이 있었는지 알아보고자 한다.

## Structured Pruning과 Unstructured Pruning

-   Individual Weight Pruning (Unstructured):
    -   pruning weights based on the Hessian of the loss function
    -   pruning small magnitude of weights -> incorporated into "Deep Compression" pipeline to obtain highly compressed models
    -   (Srinivas & Babu) Remove redundant neurons iteravely
    -   Variational Dropout
    -   Learns sparse networks through L0-norm regularization based on _stochastic gate_

> Drawback: resulting weight matrices are **sparse**, which cannot lead to compression and speedup without dedicated hardware/libraries

> Structured pruning methods: level of channels, layers
>
> -   No dedicated hardware/libraries are required to realize the benefits
> -   즉, pruning을 하는 즉시 network size를 줄일 수 있다.

-   Channel Pruning (Structured)
    -   heuristic methods include pruning channels based on their corresponding filter weight norm / average percentage of zeros in the output
    -   use group sparsity
    -   minimizes next layer's _feature reconstruction error_ to determine which channels to keep
    -   minimizes the reconstruction error of the "final response layer" / "importance score" for each channels
    -   Taylor expansion to approximate each channel's influence over a "final loss" and prune accordingly.
    -   "intrinsic correlation" within each layer and prune redundant channels
    -   layer-wise compensate filter pruning algorithm (improve common heuristic pruning metrics)

## Network Pruning Techniques (for CNN)

### Predefined Structured Pruning

-   L1-norm based Filter Pruning

    -   Target: A certain percentage of filters with smaller L1-norm

-   ThiNet

    -   Target: The channel that has the smallest effect on the next layer's activation values

-   Regression based Feature Reconstruction
    -   Target: The channels that doesn't affect much on feature map reconstruction error
    -   Optimization: minimizing feature map reconstruction error: by [LASSO regression](https://bskyvision.com/193)
        -   정확히 LASSO regression을 optimization에 어떻게 사용하는 것인지?

### Automatic Structured Pruning

-   Network Slimming
    -   Target: channels with lower **scaling factors**
    -   imposes L1-sparsity on **channel-wise scaling factors** from Batch Normalization layers during training
    -   produces automatically discovered target architectures

*   Sparse Structure Selection
    -   Target: structures by sparsified scaling factors (generalization of network slimming)
    -   Pruning Unit: residual blocks (in ResNet), groups (in ResNeXt), rather than channels

### Unstructured Magnitude-based Pruning

    - Target: weights in convolutional layers (Han et al., 2015)
    - can also be treated as automatically discovering architectures

## Findings

-   지금껏 pruned architecture에서 원래의 network로부터 inherit된 weight를 보존하는 것이 중요하다고 생각되었지만, 특정 structure에 기반한 Pruning 방법들은 random weight로 초기화해도 Pruning의 효과는 변화하지 않았다. 그러므로, Pruning의 결과로 나온 Network의 Architecture(Connection이 아니라)가 실제로 Pruning의 이점을 가져다주는 것으로 생각할 수 있다.

-   Guided Architecture from Pruned models

    -   Guided Pruning: 이미 prune된 architecture들로부터 각 layer stage(layers with the same feature map size)에 존재하는 channel의 평균 갯수를 통해 새로운 architecture set을 생성하는 테크닉

    -   Guided Sparsification: Pruned architecture들로부터 sparsity pattern을 관찰하고 새로운 sparse model들을 생성하는 데 적용한다.

    -   관찰된 Guided Design Pattern을 비슷한 Dataset에 이식(transfer)했을 때 그 dataset으로 직접 pruning해서 만들어진 것과 비슷한 성능을 보인다. 비록 특정 network에서 직접 pruning된 것보다는 덜 효과적이지만, Uniform pruning/sparsification을 적용한 것보다 확연히 좋은 성능을 보였다.
