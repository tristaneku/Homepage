{ ... }:

{
  env = {
    DB_FILE = "file:local.db";
  };

  languages.javascript = {
    enable = true;
    npm.enable = true;
  };
}
