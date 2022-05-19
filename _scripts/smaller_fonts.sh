BASEPATH=".."
bundle3.0 exec jekyll build --config $BASEPATH/_config_fu.yml -s $BASEPATH/ -d $BASEPATH/_site/
# currently broken...
# jupyter-execute nbconvert --to notebook  --execute $BASEPATH"/_scripts/minimize fonts.ipynb"
