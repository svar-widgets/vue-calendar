// Entry point for full CSS build that includes both component and base styles

// Import base component styles
import '@svar-ui/vue-core/style.css';
import "@svar-ui/vue-menu/style.css";
import "@svar-ui/vue-toolbar/style.css";
import "@svar-ui/vue-editor/style.css";
import "@svar-ui/vue-filter/style.css";

// Import component styles
import * as data from './index.js';
export default data;