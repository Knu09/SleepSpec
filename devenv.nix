{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = with pkgs; [
    nodejs_23
  ];

  android = {
    enable = true;
    reactNative.enable = true;
    platforms.version = ["35"];
    systemImageTypes = ["google_apis_playstore"];
    abis = ["x86_64"];
    cmake.version = ["3.22.1"];
    cmdLineTools.version = "11.0";
    tools.version = "26.1.1";
    platformTools.version = "35.0.1";
    buildTools.version = ["35.0.0" "34.0.0"];
    emulator = {
      enable = true;
      version = "35.1.2";
    };
    sources.enable = false;
    systemImages.enable = true;
    ndk.enable = true;
    googleAPIs.enable = true;
    googleTVAddOns.enable = false;
    android-studio = {
      enable = false;
      package = pkgs.android-studio;
    };
  };

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.cargo-watch.exec = "cargo-watch";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  # scripts.hello.exec = ''
  #   echo hello from $GREET
  # '';

  # enterShell = ''
  # '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  # enterTest = ''
  #   echo "Running tests"
  #   git --version | grep --color=auto "${pkgs.git.version}"
  # '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
