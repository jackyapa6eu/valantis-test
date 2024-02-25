import moment from "moment";
import md5 from "md5";

class Api {
  constructor({ mainUrl, timeStamp, password }) {
    this.mainUrl = mainUrl;
    this.timeStamp = timeStamp;
    this.password = password;
  }

  get postHeaders() {
    return {
      "Content-Type": "application/json",
      "X-Auth": md5(`${this.password}_${this.timeStamp}`),
    };
  }

  getResponseData = async (res) => {
    if (res.ok) return res.json();
    try {
      const errorData = await res.json();
      console.error(
        `Запрос завершился с ошибкой. Статус: ${res.status}: ${errorData.message}`,
      );
      return Promise.reject(
        new Error(
          `Request failed with status ${res.status}: ${errorData.message}`,
        ),
      );
    } catch (error) {
      return Promise.reject(
        new Error(`Error parsing JSON response: ${error.message}`),
      );
    }
  };

  fetcher = async ({ path = "", method, action, params }) => {
    const options = {
      method: method ?? "POST",
      headers: this.postHeaders,
    };
    const req = {
      action,
      params,
    };
    if (!params) delete req.params;
    options.body = JSON.stringify(req);

    const clonedOptions = JSON.parse(JSON.stringify(options));

    // const response = await fetch(`${this.mainUrl}/${path}`, options);
    // return this.getResponseData(response, clonedOptions);
    try {
      const response = await fetch(`${this.mainUrl}/${path}`, options);
      return this.getResponseData(response, clonedOptions);
    } catch (error) {
      console.error(`При попытке запроса произошла ошибка: ${error.message}`);
      return Promise.reject(new Error(`Error fetching data: ${error.message}`));
    }
  };

  getIds = (params) => {
    const req = { action: "get_ids", params: { offset: 0 } };
    if (params) req.params = params;
    return this.fetcher(req);
  };

  getItems = (ids) => {
    const params = { ids };
    return this.fetcher({ action: "get_items", params });
  };

  getFields = (field) => {
    const req = {
      action: "get_fields",
      params: { field },
    };

    if (!field) delete req.params;
    return this.fetcher(req);
  };

  getFilter = (reqObj) => {
    const req = {
      action: "filter",
      params: reqObj,
    };
    return this.fetcher(req);
  };
}

const todayTimestamp = moment().utc().format("YYYYMMDD");
const password = "Valantis";

const mainApi = new Api({
  mainUrl: "http://api.valantis.store:40000",
  timeStamp: todayTimestamp,
  password,
});

export { mainApi };
