import forge from 'mappersmith';
import EncodeJson from 'mappersmith/middlewares/encode-json';
import GlobalErrorHandler, { setErrorHandler } from 'mappersmith/middlewares/global-error-handler';
import Manifest from './manifest';
import FetchGateway from 'mappersmith/gateway/fetch';
import { configs } from 'mappersmith';
import BasicAuthMiddleware from 'mappersmith/middlewares/basic-auth';

configs.gatewayConfigs.XHR = {
    withCredentials: true,
    configure(xhr) {
        xhr.ontimeout = () => console.error('timeout!')
    }
}

setErrorHandler((response) => {
    console.log(response);
    return false;
});

const Client = forge({
  middlewares: [ EncodeJson, GlobalErrorHandler ],
  ...Manifest
});

export default Client;
