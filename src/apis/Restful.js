import {axios} from 'axios';
import {Observable} from 'rxjs';
export default function Restful {
    function post(url, body):Observable<BasicAPIResponse> {

    }
    function get(url, parmString):Observable<BasicAPIResponse> {

    }
    return{
        post,
        get,
    }
}