#!/usr/bin/env bash
repoFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $repoFolder

buildFolder=".build"

if test ! -d $buildFolder; then
    mkdir $buildFolder
fi

nugetPath="$buildFolder/nuget.exe"
if [ ! -f $nugetPath ]; then
    nugetUrl="https://dist.nuget.org/win-x86-commandline/v3.5.0-beta2/NuGet.exe"
    wget -O $nugetPath $nugetUrl 2>/dev/null || curl -o $nugetPath --location $nugetUrl 2>/dev/null
fi

nuget="mono $buildFolder/nuget.exe"

$nuget install GitVersion.CommandLine -ExcludeVersion -Source https://www.nuget.org/api/v2/ -Out packages

gitversion="mono packages/GitVersion.CommandLine/tools/GitVersion.exe"

$gitversion /output buildServer /updateassemblyinfo true
$gitversion

au build

au test