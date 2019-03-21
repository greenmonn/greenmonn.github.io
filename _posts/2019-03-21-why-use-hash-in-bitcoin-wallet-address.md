---
title: "Bitcoin 지갑 주소에 Hash를 사용하는 이유"
tags: [blockchain, bitcoin]
---

Bitcoin 지갑 주소 생성 과정: 암호화 알고리즘과 Hash Function을 중심으로

<!--more-->

## Bitcoin Wallet Program

Bitcoin의 지갑 주소는 어떻게 생성될까? 비트코인 상에서(물론 다른 암호화폐의 경우에도) 우리는 지갑 주소를 통해 거래를 한다. 송금할 대상의 지갑 주소를 알고 있다면 언제든 그 주소로 자신이 갖고 있는 암호화폐를 보낼 수 있다. 

시작하기 전에, Bitcoin에서 정의하는 '지갑'이 어떤 의미인지 좀더 명확하게 살펴보자.

> A Bitcoin wallet can refer to either **a wallet program or a wallet file**. Wallet programs create public keys to receive satoshis and use the corresponding private keys to spend those satoshis. Wallet files store private keys and (optionally) other information related to transactions for the wallet program. 
> (reference: [Bitcoin Developer's Guide](https://bitcoin.org/en/developer-guide#wallets))

Bitcoin은 지갑을 Program과 File로 설명한다. 지갑 프로그램이 하는 일은 다음과 같다. 
1. BTC를 송금받을 수 있는 '주소'를 생성한다.
2. 송금받은 BTC를 사용할 수 있는'key'를 저장한다.

거래를 위해서는 사용자가 소유할 수 있는 고유한 번호가 필요하다. 은행의 계좌번호처럼 말이다. 또 내 계좌에 있는 돈을 출금하거나 직접 '사용'하려면 스스로를 인증해야 한다. 나만 알고 있는 비밀번호를 입력한다거나, 보안카드의 랜덤한 위치에 있는 숫자를 입력한다거나, 또는 공인인증서(...)를 사용해서 복잡한 과정을 거치는 것도 이러한 인증 과정에 해당한다. Bitcoin에서는 비대칭키 알고리즘 중 하나인 '타원 곡선 알고리즘(ECDSA)'을 사용해서 이러한 인증 과정을 굉장히 단순화시켰다. 계좌번호에 Public key에 해당하는 값을 할당하고, 인증을 위해서는 Wallet File에 저장된 Private key를 사용한다. 그러므로 내 Public key로 보내진 BTC들은 내 Private key만 알고 있다면 사용할 수 있게 되는 것이다. 

우리는 실제로 돈이 내게로 송금되는 과정을 내 금고, 또는 통장에 돈이 '쌓인다'고 생각하기 쉽다. 그래서 비트코인의 지갑 개념이 잘 이해되지 않을 수 있다. 지갑은 돈을 저장하는 역할을 하는 것이 아니라, 돈을 쓸 때 그게 '나'임을 증명하는 도구일 뿐이다. 현금을 넣어두는 지갑보다 카드에 가깝다.

> 사실 기존에 은행 등에서 사용하는 인증 방식도 기본적으로는 비대칭키 알고리즘에 기반한 것이다. 하지만 공인인증서와 같이 복잡한 사족이 추가되는 이유는, 자신이 갖고 있는 개인키를 중앙 서버로 '전송'해야 하기 때문이다. 하지만 Bitcoin에서는 인증 과정이 서버가 아닌 내 컴퓨터에서 이루어진다. 개인키를 전송할 필요가 없기 때문에 추가적인 인증 메소드가 필요하지 않은 것이다.

## Address Generation

하지만 실제 Bitcoin 주소는 Public key 그 자체는 아니다. Public key를 먼저 SHA-256으로 해싱하고, 이 결과를 RIPEMD-160으로 또 다시 해싱한다.
그리고 추가적으로, 이 결과에 version을 가리키는 bytes(Main Net은 단순히 0x00으로 표시한다)와 checksum을 양쪽에 붙이게 된다. 자세한 과정은 [Bitcoin Wiki](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses)를 참고하자.

![](https://en.bitcoin.it/w/images/en/9/9b/PubKeyToAddr.png)

Address를 만들기 위해 Public key를 가공하는 이유는 무엇일까? 가장 단순한 설명으로는, 더 짧은 Address를 만들기 위해서라는 것이다. 160 bits(20 bytes)의 해시된 결과를 Transaction에 포함하는 것이 65 bytes의 key 전체를 포함하는 것보다 효율적이다. 그리고 20 bytes의 주소를 사용함으로써 QR code로도 변환할 수 있다. 

하지만 다른 이유도 있다. Public key와 Private key를 생성하기 위해 사용되는 Elliptic Curve Cryptography에 존재하는 근본적인 취약점이 있다. modified Shor's algorithm가 타원곡선의 이산 로그 문제를 풀 수 있기 때문이다. 물론 양자 컴퓨터가 나왔을 때의 이야기이긴 하지만, 어쨌든 이를 통해 Public key로부터 Private key를 유추할 수 있는 가능성이 있다. 그러므로 Public key를 숨길 필요가 있는 것이다. 

> 하지만 자신의 Address에 존재하는 BTC를 '지불'하게 되면, Transaction의 Unlock Script 안에 자신의 Public key와 Signature 등이 포함되게 된다. 즉, 정확히는, Public key Hash를 사용하더라도 Public key는 이것을 사용하기 전까지만 숨겨진다는 것이다. 그래서 같은 Address를 계속해서 재사용하지 말라고 한다. 물론 잘 지켜지지는 않는 것 같지만..

> 사족을 좀 더하면, Bitcoin Address는 랜덤하게 생성된다. 하지만 이렇게 랜덤하게 생성된 결과가 duplicate 되었는지 검사하는 과정은 존재하지 않는다. 응?? 그러면 다른 사람이 쓰고 있는 주소가 만들어지면 어떡하지? 하는 의문이 들 수 있다. 하지만 Address를 만들 수 있는 경우의 수가 우주의 원자 수보다 많기 때문에 이런 일은 당분간은 거의 절대로 벌어지지 않을 거라고 한다. 그래도 못 믿고 하루종일 지갑 주소만 생성해 보는 사람이 있을지도? 

## Bitcoin Transaction

사실 앞에서 설명한 Transaction의 과정은 [P2PKH(Pay to Public Key Hash)](https://en.bitcoinwiki.org/wiki/Pay-to-Pubkey_Hash)라고 부를 수도 있다. 주소를 Public Key 그대로 사용한다면 Transaction은 P2PK(Pay to Public Key)가 된다. 하지만 조금 더 효율적인 방법인 P2SH(Pay to Script Hash)라는 방법도 있다. 

단순히 개인 한 명이 Wallet을 소유하는 방법도 있지만, 여러 사람이 fund를 관리하기 위해 하나의 Wallet을 공동 소유하는 경우도 있다. 그래서 여러 사람들의 Signature를 필요로 하는 Multisig Wallet이 필요해졌고, 이런 경우에 효과적으로 대응하기 위해 나온 것이 P2SH다. Multisig Wallet을 사용하기 위해서는 여러 개의 Public key가 조합된 특별한 Address가 필요하고, 이것은 P2SH에서 정의하는 규칙에 따라 만들어진다. 

![](https://bitcoin.org/img/dev/en-unlocking-p2sh-output.svg)

이 과정을 완전히 이해하려면 Bitcoin의 UTXO와 Lock Script/Unlock Script가 어떻게 실행되는지 되짚어 볼 필요가 있다. 추후 여기에 대해서도 포스팅 할 기회가 있을 것이다.

