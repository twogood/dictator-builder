import fs from 'fs';
import path from 'path';
var rimraf = require('rimraf');
import dictatorBuilder from './dictatorBuilder';
import { Logger, LEVEL } from './logging';
import { compareSync, Result } from 'dir-compare';
const fsextra = require('fs-extra');

test('test examples', () => {
  const examplesPath = path.join(__dirname, '..', 'examples');
  const examples = fs.readdirSync(examplesPath);
  examples.forEach((example) => {
    console.log(
      `\n\n------------------------------------------------\n` +
        `  Testing ${example}\n` +
        `------------------------------------------------\n\n`
    );
    const givenDictator = path.join(examplesPath, example, 'givenDictator');
    const givenTarget = path.join(examplesPath, example, 'given');
    const expected = path.join(examplesPath, example, 'expected');
    const actualTarget = path.join(examplesPath, example, 'actual');
    if (fs.existsSync(actualTarget)) {
      console.log(`Removing ${actualTarget}`);
      rimraf.sync(actualTarget);
    }
    fsextra.copySync(givenTarget, actualTarget);

    console.log(
      `Executing dictator-builder configured in ${givenDictator}\n` +
        ` on ${givenTarget}\n` +
        ` and storing result in ${actualTarget}...`
    );
    dictatorBuilder(new Logger(LEVEL.VERBOSE), givenDictator, actualTarget);

    const res: Result = compareSync(expected, actualTarget, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      skipSymlinks: true,
    });
    if (res.differences !== 0) {
      console.log(res);
      console.log(
        `Test case: ${example}\n` +
          `  expected ${expected}\n` +
          `  to equal ${actualTarget}`
      );
    }
    expect(res.differences).toBe(0);
  });
});
