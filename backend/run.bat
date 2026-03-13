@echo off
java --add-opens java.base/sun.security.ssl=ALL-UNNAMED ^
  --add-opens java.base/sun.security.util=ALL-UNNAMED ^
  --add-opens java.base/sun.net.dns=ALL-UNNAMED ^
  -Djdk.tls.namedGroups="secp256r1,secp384r1,secp521r1" ^
  -Djdk.tls.acknowledgeCloseNotify=true ^
  -Djdk.tls.client.protocols=TLSv1.2 ^
  -jar target/foodhub-backend-0.0.1-SNAPSHOT.jar


