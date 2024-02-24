<!-- NOTE: These docs are normative, not descriptive. Everything in the docs is not implemented in the app. -->

# Source of Truth

FalconAI is syllabus agnostic educational platform. And every syllabus agnostic educational platform needs a source of truth, SOT. This SOT is uploaded by the educators.

## Why is SOT needed?

- The AI model considers the SOT as the ground truth. It is the reference point for the AI model to create the content.

## What does FalconAI do?

- FalconAI transforms the SOT into educational content like
  - lessons
  - quizzes
  - tests
  - etc.

## Current Implementation of Source of Truth

- A SOT is always stored as a string in the database.
  - We might change this in the future to store it as a json or a different format.
  - We might also directly store the file in the database.
- A teacher creates a SOT.
  - And therefore, the teacher is the owner of the SOT.
- One teacher can have multiple sources of truth. But, one SOT can only be owned by one teacher. `(TeacherProfile:Source = 1:N)`
- A SOT can be connected to multiple classes. And a class can have multiple sources of truth. `(Source:Class = N:M)`
- A SOT can be connected to multiple tasks. And a task can have multiple sources of truth. `(Source:Task(BotConfig) = N:M)`

## Teacher Journey for using the Source of Truth

1. A teacher creates a class.
2. In the class, the teacher creates a SOT.
   1. The source of truth can be a maximum of 5000 characters.
3. The teacher then creates a task and connects the SOT to the task.
4. The AI model then creates the content for the task based on the SOT.

## Processing the Source of Truth

- The teacher can upload the source of truth in the form of a file.
- The file can be in the form of a

  - .txt
  - .docx
  - .pdf

- Our objective is to detect the type, choose the right conversion algorithm and then convert the file into a string and store it in the database.
- We will also have to consider the file size and the time it takes to convert the file into a string.

### Algorithm for processing the Source of Truth

1. The teacher uploads the file.
2. The file is converted into a string.
3. The string is stored in the database.
4. The file is deleted from the server.
5. The string is used to create the content for the task.

## Programming implementation

1. Accept the file using react-dropzone.
   1. Only accept .txt, .docx and .pdf files.
2. Analyze the file for
   1. File type
      1. If the file is not a .txt, .docx or .pdf, then throw an error.
   2. File size
      1. If the file size is greater than 5 MB, then throw an error.
3. Send the file to the server using multer or mammoth.
4. Convert the file into a string based on the file type.
   1. .txt
      1. Read the file as a string.
   2. .docx
      1. Read the file using the DOCX package.
   3. .pdf
      1. Check if the file is a scanned PDF or a text PDF.
      2. If it is a scanned PDF,
         1. use OCR to convert the file into a string.
         2. Use tesseract.js for OCR.
         3. Later move to Surya OCR.
      3. If it is a text PDF
         1. convert the file into a string using pdf-parse.
5. Save the string in the database.

## SOT and Tasks - User Journey & Interface

1.  Teacher comes to the task creation page.
2.  The teacher has a text area to add the content for the task.
3.  The teacher can
    1.  Enter the text manually and publish the task.
    2.  Select an existing SOT and add its text to the context textarea of the task.
    3.  Create a new SOT and add its text to the context textarea of the task.
