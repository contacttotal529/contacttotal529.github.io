import { BootstrapContext } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

// Used only by the build's prerender step; nothing runs at request time.
export default (context: BootstrapContext) => bootstrapApplication(App, config, context);
