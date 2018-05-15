BASEPATH='..'
jekyll build --config $BASEPATH/_config_fu.yml -s $BASEPATH/ -d $BASEPATH/_site/
jupyter nbconvert --to notebook  --execute $BASEPATH"/_scripts/minimize fonts.ipynb"
jekyll build --config $BASEPATH/_config_fu.yml -s $BASEPATH/ -d $BASEPATH/_site/
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress $BASEPATH/_site/ lounge.imp.fu-berlin.de:web-home/public_html/
