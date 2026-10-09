#!/bin/bash
# runs measure for all pages x viewports, 4 parallel
cd /home/danny/worktrees/digital-design-lab
cat <<L | xargs -P4 -L1 bash -c 'node design-lab/scripts/r2-apple-measure.mjs $0 $1 $2 > design-lab/round2/references/apple/log-$0-$2.txt 2>&1'
iphone-18-pro https://www.apple.com/iphone-18-pro/ desktop
iphone-18-pro https://www.apple.com/iphone-18-pro/ mobile
macbook-pro https://www.apple.com/macbook-pro/ desktop
macbook-pro https://www.apple.com/macbook-pro/ mobile
airpods-pro https://www.apple.com/airpods-pro/ desktop
airpods-pro https://www.apple.com/airpods-pro/ mobile
apple-vision-pro https://www.apple.com/apple-vision-pro/ desktop
apple-vision-pro https://www.apple.com/apple-vision-pro/ mobile
apple-watch-series-12 https://www.apple.com/apple-watch-series-12/ desktop
apple-watch-series-12 https://www.apple.com/apple-watch-series-12/ mobile
environment https://www.apple.com/environment/ desktop
environment https://www.apple.com/environment/ mobile
privacy https://www.apple.com/privacy/ desktop
privacy https://www.apple.com/privacy/ mobile
iphone-air https://www.apple.com/iphone-air/ desktop
iphone-air https://www.apple.com/iphone-air/ mobile
L
echo ALLDONE > design-lab/round2/references/apple/ALLDONE
