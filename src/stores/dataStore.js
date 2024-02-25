import { runInAction, makeAutoObservable } from "mobx";
import { debounce } from "lodash";
import { mainApi } from "../utils/Api";

class DataStore {
  itemsArr = [];

  filteredItemsArr = [];

  currentPage = 1;

  totalItems = 0;

  pageSize = 50;

  pageSizeOptions = [5, 10, 15, 20, 25, 50, 100];

  filterFields = [];

  filterOptions = {};

  selectedFilters = {};

  loadingState = "pending";

  getFilterOptionsLoadingState = "pending";

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingState = (newState) => {
    runInAction(() => {
      this.loadingState = newState;
    });
  };

  setCurrentPage = async (newPage) => {
    await this.getPaginationData();
    runInAction(() => {
      this.currentPage = newPage;
    });
  };

  onShowSizeChange = (event, limit) => {
    runInAction(() => {
      this.pageSize = limit;
    });
  };

  getTotalItems = async () => {
    try {
      const { result } = await mainApi.getIds();
      runInAction(() => {
        this.totalItems = result.length;
      });
    } catch (error) {
      setTimeout(() => {
        this.getTotalItems();
      }, 1000);
    }
  };

  setFilterOptionsLoadingState = (newState) => {
    runInAction(() => {
      this.getFilterOptionsLoadingState = newState;
    });
  };

  getFilterOptions = async () => {
    this.setFilterOptionsLoadingState("loading");
    if (!this.filterFields.length) {
      try {
        const { result } = await mainApi.getFields();
        runInAction(() => {
          this.filterFields = result;
        });
      } catch (error) {
        console.log(error);
        setTimeout(async () => {
          await this.getFilterOptions();
        }, 1000);
      }
    }
    try {
      const [product, ...filterFields] = this.filterFields; // уберем поле product, оно избыточно
      const allRequests = filterFields.map((req) => mainApi.getFields(req));
      const allResponse = await Promise.all(allRequests);
      const newFilterOptions = {};
      filterFields.forEach((el, index) => {
        const uniqueValues = {};
        newFilterOptions[el] = allResponse[index].result
          .filter((elem) => {
            // оставим только уникальные
            if (!uniqueValues[elem]) {
              uniqueValues[elem] = true;
              return true;
            }
            return false;
          })
          .sort((a, b) => a - b)
          .map((item) => ({
            value: item ?? "emptyValue",
            label: item ?? "Не указано",
          }));
      });
      runInAction(() => {
        this.filterOptions = newFilterOptions;
        this.setFilterOptionsLoadingState("done");
      });
    } catch (error) {
      setTimeout(() => {
        this.getFilterOptions();
      }, 1000);
      this.setFilterOptionsLoadingState("error");
    }
  };

  getFilterData = async () => {
    runInAction(() => {
      this.filteredItemsArr = [];
    });
    this.setLoadingState("loading");
    try {
      const { result } = await mainApi.getFilter(this.selectedFilters);
      await this.getItemsData(result);
    } catch (e) {
      console.log(e);
      this.setLoadingState("error");
    }
  };

  getPaginationData = async () => {
    runInAction(() => {
      this.itemsArr = [];
      this.filteredItemsArr = [];
    });
    this.setLoadingState("loading");
    const req = {
      offset: this.currentPage * this.pageSize,
      limit: this.pageSize,
    };
    try {
      const { result: itemIds } = await mainApi.getIds(req);
      await this.getItemsData(itemIds);
    } catch (error) {
      console.log(error);
      this.setLoadingState("error");
    }
  };

  getItemsData = async (itemIds) => {
    try {
      const { result: items } = await mainApi.getItems(itemIds);
      const newItems = [];
      items.reduce((acc, curr) => {
        if (!acc[curr.id]) newItems.push(curr);
        acc[curr.id] = true;
        return acc;
      }, {});
      runInAction(() => {
        if (Object.keys(this.selectedFilters).length > 0) {
          this.filteredItemsArr = newItems;
        } else this.itemsArr = newItems;
      });
      this.setLoadingState("done");
    } catch (error) {
      console.log(error);
      this.setLoadingState("error");
    }
  };

  handleSelectFilter = async (event, field) => {
    let value;
    if (event && event.target) value = event.target?.value;
    await this.setFilters(value, field);
  };

  debouncedGetFilterData = debounce(async () => {
    await this.getFilterData();
  }, 700);

  getData = (withDebounce) => {
    if (Object.keys(this.selectedFilters).length > 0) {
      if (withDebounce) this.debouncedGetFilterData();
      else this.getFilterData();
    } else this.getPaginationData();
  };

  setFilters = async (value, field) => {
    const newFilters = {
      [field]: value,
    };
    runInAction(() => {
      this.selectedFilters = value ? newFilters : {};
      this.getData(field === "product");
    });
  };
}

const dataStore = new DataStore();

export { dataStore };
