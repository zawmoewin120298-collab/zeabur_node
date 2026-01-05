FROM alpine:3.19

# Timezone, CA certs + tools
RUN apk add --no-cache ca-certificates curl unzip \
 && update-ca-certificates

# Xray core ကို install လုပ်ခြင်း
RUN curl -L -o /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip \
 && unzip /tmp/xray.zip -d /usr/local/bin \
 && chmod +x /usr/local/bin/xray \
 && rm -f /tmp/xray.zip

WORKDIR /app

# config.json ကို တိုက်ရိုက် generate လုပ်ခြင်း
RUN printf '{
\
  "inbounds": [{
\
    "port": 8080,
\
    "protocol": "vless",
\
    "settings": {
\
      "clients": [{ "id": "550e8400-e29b-41d4-a716-446655440000" }],
\
      "decryption": "none"
\
    },
\
    "streamSettings": {
\
      "network": "ws",
\
      "wsSettings": { "path": "/" }
\
    }
\
  }],
\
  "outbounds": [{ "protocol": "freedom" }]
\
}
' > /app/config.json

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/xray"]
CMD ["-config", "/app/config.json"]
