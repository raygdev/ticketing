import axios from 'axios'

const Landing = ({ currentUser }) => {
    return <h1>Landing Page {currentUser?.email}</h1>
}

Landing.getInitialProps = async ({ req /**Incoming request to ingress (or server) */}) => {
    try{
        if(typeof window === 'undefined') {
            //we are on the server
            console.log('server')
            const response = await axios.get(
                'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
                    //forward the incoming headers
                    headers: req.headers
                }
            )
            return response.data
        } else {
            // we are on the browser
            const response = await axios.get('/api/users/currentuser')
            return response.data
        }
    } catch(e) {
        console.log(e)
        return {}
    }
}

export default Landing