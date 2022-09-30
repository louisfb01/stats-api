# Stats API

### Overview

- **Description:** This repository implements the code required to performs statistical computations on de-identified data. It receives requests from the [site API](https://github.com/coda-platform/site-api) and communicates with the [site store](https://github.com/coda-platform/site-store) to obtain the de-identified data necessary to fulfill these requests.
- **Primary author(s):** Kevin Arsenault [[@arsenaultk9](https://github.com/arsenaultk9)], Xuefei Shi [[@xuefeishi](https://github.com/xuefeishi)], Jeffrey Li [[@JeffreyLi16](https://github.com/JeffreyLi16)], Maxime Lavigne [[@malavv](https://github.com/malavv)].
- **Contributors:** Julien Levesque [[@JulienL3vesque](https://github.com/JulienL3vesque)], Louis Mullie [[@louism](https://github.com/louismullie)], Pascal St-Onge [[@stongepa](https://github.com/stongepa)].
- **License:** The code in this repository is released under the GNU General Public License, V3.

### Deployment

**Production**

Authenticate on Docker, then run `publish.sh` as follows:

```
docker login -u ${USER} -p ${USER}
./publish.sh
```

Finally, wait for the ansible script to execute on site hosts (executes at each 10 min and takes about 3 min to run).

**Local deployment**

```
npm run start
```

### Security analysis

**Trivy (Most severe)**

```
docker run --rm -v C:\dev\trivy:/root/.cache/ -v //var/run/docker.sock:/var/run/docker.sock  aquasec/trivy image coda-learning-api:latest --security-checks vuln > report.txt
```

**npm**

```
npm audit
```
