# NATS Test

## Setting up nats

Use an image from Docker hub: `nats-streaming:0.17.0`. Nats streaming is now depricated and only used here for ease of setup. To setup a kubenetes deployment and service create a yaml file in `infra/k8s` directory called `nats-depl.yaml`. 

in the yaml file
```yaml
## specifiy the api version
apiVersion: apps/v1
## specify the object kind
kind: Deployment
matadata:
  ## name the deployment
  name: nats-depl
spec:
  ## how many replica deployments do you want?
  replicas: 1
  ## the pod to identify with a selector
  selector:
    ## match with the label
    matchLabels:
      app: nats
    template:
      metadata:
        labels:
          app: nats
      spec:
        container:
          ## - denotes an array
          - name: nats
            ## specify the image to use
            image: nats-streaming:0.17.0
            ## provide the args to the container
            args: [
                # specify the port for the client
                '-p',
                '4222',
                ## specify the port for monitoring
                '-m',
                '8222',
                ## interval for heartbeats
                '-hbi',
                '5s',
                ## set heartbeat timeout
                '-hbt',
                '5s',
                ## set heartbeat fail count to close server
                '-hbf',
                '2',
                ## enable stan debugging output
                '-SD',
                ## set the cluster id (defaults to test-cluster)
                '-cid',
                'ticketing'
            ]
## Separate the deploy from the service with 3 dashes
---
apiVersion: v1
kind: Service
metadata:
 name: nats-srv
spec:
  selector:
    app: nats
  ## give a name and define a port
  ports:
  ## define ports for both client and monitoring to make both
  ## reachable. These are both ports from args in the deployment object
    - name: client
      protocol: TCP
      port: 4222
      targetPort: 4222
    - name: monitoring
      protocol: TCP
      port: 8222
      targetPort: 8222
```