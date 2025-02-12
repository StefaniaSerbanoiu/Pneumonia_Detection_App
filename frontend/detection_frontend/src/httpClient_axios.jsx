import axios from "axios";

/*
creating an axios instance that allows sending cookies along with the HTTP request.
this will include cookies in the request headers (necessary when authenticating, to store user's id of the session)
*/

const httpClient_axios = axios.create({
    withCredentials: true // automatically includes cookies
  });

export default httpClient_axios;