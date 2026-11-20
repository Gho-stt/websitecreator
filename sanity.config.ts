import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { plPLLocale } from '@sanity/locale-pl-pl';
import { schemaTypes, singletons } from './sanity/schemaTypes';
import { sanityProject } from './sanity.project.mjs';
import { RestoreDefaultsAction } from './sanity/actions/restoreDefaults';

const singletonTypes = new Set<string>(singletons.map((s) => s.type));
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'kacper-dev',
  title: 'kacper.dev – panel',
  projectId: sanityProject.projectId,
  dataset: sanityProject.dataset,
  plugins: [
    structureTool({
      title: 'Treści',
      structure: (S) =>
        S.list()
          .title('Treści strony')
          .items(
            singletons.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.type)
                .schemaType(s.type)
                .child(S.document().schemaType(s.type).documentId(s.type).initialValueTemplate(s.type).title(s.title)),
            ),
          ),
    }),
    plPLLocale(),
  ],
  schema: {
    types: schemaTypes,
    // UWAGA: nie filtrujemy `templates` – szablony niosą wartości startowe (initialValue) singletonów
  },
  document: {
    // Ukryj singletony tylko w globalnym menu „Utwórz nowy”
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((t) => !singletonTypes.has(t.templateId)) : prev,
    // Singletony: publikuj / odrzuć zmiany / przywróć wersję + „Przywróć treści startowe”
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? [...input.filter(({ action }) => action && singletonActions.has(action)), RestoreDefaultsAction]
        : input,
  },
});
