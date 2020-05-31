// import { toast } from "react-toastify";
const baseUrl = "http://131.181.190.87:3001/";

export default function apiGET(url) {
  return fetch(`${baseUrl}${url}`).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      //   toast.error("Error: Could not retrieve information");
    }
  });
}
