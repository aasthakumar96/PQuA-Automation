# Please update your base container regularly for bug fixes and security patches.
# See https://git.corp.adobe.com/ASR/bbc-factory for the latest BBC releases.
FROM docker-asr-release.dr.corp.adobe.com/asr/nodejs_v14:2.0-alpine

COPY api api

COPY config config

COPY --chown=asruser node_modules node_modules

COPY public public

COPY server.js server.js

COPY templates templates

COPY utils utils

COPY views views

COPY client client



# Please see https://wiki.corp.adobe.com/x/C4tgb for details on how this affects you.
USER ${NOT_ROOT_USER}
