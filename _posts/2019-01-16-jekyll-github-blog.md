---
title: Jekyll + Github Pages로 블로그 만들기
tags: [jekyll, web, ruby, TIL]
---

블로그 제작기
  
==more==

홈페이지를 만들고 싶어서 삼촌한테 프로그래밍 알려달라고 졸랐던 꼬꼬마 초딩이 하나 있었다. 당연하게도 이 글을 쓰고 있는 본인이다. 나모 웹에디터로 HTML을 끄적이고, 이스트소프트의 알FTP로 파일을 서버에 업로드했다. 마침내 인터넷에 접속해서 나온 화면에 엄청 뿌듯했던 기억이 난다. 텍스트와 사진 몇 개로 이루어진, 스크립트 하나 없는 페이지였다만, 어쨌든 그때부터 넷상에 내 공간, 안식처(?) 같은 곳을 마련하고자 하는 열망이 생겼던 것 같다.
 
Jekyll을 알게 된 건 제작년 여름 즈음, 웹개발을 좀 시작해보겠다고 Angular.js 같은 프레임워크를 찾아보던 시기였다. 자연스레 웹 개발자 분들의 블로그를 돌아보게 됐는데,  `github.io`로 끝나는 블로그에서 특히 멋쟁이 개발자들의 아우라가 풍기는 것이 아닌가.  (그땐 그런 것 같았다) 몇 번의 검색 끝에 Jekyll의 존재를 알게 됐다. Static… web… site를 만들어준다고? 뭔가 html 파일이 만들어지는 건 알겠는데…. 하면서 슬쩍 알아보다 흐지부지되고 말았다.  

어쨌든 최근에 다시 ~~내집마련~~.. 아니 내 블로그 마련에 대한 열망에 불이 붙었다. 이번엔 제대로 Jekyll 블로그에 정착해 보기로 했다. 현실에선 월세를 아직 탈출하지 못하고 있지만, 웹에서라도 네이버, 티스토리 같은 곳에서 독립해서 내 입맛대로 꾸며 보자는 생각이었다. (지금 생각해 보니 여전히 Github에 빌붙어 있는 건 똑같군요!)

그래도 막상 하려니 귀찮은 건 어쩔 수 없었는데, 정-말 필수적인 기능만 만들고 차츰차츰 추가해 나가자고 스스로를 달래가며 이만큼 만들었다. 서두가 참 길었는데, 이 포스팅에서 여기까지의 과정을 찬찬히 소개해보도록 하겠다. 2년 전의 나 같은 사람이 있다면 고민하지 말고 바로 `gem install jekyll bundler` 를 외쳐봅니다 (물론 터미널에다가)

---

## 그래서 Jekyll이 뭔가요
> Jekyll is a simple, extendable, static site generator. You give it text written in your favorite markup language and it churns through layouts to create a static website. Throughout that process you can tweak how you want the site URLs to look, what data gets displayed in the layout, and more.  

공식 사이트의 설명이다. 진짜 짧게 요약하면 site generator, 사이트를 만들어주는 툴이다. 지정된 구조에 맞게 내 포스트들을 마크다운 형식으로 저장하면, 알아서 static 웹 페이지(html 파일)로 빌드해준다. 단순히 `.md` 파일을 `.html` 파일로 변환시켜주기만 하는 건 아니고, 이 포스트가 들어갈 페이지의 틀도 만들 수 있고 포스트의 생성 날짜, 태그 같은 메타데이터도 사용하기 쉽게 관리해준다. 

---

## 그래서 왜 Jekyll을 쓰나요
내 개인적으로 느낀 점에 대해서만 말해보겠다. 
1. 마크다운 활용: 마크다운 문법을 좋아하는 사람들에겐 매력 요소 중 하나다. 마크다운으로 쓴 글을 따로 html으로 변환하는 귀찮은 과정 없이도 바로 업로드할 수 있는 게 좋다. 나 같은 경우에는 Github에 [til](https://github.com/greenmonn/til) 이라는 저장소를 만들어서 마크다운으로 작성한 글들을 가끔 올리곤 했었다. 이 글들을 바로 블로그로 옮길 수 있어서 굉장히 편했다. 
2. 포스트 관리 (마이그레이션): 네이버 블로그 같은 플랫폼에 종속된 서비스를 이용하면 내 글이 내 글 같지가 않다. 항상 서버에 접속한 상태에서 글에 접근할 수 있고, 자체 에디터를 적용한 글은 다른 곳으로 옮기는 것도 힘들다. Jekyll로 블로그를 운영하면 포스트가 내 컴퓨터에 파일로 잘 저장되어 있어서 마음이 든든하다.
3. `git commit` 그리고 `git push origin master`로 출판 가능: 물론 GitHub pages와 연동해야 얻을 수 있는 이점이긴 하다. 로컬에서 포스트를 수정하고, 커밋을 할 수 있다는 건 블로그의 변경 사항들에 대해 git의 강력한 버전 관리를 적용할 수 있다는 얘기다. 그것도 그렇고.. 내가 git에 익숙해져서 그런가, 이 과정이 엄청 자연스럽고 글 올릴 때 뿌듯하다. 그냥 기분 좋단 얘기다.

---

## 로컬에서 만들어 봅시다
[Jekyll Quickstart](https://jekyllrb.com/docs/) 를 보고 찬찬히 따라하면 된다. Ruby 개발 환경을 설정해줘야 할 수도 있는데, Mac의 경우에는 기본적으로 ruby와 빌드 툴이 다 있어서 바로 설치할 수 있다.  다만, 나의 경우에는 시스템 디렉토리에 ruby와 gem이 설치되어 있어서,

```
gem install --user-install bundler jekyll 
```

위와 같이 `—user-install` 명령을 추가해주어야 했다. `sudo`를 넣을 수도 있지만 공식 문서에서도 언급했다시피 file permission problem이 생길 수 있어서 추천하지 않는다. 또한, 설치 중 아래와 같은 WARNING이 나온다면,
```
WARNING:  You don't have /Users/greenmon/.gem/ruby/2.3.0/bin in your PATH,
	  gem executables will not run.
```

시키는 대로 `~/.bash_profile`에 (zsh 사용자는 알아서) `export PATH="$PATH:/Users/greenmon/.gem/ruby/2.3.0/bin"` 한 줄 추가해주자. (사실 이쯤되면 `rbenv`로 루비 개발환경을 새로 세팅해주고 싶은 마음이 굴뚝같아지지만 참았다. 이 글 읽는 분들은 참지 않으셔도 돼요..)
Windows는 죄송합니다..

`bundle install`로 의존성들을 설치하고, `bundle exec jekyll serve` 명령어를 사용해 개발 모드로 서버를 돌릴 수 있다. static site라는데 왜 서버가 필요하지? 하는 의문이 들 수 있는데, 써 보면 파일이 바뀔 때마다 바로바로 리로딩을 해준다. 그런 용도로 서버를 띄워주는 거고, 빌드된 결과만을 보고 싶을 때에는 `bundle exec jekyll build`를 실행하고 `_site` 폴더 내에서 직접 파일을 열어서 보면 된다.

이제 두 가지 기로에 놓일 것이다. 이미 있는 테마에 잘 얹혀갈 것인지, 아니면 처음부터 내 입맛대로 스타일을 입힐지 선택하는 것이다. 시간을 소중히 사용할 줄 아는 현명한 여러분들이라면 전자를 택하길 바란다. 나는 한땀한땀 CSS(그나마 Jekyll은 SCSS를 기본으로 지원한다)를 입혔는데 의미 없는 것 같다. 변명이라면 마음에 들었던 테마가 유료라서 어쩔 수 없이 따라서 직접 만들었다고(…)

---

## GitHub Pages와 연동
GitHub pages는 GitHub에서 고맙게도 계정이 있는 모든 이들에게 하나씩 제공해주는 웹 호스팅용 개인 저장소이다. GitHub에서 이름이 `<username>.github.io`인 저장소를 생성하면 자동으로 세팅된다! 

이렇게 원격 저장소를 설정한 후에는, [GitHub Pages with Jekyll](https://jekyllrb.com/docs/github-pages/) 문서를 따라가면 된다. 먼저 `Gemfile`에 `github-pages` 라는 gem을 추가해야 한다. 나는 SEO를 도와주는 다른 gem들도 함께 쓰고 있어서 아래와 같이 설정했다.

```
source 'https://rubygems.org'

gem 'jekyll'

group :jekyll_plugins do
    gem 'github-pages'
    gem 'jekyll-sitemap'
    gem 'jekyll-feed'
    gem 'jekyll-seo-tag'
  end
```

이후 프로젝트 소스를 만들어진 원격 저장소와 연결하고, `master` 브랜치에 push하면 끝이다. 아, 그전에 빌드된 파일이 위치하는 `_site` 폴더는 `.gitignore` 파일에 추가하는 것이 좋겠다. 

원격의 `master` 브랜치에 새로운 커밋이 추가되거나 변경되면, Github 서버는 자동으로 `jekyll build`를 수행하고 그 결과를 자신의 사이트에 반영하게 된다. 이 과정은 보통 1~2분 정도 걸리는 것 같다. 약간 조급해져서 새로고침을 많이 누르게 되겠지만 잠깐 유튜브 한 편 보고 오는 걸 추천한다. (돌아와야 해요!)
가끔 내용이 캐시되어 변경 사항이 반영되지 않을 때가 있는데, 보통은 브라우저 캐시를 초기화하면 정상적으로 작동하는 것 같다. 또한, commit을 추가하는 것이 아니라 `git commit --amend` 옵션으로 이미 있는 커밋을 수정해서 다시 `force push` 하는 경우, 한 번이지만 소스에 문제가 없는데도 빌드 오류가 계속 뜨는 현상이 있었다. 최대한 로컬에서 잘 보이는지 먼저 확인하고, `force push`하는 일은 없도록 해야겠다. (다짐)

---

## 마치며
아직 permalink 설정, pagination 만들기, category 생성 등 추가해야 할 것들이 많이 남았다. 이런 기능을 차근차근 더해가면서 포스팅도 슬금슬금 늘려 나가야겠다. 

아, 그리고 최근에 알게 된 건데, Ruby 말고 Node.js 기반의 [Hexo](https://hexo.io/ko/index.html)라는 것도 있다. 사실 이걸 먼저 알았더라면 Jekyll 말고 Hexo로 만드는 건데(…) 게다가 이렇게 취향저격 귀여운 테마([Cactus Dark](https://probberechts.github.io/hexo-theme-cactus/cactus-dark/public/))도 있으니 아직 안 만든 분들은 Jekyll과 Hexo 중 뭘 써볼지 행복한 고민을 해보길 바란다. 























