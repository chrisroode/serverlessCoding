# Coding Standard
Last Revised: 4/9/2026

## This Document
A coding standard provides all of the requirements to make the source code and the distribution code useful for the purpose of the project.  It is HIGHLY opinionated, and must be adhered to at all times.  While this sounds rather harsh, it has validity.  Teaching early programming is riddled with invisible walls and difficulties which only get in the way of the core lessons that need to be taught.  It is teaching a language, similar to teaching a foreign language, or the language instruction that kindergarten students are taught.  If a kindergarten teacher is inconsistent in their use of language (throwing in big words here and there, or using sentence structure that is more complicated) the students will stop learning and start being confused.  This coding standard is to eliminate deficulties in the education of students, teachers, and other professionals who might end up using it.

# The Files
## File Naming Conventions of distribution files.
- Distributed javascript source files are forbidden from containing references to other code in external files.
- source files must use only lowercase letters, numbers, and the underscore.
- the allowed file extensions are 'js', 'css', and 'html'.
- The official method of packaging applications created with the distribution files is to zip all the files in a single folder.  This avoids folder deliminators in `<script>` and `<style>` tags.

## Distribution Source Files
- All functionality of distribution files shall conform to the file:// scheme constraints with regards to available api calls.
- All distributed source files shall define one function that returns a constructed object giving access to the library.  This function shall match the name of the source file with the text "load" prepended to the name.  (example: 'math_functions.js' shall define one function 'load_math_functions()' which creates the module).
- Distribution source files shall be created in both annotated and non-annotated forms.
- Distribution source files shall not be minified.  Instead, a minify tool is provided so students can do their own minification of code.
- Distribution Source files come in two levels (beginner and advanced).  The following file requirements are established for those subsets:
- Beginner source files:
	- Shall not have abbreviations in their file name...so 'load_canvas_context' is not allowed to be abbreviated to 'load_canv_ctx'.
- Advanced source files:
	- May use abbreviations in the file name.


## Source Project Files
- entry points for libraries are...hmmm...
- Within the source project, function calls and filenames will adhere to camelCase.




# The Code
The code in a project must be consistent with to minimize the confusion for students using the api calls.  However, there are still two different coding standards, one for the distribution files, and one for the project files.

## Distribution Code Conventions
- members of libraries shall use a lowercase first letter and camelCase to specify words.
- all libraries will avoid abbreviation of names in the functions, constants, and objects.


## Project Code Conventions
- When in doubt, DON'T WRITE IT!  Only write functions where there is a specific need to make a complex task easy for beginners.  These libraries are training wheels, not a whole new language.  As soon as students can understand how to get the 2d context of a canvas and set up a regular update interval for a game loop, they should do it themselves with the standard library.  Only add to the library what is needed to help in lessons.


