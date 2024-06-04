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
Object.defineProperty(exports, "__esModule", { value: true });
exports.itineraryGenerator2 = void 0;
const retriever_1 = require("@genkit-ai/ai/retriever");
const dotprompt_1 = require("@genkit-ai/dotprompt");
const flow_1 = require("@genkit-ai/flow");
const zod_1 = require("zod");
const placeRetriever_1 = require("../retrievers/placeRetriever");
const types_1 = require("../common/types");
const tripPlan_1 = require("./shared/tripPlan");
exports.itineraryGenerator2 = (0, flow_1.defineFlow)({
    name: 'itineraryGenerator2',
    inputSchema: types_1.ItineraryRequest,
    outputSchema: zod_1.z.unknown(),
}, async (tripDetails) => {
    console.log("RUNNING");
    const placeDescription = await (0, flow_1.run)('getPlaceDescription', async () => {
        if (!tripDetails.images || tripDetails.images.length === 0 || tripDetails.images[0] == "") {
            return '';
        }
        const imgDescription = await (0, dotprompt_1.prompt)('imgDesc');
        const result = await imgDescription.generate({
            input: { images: tripDetails.images },
        });
        return result.text();
    });
    const location = await (0, flow_1.run)('determineLocation', async () => {
        const docs = await (0, retriever_1.retrieve)({
            retriever: placeRetriever_1.placeRetriever,
            query: `Given the following information about a location, determine which location matches this description : ${placeDescription} ${tripDetails.request}`,
            options: {
                k: 3,
            },
        });
        let v = new Array();
        docs.forEach((doc) => {
            v.push({
                knownFor: doc.toJSON().content[0].text,
                ref: doc.toJSON().metadata.ref,
                country: doc.toJSON().metadata.country,
                continent: doc.toJSON().metadata.continent,
                imageUrl: doc.toJSON().metadata.imageUrl,
                tags: doc.toJSON().metadata.tags,
                name: doc.toJSON().metadata.name,
            });
        });
        return v;
    });
    let locDetails = [];
    for (let i = 0; i < location.length; i++) {
        const loc0 = (0, flow_1.run)(`Details of place`, () => {
            return (0, tripPlan_1.tripPlan2)(tripDetails.request, location[i]);
        });
        locDetails.push(loc0);
    }
    const allTogether = await (0, flow_1.run)('allTogether', async () => {
        const results = await Promise.all(locDetails);
        const itineraries = { itineraries: [...results] };
        return itineraries;
    });
    return allTogether;
});
//# sourceMappingURL=itineraryGenerator.js.map