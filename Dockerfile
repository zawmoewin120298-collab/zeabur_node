FROM alpine:latest

RUN apk add --no-cache curl unzip \
    && curl -L -o /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/xray

WORKDIR /app

RUN printf '{\n\
    "inbounds": [{\n\
        "port": 8080,\n\
        "protocol": "vless",\n\
        "settings": {\n\
            "clients": [{"id": "550e8400-e29b-41d4-a716-446655440000"}],\n\
            "decryption": "none"\n\
        },\n\
        "streamSettings": {\n\
            "network": "ws",\n\
            "wsSettings": {"path": "/"}\n\
        }\n\
    }],\n\
    "outbounds": [{"protocol": "freedom"}]\n\
}' > config.json

EXPOSE 8080

CMD ["/usr/local/bin/xray", "-config", "config.json"]
