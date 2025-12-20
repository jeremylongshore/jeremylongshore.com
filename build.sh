#!/usr/bin/env bash
# Build script for Linkyee on Netlify

set -eu  # Exit on error or unset variable

SITE_DIR="_output"

build() {
  # clean
  if [[ -d $SITE_DIR ]]; then
    rm -rf "$SITE_DIR"
  fi

  # Install bundle dependencies (bundler should be pre-installed by Netlify)
  bundle install

  # Run the Ruby script to generate the output
  bundle exec ruby "./scaffold.rb"

  echo "Build complete! Output in $SITE_DIR/"
}

# Execute build
build
