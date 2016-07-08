ParkPing
-
This is a one day hackathon project for [Smart Transportation & Energy Hackathon](http://devpost.com/software/parkping).

Frontend and backend is incomplete.

Install & Run
-
You need docker and a provider for docker-machine.
Start your docker machine and and run 

Eval your machine´s env vars:
```
$ eval $(docker-machine env)
```

Build the images and install dependencies:
```
$ docker-compose up --build -d
```

Check the `docker-compose.yml` file for more settings.

By default, nginx exposes frontend under `parking.foo` domain and api at `api.parking.foo`.
To reach it, you should edit your `/etc/hosts` file and add your docker-machine´s ip.
```
$ cat /etc/hosts
192.168.99.100 api.parking.foo
192.168.99.100 parking.foo
```

Open your browser, go to `parking.foo` and have fun
