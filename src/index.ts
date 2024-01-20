import { dataEmbedder } from "./dataSeparator.js";
import { data, schema } from "./data.js";
import { matchEmbeddingsWithSchema } from "./matchSchema.js";
import getResponsefromTogetherAI from "./requestFromToghetherAI.js";

const textContent = JSON.stringify(data.medstar_health[0]);

// dataEmbedder(textContent, 200, "mixtral_data");

matchEmbeddingsWithSchema(schema);

const text = `Match the embedding below with the schema element below it and only return whatever is related
in the embedding data to the schema element and if you find nothing related return "nothing". Make sure the
returned text is original and no other text is returned with it.
Embeddings Data: FIRST HEALTH Education --------- **Board Certification:** American Board of Internal Medicine, Cardiovascular Disease **Board Certification:** American Board of Internal Medicine, Internal Medicine **Board Certification:** American Board of Internal Medicine, Clinical Cardiac Electrophysiology **Fellowship Program:** MedStar Washington Hospital Center (2019) **Fellowship Program:** Geisinger Community Medical Center (2017) **Residency Program:** University of Maryland Medical Center (2014) **Medical School:** Drexel University College of Medicine (2011) Hospital affiliations --------------------- **[MedStar Georgetown University Hospital](/locations/medstar-georgetown-university-hospital)** **[MedStar Southern Maryland Hospital Center](/locations/medstar-southern-maryland-hospital-center)** **[MedStar Washington Hospital Center](/locations/medstar-washington-hospital-center)** Ratings and reviews ------------------- * Explanations the care

Schema Element: {"name":"primaryLocations","contextDescription":"list of primary locations","clinicName":"Primary location(s) refers to the main office or clinic where a physician primarily practices medicine. It's the location where the physician typically sees patients for routine appointments, consultations, and follow-up visits. Here, 'name' refers to name of a main office or clinic where a physician primarily sees patients for routine care.","url":"is a link to a clinic profile within that website.","address":"is an address where the clinic is located.","city":"is a city where the clinic is located.","state":"is a state where the clinic is located.","zip":"is a zip code where the clinic is located.","country":"is a country where the clinic is located.","latitude":"are geographic coordinates to specify a point's location (latitude) on the Earth's surface.","longitude":"are geographic coordinates to specify a point's location (longitude) on the Earth's surface."}`;
// getResponsefromTogetherAI(text);
