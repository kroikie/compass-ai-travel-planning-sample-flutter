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

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrievers = exports.flows = exports.tools = void 0;
const core_1 = require("@genkit-ai/core");
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const dotprompt_1 = require("@genkit-ai/dotprompt");
// importing our own tooling.
const tools = __importStar(require("./tools"));
exports.tools = tools;
const flows = __importStar(require("./flows"));
exports.flows = flows;
const retrievers = __importStar(require("./retrievers"));
exports.retrievers = retrievers;
(0, core_1.configureGenkit)({
    plugins: [
        (0, googleai_1.googleAI)(),
        // Uncomment to use Vertex AI instead.
        // vertexAI({
        //   location: 'us-central1',
        // }),
        (0, dotprompt_1.dotprompt)({ dir: 'prompts' }),
    ],
    enableTracingAndMetrics: true,
    logLevel: 'debug',
});
(0, flow_1.startFlowsServer)({ port: 2222, cors: {
        origin: "*",
    } });
//# sourceMappingURL=index.js.map