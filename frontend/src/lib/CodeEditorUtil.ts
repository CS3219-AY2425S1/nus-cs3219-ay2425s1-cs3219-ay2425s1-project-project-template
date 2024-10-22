// latest list of language_versions taken from https://emkc.org/api/v2/piston/runtimes
// version needs to match the version on piston for the code to execute

import { IDictionary } from "./utils";

export const LANGUAGE_VERSIONS: IDictionary<string> = {
	typescript: "5.0.3",
	javascript: "18.15.0",
	c: "10.2.0",
	"c++": "10.2.0",
	java: "15.0.2",
	csharp: "6.12.0",
	python: "3.10.0",
};

export const CODE_SNIPPETS: IDictionary<string> = {
	typescript: 'const greeting = "Hello World"\nconsole.log(greeting)',
	javascript: 'const greeting = "Hello World"\nconsole.log(greeting);',
	c: '#include <stdio.h>\n\nint main() {\n\tprintf("Hello World");\n\n\treturn 0;\n}',
	"c++":
		'#include <iostream>\n\nint main() {\n\tstd::cout << "Hello World";\n\n\treturn 0;\n}',
	java: 'class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}',
	csharp:
		'using System;\n\npublic class HelloWorld\n{\n\tpublic static void Main(string[] args)\n\t{\n\t\tConsole.WriteLine("Hello World");\n\t}\n}',
	python: 'print("Hello World")',
};
