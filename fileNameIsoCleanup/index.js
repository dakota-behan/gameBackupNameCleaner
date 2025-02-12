const fs = require("fs");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const modifyFiles = (target, answer) => {
  // get all file names and put into array
  let inputFiles = fs.readdirSync(target);

  // if we are doing only file modification
  if (answer) {
    inputFiles = inputFiles.filter(
      (e) =>
        e.endsWith(".iso") ||
        e.endsWith(".bin") ||
        e.endsWith(".bin.enc") ||
        e.endsWith(".cue") ||
        e.endsWith(".chd") ||
        e.endsWith(".img") ||
        e.endsWith(".mdf") ||
        e.endsWith(".mds")
    );
  }

  // go through all file names
  for (let i = 0; i < inputFiles.length; i++) {
    let currentName = inputFiles[i];

    // match any parantheses with any word/non word character inside
    let groups = currentName.match(/\((\w|\W)+?\)/g);

    // if there are no parentheses
    if (!groups || groups.length == 0) {
      // guess we will do nothing
    } else {
      // make sure to remove anything that doesnt have a number in it, for multi disc games
      groups = groups.filter((e) => {
        return (
          e.match(/rev/gi) ||
          !e.match(/(\d|one|two|three|four|five|six|seven|eight|nine)/gi)
        );
      });
      // modify the name to filter out all parentheses found
      groups.forEach((e) => (currentName = currentName.replaceAll(e, "")));
    }
    // clean up the name
    currentName = currentName
      .replaceAll(/ {2,}/g, " ")
      .replace(/ {1,}.iso/, ".iso");
    currentName = currentName.trim();

    // rename file
    fs.renameSync(`${target}/${inputFiles[i]}`, `${target}/${currentName}`);
    inputFiles[i] = currentName;
  }

  return inputFiles;
};

rl.question(`what is the file dir?\n`, (dir) => {
  rl.question(`\nare we modifying file names only? y or n\n`, (answer) => {
    answer = answer.toLowerCase();

    if (answer == "y" || answer == "n" || answer == "yes" || answer == "no") {
      modifyFiles(dir, answer == "y" || answer == "yes");
      rl.question("\ndone! press enter to finish.", () => rl.close());
    } else {
      rl.question(
        "\nanswer outside of y or n given, press enter to close",
        () => rl.close()
      );
    }
  });
});
