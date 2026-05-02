/*
 * Global Component Registration Module
 *
 * This module ensures that frequently used components are
 * pre-registered globally before the Vue app is mounted.
 *
 * Benefits:
 * - Eliminates the need to import components manually in every file.
 * - Improves maintainability by centralizing component registration.
 * - Ensures consistency across the application.
 */

/* Imports */
import Heading from '../components/Heading.vue';

/* Components to be registered globally */
const components = {
  Heading,
};

/*
 * Register global components before mounting the app.
 * This ensures they are available across all components without explicit imports.
 */
export const registerGlobalComponents = {
  install(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};

export default registerGlobalComponents;
