#!/usr/bin/env bash

set -e

OS="$(uname)"

if [ "$OS" = "Darwin" ]; then
  cc -fPIC -c src/parser.c -o parser.o
  cc -dynamiclib parser.o -o spectre.dylib
else
  cc -fPIC -c src/parser.c -o parser.o
  cc -shared parser.o -o spectre.so
fi
