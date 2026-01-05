FROM node:18-slim

# Xray install လုပ်ခြင်း
RUN apt-get update && apt-get install -y curl unzip \
    && curl -L -o /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/xray

WORKDIR /app
COPY . .

# Configuration file ထုတ်ပေးခြင်း
RUN printf '{\n\
    "inbounds": [{\n\
        "port": %s,\n\
        "protocol": "vless",\n\
        "settings": {\n\
            "clients": [{"id": "%s"}],\n\
            "decryption": "none"\n\
        },\n\
        "streamSettings": {\n\
            "network": "ws",\n\
            "wsSettings": {"path": "/"}\n\
        }\n\
    }],\n\
    "outbounds": [{"protocol": "freedom"}]\n\
}' "${PORT:-8080}" "${UUID:-$(node -e 'console.log(require("crypto").randomUUID())')}" > config.json

EXPOSE 8080

# Node server နဲ့ Xray ကို တစ်ပြိုင်တည်း run ခြင်း
CMD node index.js & xray -config config.json
