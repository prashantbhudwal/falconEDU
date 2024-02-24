/**
 * This file is used for testing the long text in the UI
 */
import endent from "endent";

const title = `This is long title that is will be used for testing the long text`;
const line = endent`Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem tenetur Dolorem tenetur soluta sunt dolorum rerum vel.`;
const paragraph = endent`Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem tenetur soluta sunt dolorum rerum vel reiciendis perferendis quibusdam illum assumenda quod suscipit ducimus reprehenderit explicabo, porro ut eum corrupti iure excepturi ipsam tempora quidem quisquam voluptates ipsa? Aliquam, autem eos.`;
const article = endent`${paragraph}
${paragraph}

${paragraph}

${paragraph}

${paragraph}

${paragraph}

${paragraph}

${paragraph}

${paragraph}
        `;

export const testContent = {
  title,
  line,
  paragraph,
  article,
};
