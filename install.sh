if [ -d .venv ]
then echo '>> .venv already exists.'
else
  echo '>> Installing .venv...'
  virtualenv .venv
fi

echo '>> Installing requirements.txt...'
.venv/bin/pip install -r requirements.txt

echo '>> Executing env.sh...'
. env.sh $*
test1