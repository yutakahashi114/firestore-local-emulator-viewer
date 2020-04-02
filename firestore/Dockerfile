FROM google/cloud-sdk:alpine

RUN apk add --update --no-cache openjdk8 \
  && gcloud components update \
  && gcloud components install cloud-firestore-emulator beta --quiet