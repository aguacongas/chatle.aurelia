#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="develop"
TARGET_BRANCH="gh-pages"

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

cd "$TRAVIS_BUILD_DIR"
# Save some useful information
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
mkdir out
cd out
git init
git checkout -b $TARGET_BRANCH

# Clean out existing contents
cp ../wwwroot/index.html .
cp ../wwwroot/scripts/*.js scripts

# Now let's go have some fun with the cloned repo
git config user.name "Travis CI"
git config user.email "travis"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ -z `git diff --exit-code` ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add .
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Now that we're all set up, we can push.
git push -f -q https://aguacongas:$GH_TOKEN@github.com/aguacongas/chatle.aurelia.git-$TARGET_BRANCH $TARGET_BRANCH &2>/dev/null 
