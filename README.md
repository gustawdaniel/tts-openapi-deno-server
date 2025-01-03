# tts-openapi-deno-server

Run these commands to get started

# Run the server

deno serve -R main.ts

# Run the server and watch for file changes

deno task dev

# Run the tests

deno test -R

Deployed

https://dash.deno.com/projects/danielgustaw-tts

In deployed there is not `--allow-write` so we have to relay on s3

```
https://preciselab.fra1.digitaloceanspaces.com/sowa/voice/de/-6.wav
```

How to use

```http request
GET https://danielgustaw-tts.deno.dev/speak/pl/27
```

you will be redirected to the file with created cache

```http request
GET https://preciselab.fra1.digitaloceanspaces.com/sowa/voice/pl/27.wav
```

Languages

```ndjson
{ text: 'Polish', value: 'pl' }
{ text: 'English', value: 'en' }
{ text: 'German', value: 'de' }
{ text: 'French', value: 'fr' }
{ text: 'Italian', value: 'it' }
{ text: 'Spanish', value: 'es' }
{ text: 'Russian', value: 'ru' }
{ text: 'Japanese', value: 'ja' }
{ text: 'Chinese', value: 'zh' }
{ text: 'Norwegian', value: 'nb' }
{ text: 'Arabic', value: 'ar' }
{ text: 'Dutch', value: 'nl' }
```

InfluxDB:
https://eu-central-1-1.aws.cloud2.influxdata.com/orgs/08384ac0bf08691e/data-explorer?fluxScriptEditor

Grafana:
https://preciselab.grafana.net/d/ee4tkeo0n22gwd/tts?orgId=1&from=now-6h&to=now&timezone=browser

TTS Dashboard: https://preciselab.grafana.net/goto/ZSFmJT7HR?orgId=1

![](https://preciselab.grafana.net/render/d-solo/ee4tkeo0n22gwd?orgId=1&from=2024-11-23T08:55:16.319Z&to=2024-11-23T14:55:16.319Z&timezone=browser&panelId=panel-1&__feature.dashboardSceneSolo&width=1000&height=500&tz=Asia%2FTbilisi)
