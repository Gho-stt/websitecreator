import { defineCliConfig } from 'sanity/cli';
import { sanityProject } from './sanity.project.mjs';

export default defineCliConfig({
  api: { projectId: sanityProject.projectId, dataset: sanityProject.dataset },
});
