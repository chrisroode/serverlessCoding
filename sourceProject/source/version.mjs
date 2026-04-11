/**
 * @module version
 */

const releaseStage = 'alpha';
const versionNumber = '1.0.0';
/**
 * @constant version
 * @description the version of the software.  This string shall be included with every release of the Serverless Game Engine.  The format is specified as such:
 * - a single lower case word release stage (E.G. alpha, beta, etc)
 * - a space deliminator
 * - the major, minor, and patch versions, separated by dots.
 * 
 * ### How to parse the version number:
 * If you want to examine the version of the software in your app, to account for version changes (that is getting a bit complicated for the scope of the project), you can examine the smoke checks that are in the source code (in 'version.test.js').
 */


export const version = `${releaseStage} ${versionNumber}`;


