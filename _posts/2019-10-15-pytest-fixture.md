---
title: 'PyTest Fixture 사용하기'
tags: [python]
---

Fixture를 통해 PyTest를 좀더 효율적으로 사용해보자

<!--more-->

Java에 XUnit이 있다면 Python에는 PyTest가 존재한다. 혹시나 PyTest를 사용해 보지 않은 분들이 있다면,

```
pip install pytest
pip install pytest-watch
```

이 두가지 커맨드만으로 손쉽게 테스트 환경을 구축할 수 있으니 꼭 시도해 보길 바란다 :)

함수 이름의 앞부분에 prefix로 `test_`를 넣어주고 `assert` 내장 함수로 원하는 조건이 만족했는지 확인하는 테스트를 작성하면 가장 단순한 형태의 파이썬 테스트가 완성된다.

예시로 Deep Reinforcement Learning(딥러닝을 활용하는 강화학습)에서 Trajectory라는 데이터 구조를 테스트하는 코드를 가져와보았다.

Trajectory는 시간에 따른 State, Action, Reward의 '궤적'을 기록하여 추후 딥러닝 모델의 input으로 사용될 수 있도록 기록한다. 여기서는 간단히 Trajectory가 올바른 리워드의 Discounted Sum을 반환하는지 체크한다.

```python
def test_trajectory_discount():
    # Create random rewards
    reward_mean = 1.5
    reward_std = 1.0

    len_trajectory = 20

    rewards = np.random.normal(
        loc=reward_mean, scale=reward_std, size=len_trajectory)

    # create Trajectory & append (s, a, r)
    trajectory = Trajectory(gamma=gamma)

    for reward in rewards:
        state = None
        action = None
        trajectory.append_sample(state, action, reward)

    '''
    Setup Finished
    '''

    # Compute returns
    trajectory.compute_return()
    returns = trajectory.returns

    for i in range(len(returns)):
        # Compute discounted sum
        discounted_sum = 0
        for t, test_reward in enumerate(rewards[i:]):
            discounted_sum += (gamma ** t) * test_reward

        significant_digit = 8

        discounted_sum = np.round(discounted_sum, significant_digit)
        return_i = np.round(returns[i], significant_digit)

        assert discounted_sum == return_i
```

원하는 동작은 구현했지만, 테스트 코드가 너무 길어서 테스트하고자 하는 기능을 잘 표현하지 못하는 것 같다.

잘 살펴보면, 함수의 반을 차지하는 코드가 테스트하고자 하는 Trajectory를 생성하는 부분이다. 만일, Trajectory에 대한 다른 테스트를 작성하고자 한다면(ex. 특정 time의 reward를 확인, 또는 action이나 state를 확인) 같은 방식으로 Trajectory를 생성하게 될 것이고, 중복이 생길 것이다.

이 문제를 해결할 수 있는 것이 **Test Fixture**이다.

Test Fixture의 목적은 반복적으로 실행되는 테스팅에서 '고정된 기반'을 만들어주는 것이다.

위의 코드를 Fixture를 활용해서 정리해보자.

```python
@pytest.fixture(scope="session")
def trajectory(rewards):
    reward_mean = 1.5
    reward_std = 1.0

    len_trajectory = 20

    rewards = np.random.normal(
        loc=reward_mean, scale=reward_std, size=len_trajectory)

    trajectory = Trajectory(gamma=gamma)

    for reward in rewards:
        state = None
        action = None
        trajectory.append_sample(state, action, reward)

    return trajectory
```

이렇게 `trajectory`라는 Fixture를 작성하면, 실제 테스트 코드는 아래와 같게 된다.

```python
def test_trajectory_discount(rewards, trajectory):
    trajectory.compute_return()
    returns = trajectory.returns

    for i in range(len(returns)):
        # Compute discounted sum
        discounted_sum = 0
        for t, test_reward in enumerate(rewards[i:]):
            discounted_sum += (gamma ** t) * test_reward

        significant_digit = 8

        discounted_sum = np.round(discounted_sum, significant_digit)
        return_i = np.round(returns[i], significant_digit)

        assert discounted_sum == return_i
```

아직 test oracle의 길이가 지나치게 길어 보이기는 하지만, trajectory의 `compute_return` 함수를 테스트하려는 의도는 좀더 명확해졌다.

`@pytest.fixture(scope="session")`라는 decorator이 붙은 fixture 함수를 작성하고, test 함수의 인자로 fixture의 이름을 넣어주면 함수의 리턴값을 갖고 테스트가 시작하게 된다.

scope는 `package`, `module`, `session`, `class`, `function` 중 하나를 선택할 수 있는데, 아무것도 설정하지 않으면 기본적으로 function 단위로 실행된다. session 단위로 실행하면 test session 동안 fixture는 한 번만 생성되고 계속 재사용된다.

## Reference

-   https://docs.pytest.org/en/latest/fixture.html
-   https://b.luavis.kr/python/python-pytest-fixture
