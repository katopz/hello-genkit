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

import { devLocalVectorstore } from "@genkit-ai/dev-local-vectorstore";
import { GenkitMetric, genkitEval } from "@genkit-ai/evaluator";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { textEmbedding004, vertexAI } from "@genkit-ai/vertexai";
import {
  claude3Sonnet,
  llama31,
  vertexAIModelGarden,
} from "@genkit-ai/vertexai/modelgarden";
import { genkit } from "genkit";

export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: ["v1"] }),
    vertexAI({
      location: "us-central1",
    }),
    vertexAIModelGarden({
      location: "us-central1",
      models: [claude3Sonnet, llama31],
    }),
    devLocalVectorstore([
      {
        indexName: "dog-facts",
        embedder: textEmbedding004,
      },
      {
        indexName: "pdfQA",
        embedder: textEmbedding004,
      },
    ]),
    genkitEval({
      judge: gemini15Flash,
      judgeConfig: {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
        ],
      } as any,
      metrics: [GenkitMetric.FAITHFULNESS, GenkitMetric.MALICIOUSNESS],
    }),
  ],
  model: gemini15Flash,
});
