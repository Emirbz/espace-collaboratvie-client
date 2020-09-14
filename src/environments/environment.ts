// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {KeycloakConfig} from 'keycloak-angular';

const backURL = 'http://localhost:8089';
const keycloakurl = 'http://localhost:8080';
const minioQuarkus = 'http://192.168.1.21:8200';
const keycloakConfig: KeycloakConfig = {
  url: `${keycloakurl}/auth`,
  realm: 'espace_collaborative',
  clientId: 'angular-app',

};
const linkPreviewKey = 'f09affebf5ce7fd246b203c6854a0fb0';


export const environment = {
  production: false,
  apis: {
    eventBus: backURL + '/ws/chat?room_id=',
    rooms: backURL + '/room',
    message: backURL + '/msg',
    reaction: backURL + '/reaction',
    sondage: backURL + '/sondage',
    user: backURL + '/user',
    vote: backURL + '/vote',
    topic: backURL + '/topic',
    tag: backURL + '/tag',
    reply: backURL + '/reply',
    keycloak: keycloakConfig,
    backUrl: backURL,
    badge: backURL + '/badge',
    roomRequest: backURL + '/roomrequest',
    linkPreview: `http://api.linkpreview.net/?key=${linkPreviewKey}=&q=`,
    minioQuarkus: `${minioQuarkus}/api`,
    jitsiDomain: 'meet.jit.si'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
