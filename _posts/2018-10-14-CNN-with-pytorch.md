---
title: 'PyTorch로 구현하는 CNN'
tags: [deep-learning]
---

PyTorch로 구현하는 CNN: Channel, Filter, Batch Normalization을 중심으로

<!--more-->

## CNN: Convolutional Neural Network

Convolution을 활용하여 데이터의 공간적 정보를 유지한 상태로 다음 레이어로 보낼 수 있다.
일반적인 MLP와 입력층, 중간층, 출력층으로 구성되어 있고, Layer와 Layer 사이에만 노드 간 결합이 존재한다는 점에서 비슷하다.

그러나 중간층이 Convolutional Layer, Pooling Layer, Fully-connected Layer라는 3종류의 Layer로 이루어진다는 점이 다르다. PyTorch에서 실제 CNN의 기본적인 구조를 구성해보면서, Filter, Channel 등의 단위가 어떻게 표현되는지 알아보고자 한다.

또한 Batch Normalization을 CNN에 적용해 보고자 한다.

## Predefined CNN Modules in PyTorch

```
torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding)
torch.nn.relu(x)
torch.nn.MaxPool2d(kernel_size, stride, padding)
torch.nn.Linear(in_features, out_features)
```

### Convolutional Layer

-   참고: 2D Convolutional Layer의 low-level 구현 (with numpy): [http://machinelearninguru.com/computer_vision/basics/convolution/convolution_layer.html](http://machinelearninguru.com/computer_vision/basics/convolution/convolution_layer.html)

*   'convolution'의 intuitive explanation) target image에 대해 움직이는 window, 혹은 filter가 공간적으로 correlated된 데이터들에서 특정 Feature를 뽑아내는 것.

*   Input Image \* Feature Detector(Filter or Kernel) => Feature Map (=Activation Map)

![(출처: https://pythonkim.tistory.com/52?category=573319)](https://t1.daumcdn.net/cfile/tistory/2515E24F57AB461919)

-   Image input에 filter를 적용해서 각각 나온 결과가 새로운 channel이 된다. Convolutional Layer를 거쳐 더 많은 channel이 만들어진다.

-   Multiple Output Channels: 실제 CNN의 효과적인 아키텍처를 구성하기 위해서는 output channel이 하나가 아닌 여러 개로 구성되어야 한다. 한 가지 feature에 해당하는 channel을 여러 개 구성할 수도 있지만, 실제 구현에서는 생성된 channel 모두를 cross-correlation operation을 통해 합쳐서 사용한다. [(더 자세히)](https://www.d2l.ai/chapter_convolutional-neural-networks/channels.html#multiple-output-channels)

### Pooling Layer

### Fully Connected Layer

```python
class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Sequential(
            nn.Conv2d(in_channels=1, out_channels=32, kernel_size=5, stride=1, padding=2)
            nn.ReLU()
            nn.MaxPool2d(kernel_size=2, stride=5))

        self.layer2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=5, stride=1, padding=2)
            nn.ReLU()
            nn.MaxPool2d(kernel_size=2, stride=2))

        self.dropout = nn.dropout()

        self.fc1 = nn.Linear(7 * 7 * 64, 1000)
        self.fc2 = nn.Linear(1000, 10)
```

## Batch Normalization for CNN

![](https://www.dropbox.com/s/m7uwutovp60w69s/Screen%20Shot%202019-10-14%20at%203.00.54%20PM.png?raw=1)
