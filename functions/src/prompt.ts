/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { ai } from './genkit.js';

// Define a prompt that includes the retrieved context documents

export const augmentedPrompt = ai.definePrompt({
  model: gemini15Flash,
  name: 'augmentedPrompt',
  input: {
    schema: z.object({
      context: z.array(z.string()),
      question: z.string(),
    }),
  },
  output: {
    format: 'text',
  },
  messages: `
Use the following context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
{{#each context}}
  - {{this}}
{{/each}}

Question: {{question}}
Helpful Answer:
`,
});
