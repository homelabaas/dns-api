docker stop dnsapi
docker rm dnsapi
docker build . -t dnsapi
docker run --name dnsapi -d -p 8080:80 -p 8053:53/udp dnsapi
