Build docker file to run

```bash
 docker build -t react-prod-tag .  
 # run dockerfile
 docker run -p 80:80 react-prod-tag
 ```

 Build and run dev
 ```bash
 # --no-cache optional after build if errors
 docker build -f Dockerfile.dev -t react-dev-tag . 
 # run dev container
 docker run -v ${PWD}:/var/www -v /var/www/node_modules -p 8080:8080 -ti --rm --name dev-react-name react-dev-tag
 # visit localhost 8080 to view live reloading :D
 ```