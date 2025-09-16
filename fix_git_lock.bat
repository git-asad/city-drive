@echo off
if exist .git\index.lock (
    echo Removing Git lock file...
    del .git\index.lock
    echo Lock file removed.
) else (
    echo No lock file found.
)