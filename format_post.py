import sys
import os
import shutil
import re
from datetime import time, date

posts_path = '_posts'
image_path = os.path.join('assets', 'images')

new_posts = []

for file in os.listdir(posts_path):
    # if new post (has no date on file name)
    if re.search('^((?!(\d{4}(-\d\d){2})).)*\.md$', file) is not None:
        new_posts.append(file)

if len(new_posts) == 0:
    print("no new post found")

for new_post in new_posts:

    post_filename = new_post
    post_path = os.path.join(posts_path, post_filename)

    print("new post found: ", post_filename)

     # move images to assets/img
    try:
        post_img_path = shutil.move(os.path.join("_posts", post_filename.replace('.md', '')), image_path)
        print("[*] image files moved to", post_img_path)
    except FileNotFoundError:
        print("[**] No image directory found: skip moving image")

    # read whole post file
    with open(post_path, 'r') as f:
        post_file = f.read()

    # except code block
    p = re.compile("`(.*)`", re.DOTALL)
    post_file_without_codeblock = p.sub("", post_file)

    # extract post title (assume H1 tag on the top of the file is containing title)
    in_post_titles = re.findall("^# .*", post_file_without_codeblock)

    if len(in_post_titles) is 0:
        post_title = post_filename.replace('-', ' ').replace('.md', '')

    else:
        post_file = post_file.replace(in_post_titles[0] + '\n', "")
        
        post_title = re.sub("# ", "", in_post_titles[0]).strip()
    
    print("[*] post title extracted: ", post_title)

    # extract post tag (except # in source code block wrapped by ``` or `
    re_code = re.compile("`(.*)`", re.DOTALL)
    post_file_without_codeblock = re_code.sub("", post_file)
    post_tags = re.findall("#([\w+-]+)", post_file_without_codeblock)

    for tag in post_tags:
        post_file = post_file.replace("#" + tag, "")
    
    post_tags.append("TIL")

    print("[*] post tags extracted: ", post_tags)

    # find all image tags
    img_tags = re.findall('!\[\]\(.*\)', post_file)

    # change image path in image tag
    for idx, img_tag in enumerate(img_tags):
        new_path = os.path.join(image_path, img_tag[4:-1])
        new_tag = '![](/' + new_path + ')'
        post_file = post_file.replace(img_tag, new_tag)
        # use first image as thumbnail
        if idx == 0:
            post_thumbnail = new_path
    print("[*] image path adjusted")

    # generate jekyll "front matter"
    front_matter = '---\n' \
                   'title: "{}"\n' \
                   'tags: [{}]\n' \
                   '---\n'.format(post_title, ", ".join(post_tags))

    excerpt_separator = '\n<!--more-->\n'
    post_file = front_matter + excerpt_separator + post_file
    print("[*] jekyll front matter generated")

    # write post file
    with open(post_path, 'w') as f:
        f.write(post_file)

    # rename post to jekyll post file format
    format_today = date.today().strftime('%Y %m %d ')
    jekyll_format_name = (format_today + post_filename).replace(' ', '-').replace('_', '-')
    new_post_path = os.path.join(posts_path, jekyll_format_name)
    os.rename(post_path, new_post_path)
    print("[*] post file renamed to follow jekyll post naming scheme")