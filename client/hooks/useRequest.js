import axios from "axios";
import { useState } from "react";

function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, {...body, ...props});

      if(onSuccess) {
        onSuccess(response.data)
      }

      return response.data;
    } catch (e) {
        console.log(e, 'error')
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul>
            {e.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}

export default useRequest
