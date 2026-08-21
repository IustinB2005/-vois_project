## Pornire Proiect

Ai nevoie de Docker Desktop instalat și pornit

Rulează comanda din folderul principal:
docker compose up --build

Frontend: http://localhost:5173
Backend: http://localhost:8000



## Rulare proiect pe Linux cu Docker

### 1. Instalare Docker

Instaleaza Docker Engine si Docker Compose:

```bash
sudo apt update
sudo apt install docker.io docker-compose-plugin
```

Verifica instalarea:

```bash
docker --version
docker compose version
```

### 2. Pornirea serviciului Docker

Asigura-te ca Docker este pornit:

```bash
sudo systemctl start docker
```

Pentru ca Docker sa porneasca automat la pornirea sistemului:

```bash
sudo systemctl enable docker
```

Poti verifica daca Docker ruleaza cu:

```bash
sudo systemctl status docker
```

### 3. (Optional) Folosirea Docker fara `sudo`

Pentru a putea folosi comenzile Docker fara `sudo`, adauga utilizatorul curent in grupul `docker`:

```bash
sudo usermod -aG docker $USER
```

Dupa aceasta comanda, delogheaza-te si logheaza-te din nou.

Verifica apoi:

```bash
docker ps
```

Daca aceasta comanda functioneaza fara `sudo`, Docker este configurat corect.

### 4. Pornirea proiectului

Cloneaza repository-ul si intra in folderul principal al proiectului:

```bash
git clone <repository-url>
cd <project-directory>
```

Porneste aplicatia cu:

```bash
docker compose up --build
```

Prima pornire poate dura cateva minute deoarece Docker trebuie sa construiasca imaginile si sa instaleze dependentele.

### 5. Accesarea aplicatiei

Dupa ce containerele au pornit cu succes:

* **Frontend:** http://localhost:5173
* **Backend:** http://localhost:8000

Pentru a opri aplicatia, apasa:

```text
Ctrl + C
```

Sau poti opri containerele cu:

```bash
docker compose down
```
