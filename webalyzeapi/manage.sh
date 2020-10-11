#!/bin/bash

PY=./env/bin/python
FP=./src/manage.py
DOC=$(cat <<-END
    \n
    - COMMAND - [ ARGS ] -> REQUIRED\n
    \n
    - run ----- [ port ] -> false - runs webserver\n
    - app ----- [ name ] -> true -- creates new app\n
    - migrate --------------------- migrate changes to db\n
    - test ------------------------ run django tests\n
    - user ------------------------ create superuser\n
    - resetdb --------------------- remove current db\n
    - shell ----------------------- launch a py shell\n
    - dbshell --------------------- launch a db shell\n
    - help ------------------------ output usage help\n
END
)
MODE=""
ARG=""

manage () {
    case $MODE in
        run)
            source ./secrets && $PY $FP runserver $ARG
            ;;
        migrate)
            $PY $FP makemigrations && $PY $FP migrate
            ;;
        user)
            $PY $FP createsuperuser
            ;;
        app)
            if [ ! -z $ARG ] 
                then $PY $FP startapp $ARG && mv ./$ARG ./src/
            else
                echo "error: 'app' must have a name specified"
                exit 0
            fi
            ;;
        test)
            $PY $FP test
            ;;
        shell)
            $PY $FP shell
            ;;
        dbshell)
            $PY $FP dbshell
            ;;
        resetdb)
            rm ./src/db.sqlite3
            ;;
        help)
            echo -e $DOC
            ;;
        *)
            echo "error: no valid command found"
            exit 0
            ;;
    esac
}

if [ $1 ] 
    then MODE=$1
fi
if [ $2 ] 
    then ARG=$2
fi

manage
exit 1
