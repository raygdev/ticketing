import axios from 'axios'

const buildClient = ({ req /** Incoming request to ingress (or server from the browser) */ }) => {
    if(typeof window === 'undefined') {
        //we are on the server
        return axios.create({
            // communicate with another pod in kubernetes
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            //forward request headers
            headers: req.headers
        })

    } else {
        //we are on the client
        return axios.create({
            baseURL: '/'
        })
    }
}

export default buildClient