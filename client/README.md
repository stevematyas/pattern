## Local Development
When attempting to run or debug locally on your machine, you will need to alter the package.json `proxy` to specify `localhost`
instead of `server` (docker hostname)
```
--- a/client/package.json
+++ b/client/package.json
@@ -26,7 +26,7 @@
     "socket.io-client": "^4.7.4"
   },
   "scripts": {
-    "start": "PORT=3001 react-scripts start",
+    "start": "PORT=3001 REACT_APP_PLAID_ENV=sandbox REACT_APP_SERVER=http://localhost:5001 REACT_APP_PROXY=http://localhost:5001 REACT_APP_SERVER_PORT=5001 react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test",
     "eject": "react-scripts eject",
@@ -61,5 +61,5 @@
   },
   "resolutions": {
   },
-  "proxy": "http://server:5001"
+  "proxy": "http://localhost:5001"
 }

```
