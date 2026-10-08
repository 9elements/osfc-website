import { getConferenceYears } from "./conference.js";

/** getStaticPaths helper: one page per conference year. */
export const getYearPaths = async () =>
  (await getConferenceYears()).map((conference) => ({
    params: { year: String(conference.year) },
    props: { conference },
  }));
