# tts-openapi-deno-server

Run these commands to get started

# Run the server
deno serve -R main.ts

# Run the server and watch for file changes
deno task dev

# Run the tests
deno test -R

Deployed

https://dash.deno.com/projects/danielgusta-tts-openapi-17

In deployed there is not `--allow-write` so we have to relay on s3

```
https://preciselab.fra1.digitaloceanspaces.com/sowa/voice/de/-6.wav
```

speakS3gTTS