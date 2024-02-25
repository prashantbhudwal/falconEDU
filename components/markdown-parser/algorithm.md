# Markdown Parsing @ FalconAI

## Current approach

1. Markdown Parsing: The Markdown content is first parsed by Remark, where remarkMath identifies and structures mathematical expressions and remarkGfm adds support for GitHub Flavored Markdown features.
2. AST Transformation: The content, now in the form of an AST that includes structured math expressions, is then transformed into an HTML AST, preserving the special handling needed for math content.
3. HTML Rendering: Finally, rehypeKatex processes the HTML AST, converting all structured math expressions into their visually formatted HTML equivalents using KaTeX. This step is crucial for displaying the math content as intended in the final rendered output.

## Algorithm

1. Parse Markdown Content: Use remarkGfm and remarkMath to parse GitHub Flavored Markdown and mathematical expressions within the Markdown content.
2. Transform Math Expressions: Convert parsed mathematical expressions into HTML using KaTeX (via rehypeKatex).
3. Render Custom Components: For paragraphs and code blocks, apply specific styling and functionality, including a custom rendering path for syntax-highlighted code blocks with download capabilities.
4. Syntax Highlighting and Download: For code blocks, highlight syntax according to the specified programming language and offer a file download option with an appropriate file extension.
