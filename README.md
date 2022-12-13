# pqua

[![orca-service](https://img.shields.io/badge/orca-service-blue.svg?style=flat)](https://orca.ethos.corp.adobe.com/services)
[![moonbeam](https://img.shields.io/badge/ethos-moonbeam-yellow.svg?style=flat)](https://moonbeam.ethos.corp.adobe.com/G11nDALP/pqua)

This is a simple node.js reference application that listens on port 8080, with the apis detailed below. This reference application is using [nodejs_v12](https://git.corp.adobe.com/ASR/bbc-factory/blob/master/README.md) as base docker image.

### Build Container
We have  our application in  the client folder
Steps to Build
1. In pqua folder - npm run build
2. make build
3. docker-compose up --build

Building the container is a multi-step process. To learn more about this refer to the following [wiki page](https://wiki.corp.adobe.com/display/CTDxE/make+build+target).

##### Local development

Please refer to the [Local Development](https://wiki.corp.adobe.com/display/CTDxE/DxE+-+Anonymous+access+removal+in+Artifactory#DxE-AnonymousaccessremovalinArtifactory-LocalDevelopment) section of the Artifactory authentication wiki for instructions on setting the ARTIFACTORY_USER and ARTIFACTORY_API_TOKEN environment variables before running the below commands. Your generated service is already configured for Artifactory authentication and needs no changes, but the remainder of that wiki contains more details on how the authentication works in Ethos.

##### Mac users

```
Note: set ARTIFACTORY_USER and ARTIFACTORY_API_TOKEN before running below command
make build
```

##### Windows users

```
Please refer to the [Local Development](https://wiki.corp.adobe.com/display/CTDxE/DxE+-+Anonymous+access+removal+in+Artifactory#DxE-AnonymousaccessremovalinArtifactory-LocalDevelopment) section of the Artifactory authentication wiki for instructions on setting the ARTIFACTORY_USER and ARTIFACTORY_API_TOKEN environment variables before running the below commands. Your generated service is already configured for Artifactory authentication and needs no changes, but the remainder of that wiki contains more details on how the authentication works in Ethos.

docker login -u $(ARTIFACTORY_USER) -p $(ARTIFACTORY_API_TOKEN) docker-asr-release.dr.corp.adobe.com
docker build --pull -t pqua-builder -f Dockerfile.build.mt .
docker run -v <absolute_path_to_source_code>:/build pqua-builder
docker build --pull -t pqua-img .
```

### Run Container

##### Using docker compose

Docker compose is a convenient way of running docker containers. For launching the application using docker-compose, ensure the builds steps are already executed.

```
docker-compose up --build
```

##### Using docker command

```
docker run -it -e ENVIRONMENT_NAME=<dev|cd|qa|sqa|stage|prod|local> \
               -e REGION_NAME=<ap-south-1|ap-southeast-1|ap-southeast-2|ap-northeast-1|ap-northeast-2|eu-central-1|eu-west-1|sa-east-1|us-east-1|us-west-1|us-west-2|local> \
               -p 8080:8080 pqua-img
```

To run container locally use:

```
docker run -it -e ENVIRONMENT_NAME=local -e REGION_NAME=local -p 8080:8080 pqua-img
```

To run container with newrelic use:

```
docker run -it -e ENVIRONMENT_NAME=local -e REGION_NAME=local \
               -e REPLACE_NEWRELIC_APP=pqua -e REPLACE_NEWRELIC_LICENSE=<newrelic_license_key> \
               -p 8080:8080 pqua-img
```

To view container logs, run following command:

```
docker logs <container id>
```

Docker clean room setup:

To ensure that we're starting fresh (useful when you're doing a training session and/or trying to debug a local set up), it's best that we start with a 'clean room' and purge any local images and volumes that could introduce any potential 'contaminants' in our setup. You can read more on the following [wiki](https://wiki.corp.adobe.com/x/khu5TQ). Here is the command for docker clean room setup:

```
make clean-room
```

### List of available APIs

API | Description
--- | ---
`GET /ping` | A default API added by ASR. Returns the server details. Used for basic healthcheck.
`GET /pqua/myfirstapi` | A default API added by ASR. Displays Hello World in html page.

API can be accessed via curl command: `curl http://localhost:8080/<API>`

### Localization

Angular-translate is used to handle localization. Refer to [Angular-translate Documentation](https://angular-translate.github.io/). Sample code is already part of the code base.

Languages.js file and the JSON files under the resources folder will be changed if you onboard Globalization Service. For more details, see [Globalization Project Creation Service Developer Guide](https://wiki.corp.adobe.com/display/DMaG11n/Globalization+Project+Creation+%28GPC%29+Service+Developer+Guide).
 
Locale namings are case-sensitive which follow the BCP-47 rules. For more details, see [wiki](https://git.corp.adobe.com/pages/world-readiness/globalization-shared/guidelines/i18n_web/guidelines-for-creating-world-ready-applications).

### Environment Variables

Several environment variables can be used to configure web application.

Refer to the following [wiki](https://wiki.corp.adobe.com/display/CTDxE/docker-nodejs) for more details.

### Tessa 2.0

To enable TESSA, you may need to [setup](https://git.corp.adobe.com/zolesio/tessa-npm-plugin#generating-tessa-api-key) `TESSA2_API_KEY` as OrCA `build_env_vars` in your service_spec [file](https://git.corp.adobe.com/adobe-platform/service-spec/blob/45dec163fd4b0d8694714dcd675d37d524b9a67a/spec.yaml#L140).

### References

  * Base image: https://git.corp.adobe.com/ASR/bbc-factory/blob/master/README.md
